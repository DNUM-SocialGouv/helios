import { DataSource } from "typeorm";

import { EchelleTemporelleVigieRh } from "../../../../métier/entities/établissement-territorial-médico-social/EtablissementTerritorialMedicoSocialVigieRH";
import StringFormater from "../../../../../frontend/ui/commun/StringFormater";

const MOIS_LABELS = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

type DernierePeriode = Readonly<{
  annee: number | null;
  mois: number | null;
  trimestre: number | null;
}>;

type RequeteDernierePeriode = Readonly<{
  table: string;
  numeroFinessColumn: string;
  numeroFinessET: string;
  anneeColumn: string;
  moisColumn?: string;
  trimestreColumn?: string;
}>;

export async function construitEchelleTemporelleVigieRh(
  orm: Promise<DataSource>,
  numeroFinessET: string
): Promise<Record<string, EchelleTemporelleVigieRh>> {
  const [
    effectifsPeriod,
    effectifsGroupesPeriod,
    departsTrimestrielPeriod,
    natureTrimestrielPeriod,
    dureeTrimestrielPeriod,
    motifTrimestrielPeriod,
    globalTrimestrielPeriod,
  ] = await Promise.all([
    recupereDernierePeriode(orm, {
      anneeColumn: "annee",
      moisColumn: "mois",
      numeroFinessColumn: "numero_finess",
      numeroFinessET,
      table: "vigierh_profession_filiere",
    }),
    recupereDernierePeriode(orm, {
      anneeColumn: "annee",
      moisColumn: "mois",
      numeroFinessColumn: "numero_finess",
      numeroFinessET,
      table: "vigierh_profession_groupe",
    }),
    recupereDernierePeriode(orm, {
      anneeColumn: "annee",
      numeroFinessColumn: "numero_finess_etablissement_territorial",
      numeroFinessET,
      table: "vigierh_mouvements_trimestriel",
      trimestreColumn: "trimestre",
    }),
    recupereDernierePeriode(orm, {
      anneeColumn: "annee",
      numeroFinessColumn: "numero_finess_etablissement_territorial",
      numeroFinessET,
      table: "vigierh_nature_contrats_trimestriel",
      trimestreColumn: "trimestre",
    }),
    recupereDernierePeriode(orm, {
      anneeColumn: "annee",
      numeroFinessColumn: "numero_finess_etablissement_territorial",
      numeroFinessET,
      table: "vigierh_duree_cdd",
      trimestreColumn: "trimestre",
    }),
    recupereDernierePeriode(orm, {
      anneeColumn: "annee",
      numeroFinessColumn: "finess_et",
      numeroFinessET,
      table: "vigierh_motifs_ruptures",
      trimestreColumn: "trimestre",
    }),
    recupereDernierePeriode(orm, {
      anneeColumn: "annee",
      numeroFinessColumn: "numero_finess_etablissement_territorial",
      numeroFinessET,
      table: "vigierh_mouvements_trimestriel",
      trimestreColumn: "trimestre",
    }),
  ]);

  const globalPeriod = {
    annee: globalTrimestrielPeriod.annee,
    mois: numeroMoisDepuisTrimestre(globalTrimestrielPeriod.trimestre),
  };

  const echelle: Record<string, EchelleTemporelleVigieRh> = {};

  const dateGlobal = construitDateDernierJour(globalPeriod.annee, globalPeriod.mois);
  echelle["vr-pyramide-ages"] = {
    type: "MENSUEL",
    valeur: formatMensuel(globalPeriod.annee, globalPeriod.mois) ?? "",
    ...(dateGlobal ? { dateDonneesArretees: StringFormater.formatDate(dateGlobal) } : {}),
  };

  const departsTrimestreFormat = formatTrimestriel(departsTrimestrielPeriod.annee, departsTrimestrielPeriod.trimestre);
  const departsDate = construitDateDepuisTrimestre(departsTrimestrielPeriod.annee, departsTrimestrielPeriod.trimestre);
  echelle["vr-departs-embauches"] = {
    type: "TRIMESTRIEL",
    valeur: departsTrimestreFormat?.valeur ?? "",
    ...(departsTrimestreFormat?.transcription ? { valeurTranscription: departsTrimestreFormat.transcription } : {}),
    ...(departsDate ? { dateDonneesArretees: StringFormater.formatDate(departsDate) } : {}),
  };
  echelle["vr-taux-rotation"] = {
    type: "TRIMESTRIEL",
    valeur: departsTrimestreFormat?.valeur ?? "",
    ...(departsTrimestreFormat?.transcription ? { valeurTranscription: departsTrimestreFormat.transcription } : {}),
    ...(departsDate ? { dateDonneesArretees: StringFormater.formatDate(departsDate) } : {}),
  };

  const effectifsDate = construitDateDernierJour(effectifsPeriod.annee, effectifsPeriod.mois);
  echelle["vr-effectifs"] = {
    type: "MENSUEL",
    valeur: formatMensuel(effectifsPeriod.annee, effectifsPeriod.mois) ?? "",
    ...(effectifsDate ? { dateDonneesArretees: StringFormater.formatDate(effectifsDate) } : {}),
  };

  const effectifsGroupesDate = construitDateDernierJour(effectifsGroupesPeriod.annee, effectifsGroupesPeriod.mois);
  echelle["vr-effectifs-groupes"] = {
    type: "MENSUEL",
    valeur: formatMensuel(effectifsGroupesPeriod.annee, effectifsGroupesPeriod.mois) ?? "",
    ...(effectifsGroupesDate ? { dateDonneesArretees: StringFormater.formatDate(effectifsGroupesDate) } : {}),
  };

  const natureTrimestreFormat = formatTrimestriel(natureTrimestrielPeriod.annee, natureTrimestrielPeriod.trimestre);
  const natureDate = construitDateDepuisTrimestre(natureTrimestrielPeriod.annee, natureTrimestrielPeriod.trimestre);
  echelle["vr-nature-contrats"] = {
    type: "TRIMESTRIEL",
    valeur: natureTrimestreFormat?.valeur ?? "",
    ...(natureTrimestreFormat?.transcription ? { valeurTranscription: natureTrimestreFormat.transcription } : {}),
    ...(natureDate ? { dateDonneesArretees: StringFormater.formatDate(natureDate) } : {}),
  };

  const departsPrematuresDate = construitDateDernierJour(globalPeriod.annee, globalPeriod.mois);
  echelle["vr-departs-prematures-cdi"] = {
    type: "MENSUEL",
    valeur: formatMensuel(globalPeriod.annee, globalPeriod.mois) ?? "",
    valeurTranscription: formatMoisDepuisJanvier(globalPeriod.mois) ?? "",
    ...(departsPrematuresDate ? { dateDonneesArretees: StringFormater.formatDate(departsPrematuresDate) } : {}),
  };

  const dureeTrimestreFormat = formatTrimestriel(dureeTrimestrielPeriod.annee, dureeTrimestrielPeriod.trimestre);
  const dureeDate = construitDateDepuisTrimestre(dureeTrimestrielPeriod.annee, dureeTrimestrielPeriod.trimestre);
  echelle["vr-duree-cdd"] = {
    type: "TRIMESTRIEL",
    valeur: dureeTrimestreFormat?.valeur ?? "",
    ...(dureeTrimestrielPeriod?.annee && dureeTrimestrielPeriod?.trimestre ? { valeurVignette: `au T${dureeTrimestrielPeriod.trimestre}-${dureeTrimestrielPeriod.annee - 1}` } : {}),
    ...(dureeTrimestreFormat?.transcription ? { valeurTranscription: dureeTrimestreFormat.transcription } : {}),
    ...(dureeDate ? { dateDonneesArretees: StringFormater.formatDate(dureeDate) } : {}),
  };

  const motifsTrimestreFormat = formatTrimestriel(motifTrimestrielPeriod.annee, motifTrimestrielPeriod.trimestre);
  const motifDate = construitDateDepuisTrimestre(motifTrimestrielPeriod.annee, motifTrimestrielPeriod.trimestre);
  echelle["vr-motif-rupture"] = {
    type: "TRIMESTRIEL",
    valeur: motifsTrimestreFormat?.valeur ?? "",
    ...(motifsTrimestreFormat?.transcription ? { valeurTranscription: motifsTrimestreFormat.transcription } : {}),
    ...(motifDate ? { dateDonneesArretees: StringFormater.formatDate(motifDate) } : {}),
   
  };

  const indicateursGlobalDate = construitDateDernierJour(globalPeriod.annee, globalPeriod.mois);
  echelle["vr-indicateurs-global"] = {
    type: "MENSUEL",
    valeur: formatMensuel(globalPeriod.annee, globalPeriod.mois) ?? "",
    ...(indicateursGlobalDate ? { dateDonneesArretees: StringFormater.formatDate(indicateursGlobalDate) } : {}),
  };

  return echelle;
}

