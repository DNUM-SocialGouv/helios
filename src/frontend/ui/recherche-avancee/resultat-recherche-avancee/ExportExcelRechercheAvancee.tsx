

import { useContext } from "react";
import * as XLSX from "xlsx";

import { Résultat, RésultatDeRecherche } from "../../../../backend/métier/entities/RésultatDeRecherche";
import { RechercheAvanceeContext, RechercheAvanceeContextValue } from "../../commun/contexts/RechercheAvanceeContext";
import { UserContext } from "../../commun/contexts/userContext";
import { UserListViewModel } from "../../user-list/UserListViewModel";

const orderByMap = new Map([
  ["type", "Type"],
  ["raison_sociale_courte", "Raison sociale"],
  ["commune", "Commune"],
  ["departement", "Département"],
  ["numero_finess", "Numéro FINESS"],
]);

export function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const currentDate = `${year}${month}${day}`;
  return currentDate;
}

async function getData(context: RechercheAvanceeContextValue) {
  const { terme, zoneGeo, zoneGeoD, zoneGeoType, typeStructure, statutJuridiqueStructure, capaciteMedicoSociaux, capaciteHandicap, capaciteAgees, orderBy, order } = context;

  const capacites = [
    { classification: "non_classifie", ranges: capaciteMedicoSociaux || [] },
    { classification: "publics_en_situation_de_handicap", ranges: capaciteHandicap || [] },
    { classification: "personnes_agees", ranges: capaciteAgees || [] },
  ].filter((capacite) => capacite.ranges && capacite.ranges.length > 0);

  return fetch("/api/recherche-avancee", {
    body: JSON.stringify({ terme, zone: zoneGeo, zoneD: zoneGeoD, typeZone: zoneGeoType, type: typeStructure, statutJuridique: statutJuridiqueStructure, capaciteSMS: capacites, orderBy, order, forExport: true }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  })
    .then((response) => response.json())
    .then((data: RésultatDeRecherche) => {
      return ({
        resultats: data.résultats,
      })
    }
    )
}

function getFavoris(favoris: UserListViewModel[] | undefined, numeroFiness: string): string {
  const isFavoris = favoris?.some(list => list.userListEtablissements.some(etablissement => etablissement.finessNumber === numeroFiness));
  return isFavoris ? "Oui" : "Non"
}

function transformData(data: any, favoris: UserListViewModel[] | undefined) {
  return data.resultats.map((etab: Résultat) => [
    etab.type ?? "-",
    getFavoris(favoris, etab.numéroFiness),
    etab.raisonSocialeCourte ?? "-",
    etab.commune,
    etab.département,
    etab.numéroFiness,
    etab.rattachement,
  ]);
}

function ExportToExcel(
  data: (string | number)[][],
  fileName: string,
) {
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Comparaison");
  XLSX.writeFile(wb, fileName);
}

function generateCriteriaData(context: RechercheAvanceeContextValue): { criteriaHeader: string[], criteriaInformation: string[] } {
  //  terme, zoneGeo, zoneGeoD, zoneGeoType, typeStructure, statutJuridiqueStructure, capaciteMedicoSociaux, capaciteHandicap, capaciteAgees, orderBy, order
  //
  const { terme, zoneGeoLabel, typeStructure, statutJuridiqueStructure, capaciteMedicoSociaux, capaciteHandicap, capaciteAgees, orderBy, order } = context;

  const criteriaHeader = [];
  const criteriaInformation = [];

  if (terme) {
    criteriaHeader.push("Terme");
    criteriaInformation.push(terme);
  }
  if (zoneGeoLabel) {
    criteriaHeader.push("Zone géographique");
    criteriaInformation.push(zoneGeoLabel);
  }

  if (typeStructure) {
    criteriaHeader.push("Type de structure");
    criteriaInformation.push(typeStructure);
  }

  if (statutJuridiqueStructure?.length > 0) {
    criteriaHeader.push("Status juridique");
    criteriaInformation.push(statutJuridiqueStructure.join(', '));
  }

  if (capaciteMedicoSociaux?.length > 0) {
    criteriaHeader.push("Capacité etablissement sociaux et Médico-sociaux");
    criteriaInformation.push(capaciteMedicoSociaux.join(', '));
  }

  if (capaciteHandicap?.length > 0) {
    criteriaHeader.push("Capacité etablissement public en situation de handicap");
    criteriaInformation.push(capaciteHandicap.join(', '));
  }

  if (capaciteAgees?.length > 0) {
    criteriaHeader.push("Capacité etablissement pour personnes agées");
    criteriaInformation.push(capaciteAgees.join(', '));
  }

  if (orderBy) {
    criteriaHeader.push("Tri");
    criteriaInformation.push(orderByMap.get(orderBy) ?? "");
  }

  if (order) {
    criteriaHeader.push("Ordre");
    criteriaInformation.push((order === "ASC" ? "Croissant" : "Décroissant"));
  }


  return { criteriaHeader, criteriaInformation };
}

async function generateAndExportExcel(context: RechercheAvanceeContextValue | undefined, favoris: UserListViewModel[] | undefined) {
  if (context) {
    const fileName: string = `${getCurrentDate()}_Helios_rechercheavancee.xlsx`;
    const data = await getData(context);
    const dataTransormed = transformData(data, favoris);

    const searchHeader = ["Critères de recherche"];
    const { criteriaHeader, criteriaInformation } = generateCriteriaData(context);

    const dataHeaders = [
      "Type d'établissement",
      "Favoris",
      "Raison Sociale",
      "Ville",
      "Département",
      "FINESS",
      "Rattachement(s)"
    ];

    const exportData = [searchHeader, criteriaHeader, criteriaInformation, [""], dataHeaders, ...dataTransormed];
    ExportToExcel(exportData, fileName,);
  }
}

const ExportExcelRechercheAvancee = ({ disabled }: { disabled: boolean }) => {
  const userContext = useContext(UserContext);
  const rechercheAvanceeContext = useContext(RechercheAvanceeContext);

  return (
    <button
      className="fr-btn fr-btn--tertiary-no-outline"
      disabled={disabled}
      name="Exporter"
      onClick={() => generateAndExportExcel(rechercheAvanceeContext, userContext?.favorisLists)}
      title="Exporter"
      type="button"
    >
      Exporter
    </button>
  );
};

export default ExportExcelRechercheAvancee;

