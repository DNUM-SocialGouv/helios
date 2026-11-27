import { randomBytes } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

import { proConnectWellKnown } from "../auth/[...nextauth]";

let endSessionEndpoint: string | undefined;

async function getEndSessionEndpoint(): Promise<string | undefined> {
  if (!endSessionEndpoint && proConnectWellKnown) {
    const response = await fetch(proConnectWellKnown);
    if (response.ok) {
      const configuration = (await response.json()) as { end_session_endpoint?: string };
      endSessionEndpoint = configuration.end_session_endpoint;
    }
  }
  return endSessionEndpoint;
}

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== "GET") {
    return response.status(405).send("Method not allowed");
  }

  const token = await getToken({ req: request, secret: process.env["NEXTAUTH_SECRET"] });
  const idToken = token?.["idToken"];
  if (token?.["provider"] !== "proconnect" || typeof idToken !== "string") {
    return response.status(200).json({ url: null });
  }

  const endpoint = await getEndSessionEndpoint();
  if (!endpoint) {
    return response.status(200).json({ url: null });
  }

  const url = new URL(endpoint);
  url.searchParams.set("id_token_hint", idToken);
  url.searchParams.set("state", randomBytes(32).toString("hex"));
  url.searchParams.set("post_logout_redirect_uri", process.env["PROCONNECT_POST_LOGOUT_REDIRECT_URI"] ?? `${process.env["NEXTAUTH_URL"]}/connexion`);

  return response.status(200).json({ url: url.toString() });
}
