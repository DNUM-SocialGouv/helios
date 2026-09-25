import { isIP } from "node:net";

import type { NextApiRequest, NextApiResponse } from "next";

const TAILLE_MAXIMALE_DU_CORPS = 64 * 1024;
const DELAI_MAXIMAL_MATOMO_EN_MS = 5_000;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const cheminMatomo = cheminAutorise(request);
  if (!cheminMatomo) {
    response.status(404).end();
    return;
  }

  const cibleMatomo = process.env["MATOMO_PROXY_TARGET"];
  if (!cibleMatomo) {
    response.status(500).send("Relais Matomo non configuré");
    return;
  }

  try {
    const cible = new URL(`/${cheminMatomo}`, cibleMatomo);
    for (const [cle, valeur] of Object.entries(request.query)) {
      if (cle === "path") continue;
      if (typeof valeur === "string") cible.searchParams.set(cle, valeur);
      else if (Array.isArray(valeur)) valeur.forEach((element) => cible.searchParams.append(cle, element));
    }

    const corps = request.method === "POST" ? await lireCorps(request) : undefined;
    const controleur = new AbortController();
    const timeout = setTimeout(() => controleur.abort(), DELAI_MAXIMAL_MATOMO_EN_MS);

    const reponseMatomo = await fetch(cible, {
      method: request.method,
      headers: entetesTransmises(request),
      body: corps,
      signal: controleur.signal,
    }).finally(() => clearTimeout(timeout));
    transmettreEntetesDeReponse(reponseMatomo, response);
    if (reponseMatomo.status === 204 || reponseMatomo.status === 304) {
      response.status(reponseMatomo.status).end();
      return;
    }

    response.status(reponseMatomo.status).send(Buffer.from(await reponseMatomo.arrayBuffer()));
  } catch (erreur) {
    if (erreur instanceof CorpsTropVolumineux) {
      response.status(413).end();
      return;
    }

    response.status(502).send("Erreur relais Matomo");
  }
}

function cheminAutorise(request: NextApiRequest): "matomo.js" | "matomo.php" | null {
  const chemin = request.query["path"];
  if (!Array.isArray(chemin) || chemin.length !== 1) return null;

  const fichier = chemin[0];
  if (request.method === "GET" && fichier === process.env["NEXT_PUBLIC_MATOMO_PROXY_JS_TRACKER_FILE"]) {
    return "matomo.js";
  }

  if ((request.method === "GET" || request.method === "POST") && fichier === process.env["NEXT_PUBLIC_MATOMO_PROXY_PHP_TRACKER_FILE"]) {
    return "matomo.php";
  }

  return null;
}

function entetesTransmises(request: NextApiRequest): Headers {
  const entetes = new Headers();
  copieEntete(request, entetes, "user-agent");
  copieEntete(request, entetes, "accept");
  copieEntete(request, entetes, "accept-language");
  copieEntete(request, entetes, "content-type");

  const ipAnonymisee = anonymiserIp(extraireIpClient(request));
  if (ipAnonymisee) entetes.set("x-forwarded-for", ipAnonymisee);

  return entetes;
}

function copieEntete(request: NextApiRequest, entetes: Headers, nom: string) {
  const valeur = request.headers[nom];
  if (typeof valeur === "string") entetes.set(nom, valeur);
}

function extraireIpClient(request: NextApiRequest): string | undefined {
  const chaine = request.headers["x-forwarded-for"];
  if (typeof chaine !== "string") return request.socket.remoteAddress;

  const ips = chaine.split(",").map((ip) => ip.trim()).filter(Boolean);
  return ips.at(-1) ?? request.socket.remoteAddress;
}

function anonymiserIp(ip: string | undefined): string | undefined {
  if (!ip) return undefined;

  const ipSansZone = ip.replace(/^\[|\]$/g, "").split("%")[0];
  const ipv4Mappee = /^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/i.exec(ipSansZone);
  if (ipv4Mappee) return anonymiserIpv4(ipv4Mappee[1]);

  if (isIP(ipSansZone) === 4) return anonymiserIpv4(ipSansZone);
  if (isIP(ipSansZone) === 6) return anonymiserIpv6(ipSansZone);

  return undefined;
}

function anonymiserIpv4(ip: string): string | undefined {
  const octets = ip.split(".").map(Number);
  if (octets.length !== 4 || octets.some((octet) => !Number.isInteger(octet) || octet < 0 || octet > 255)) return undefined;

  return `${octets[0]}.${octets[1]}.0.0`;
}

function anonymiserIpv6(ip: string): string | undefined {
  const groupes = etendreIpv6(ip);
  if (!groupes) return undefined;

  return `${groupes[0]}:${groupes[1]}:${groupes[2]}::`;
}

function etendreIpv6(ip: string): string[] | undefined {
  if (ip.includes(".")) return undefined;

  const parties = ip.split("::");
  if (parties.length > 2) return undefined;

  const gauche = groupesIpv6(parties[0]);
  const droite = parties.length === 2 ? groupesIpv6(parties[1]) : [];
  if (!gauche || !droite) return undefined;

  const groupesManquants = 8 - gauche.length - droite.length;
  if (groupesManquants < 0 || (parties.length === 1 && groupesManquants !== 0)) return undefined;

  return [...gauche, ...Array(groupesManquants).fill("0"), ...droite].map((groupe) => Number.parseInt(groupe, 16).toString(16));
}

function groupesIpv6(partie: string): string[] | undefined {
  if (!partie) return [];

  const groupes = partie.split(":");
  if (groupes.some((groupe) => !/^[0-9a-f]{1,4}$/i.test(groupe))) return undefined;

  return groupes;
}

async function lireCorps(request: NextApiRequest): Promise<ArrayBuffer> {
  const morceaux: Buffer[] = [];
  let taille = 0;

  for await (const morceau of request) {
    const buffer = Buffer.isBuffer(morceau) ? morceau : Buffer.from(morceau);
    taille += buffer.length;
    if (taille > TAILLE_MAXIMALE_DU_CORPS) throw new CorpsTropVolumineux();
    morceaux.push(buffer);
  }

  const corps = Buffer.concat(morceaux);
  return corps.buffer.slice(corps.byteOffset, corps.byteOffset + corps.byteLength) as ArrayBuffer;
}

function transmettreEntetesDeReponse(reponseMatomo: Response, response: NextApiResponse) {
  const contentType = reponseMatomo.headers.get("content-type");
  if (contentType) response.setHeader("content-type", contentType);

  const cacheControl = reponseMatomo.headers.get("cache-control");
  if (cacheControl) response.setHeader("cache-control", cacheControl);
}

class CorpsTropVolumineux extends Error {}