async function recupereDernierePeriode(orm: Promise<DataSource>, params: RequeteDernierePeriode): Promise<DernierePeriode> {
  const selectParts = [`${params.anneeColumn} AS annee`];
  const orderParts = [`${params.anneeColumn} DESC`];

  if (params.moisColumn) {
    selectParts.push(`${params.moisColumn} AS mois`);
    orderParts.push(`${params.moisColumn} DESC NULLS LAST`);
  }

  if (params.trimestreColumn) {
    selectParts.push(`${params.trimestreColumn} AS trimestre`);
    orderParts.push(`${params.trimestreColumn} DESC NULLS LAST`);
  }

  const query = `
      SELECT ${selectParts.join(", ")}
      FROM ${params.table}
      WHERE ${params.numeroFinessColumn} = $1
      ORDER BY ${orderParts.join(", ")}
      LIMIT 1
    `;

  const resultat = (await (await orm).query(query, [params.numeroFinessET]))[0] ?? null;

  return {
    annee: convertToNumber(resultat?.annee),
    mois: params.moisColumn ? convertToNumber(resultat?.mois) : null,
    trimestre: params.trimestreColumn ? convertToNumber(resultat?.trimestre) : null,
  };
}

function formatMensuel(annee?: number | null, mois?: number | null): string | null {
  if (!annee) {
    return null;
  }

  if (!mois || mois < 1 || mois > 12) {
    return `${annee}`;
  }

  return `${MOIS_LABELS[mois - 1]} ${annee}`;
}

function formatTrimestriel(
  annee?: number | null,
  trimestre?: number | null
): { valeur: string; transcription?: string } | null {
  if (!annee || !trimestre) {
    return null;
  }

  const debut = (trimestre - 1) * 3 + 1;
  const fin = debut + 2;
  const transcription = `${MOIS_LABELS[debut - 1]} à ${MOIS_LABELS[fin - 1]}`;

  return {
    valeur: `T${trimestre} ${annee}`,
    transcription,
  };
}

function numeroMoisDepuisTrimestre(trimestre?: number | null): number | null {
  if (!trimestre) {
    return null;
  }

  const mois = trimestre * 3;
  return Math.min(mois, 12);
}

function formatMoisDepuisJanvier(mois: number | null): string | null {
  if (!mois) return null;
  if (mois === 1) return `${MOIS_LABELS[0]}`;
  else return `de ${MOIS_LABELS[0]} à ${MOIS_LABELS[mois - 1]}`

}

function construitDateDernierJour(annee?: number | null, mois?: number | null): string | undefined {
  if (!annee || !mois) {
    return undefined;
  }
  const date = new Date(Date.UTC(annee, mois, 0));
  return date.toISOString().split("T")[0];
}

function construitDateDepuisTrimestre(annee?: number | null, trimestre?: number | null): string | undefined {
  const mois = numeroMoisDepuisTrimestre(trimestre);
  return construitDateDernierJour(annee, mois);
}

function convertToNumber(value: unknown): number | null {
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "string" && value !== "") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
}
