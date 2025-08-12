

import { useContext } from "react";
import * as XLSX from "xlsx";

import { Résultat, RésultatDeRecherche } from "../../../../backend/métier/entities/RésultatDeRecherche";
import { RechercheAvanceeContext, RechercheAvanceeContextValue } from "../../commun/contexts/RechercheAvanceeContext";
import { UserContext } from "../../commun/contexts/userContext";
import { UserListViewModel } from "../../user-list/UserListViewModel";
import { CategoriesFinessViewModel } from "../model/CategoriesFinessViewModel";

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
  const { terme, zoneGeo, zoneGeoD, zoneGeoType, typeStructure, statutJuridiqueStructure, capaciteMedicoSociaux, capaciteHandicap, capaciteAgees, activiteMco, activitePsy, activiteSsr, activiteUsld, categories, orderBy, order } = context;

  const capacites = [
    { classification: "non_classifie", ranges: capaciteMedicoSociaux || [] },
    { classification: "publics_en_situation_de_handicap", ranges: capaciteHandicap || [] },
    { classification: "personnes_agees", ranges: capaciteAgees || [] },
  ].filter((capacite) => capacite.ranges && capacite.ranges.length > 0);

  const activites = [
    { classification: "mco", ranges: activiteMco || [] },
    { classification: "psy", ranges: activitePsy || [] },
    { classification: "ssr", ranges: activiteSsr || [] },
    { classification: "usld", ranges: activiteUsld || [] },
  ].filter((activite) => activite.ranges && activite.ranges.length > 0);

  return fetch("/api/recherche-avancee", {
    body: JSON.stringify({ terme, zone: zoneGeo, zoneD: zoneGeoD, typeZone: zoneGeoType, type: typeStructure, statutJuridique: statutJuridiqueStructure, capaciteSMS: capacites, activiteSAN: activites, categories, orderBy, order, forExport: true }),
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
    etab.categorie ?? "-",
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

function TransformeCapacitiesetActivites(
  ranges: string[]
) {
  return ranges.map(range => {
    if (range.startsWith('>')) {
      const value = parseInt(range.substring(1), 10);
      return `${value + 1} et plus`;
    } else {
      return range.replace(',', '-');
    }
  });
}

function SortRanges(
  ranges: string[]
) {
  return ranges.sort((a, b) => {
    // Extract the first number from each range
    const getLowerBound = (range: string) => {
      if (range.startsWith('>')) {
        return parseInt(range.substring(1), 10);
      } else {
        return parseInt(range.split(',')[0], 10);
      }
    };

    const lowerA = getLowerBound(a);
    const lowerB = getLowerBound(b);

    return lowerA - lowerB;
  });
}

function TransformeCategories(categoriesFiness: CategoriesFinessViewModel[], categories: string[]) {
  const codeToLabelMap = new Map(categoriesFiness.map(cat => [cat.categorieCode, cat.categorieLibelleCourt]));
  return categories.map(code => codeToLabelMap.get(code));
}

function generateCriteriaData(context: RechercheAvanceeContextValue, categoriesFiness: CategoriesFinessViewModel[]): { criteriaHeader: string[], criteriaInformation: string[] } {
  const { terme,
    zoneGeoLabel,
    typeStructure,
    statutJuridiqueStructure,
    categories,
    capaciteMedicoSociaux,
    capaciteHandicap,
    capaciteAgees,
    activiteMco,
    activitePsy,
    activiteSsr,
    activiteUsld,
    orderBy,
    order
  } = context;

  const criteriaHeader = [];
  const criteriaInformation = [];

  const addSimpleCriteria = (value: any, header: string) => {
    if (value) {
      criteriaHeader.push(header);
      criteriaInformation.push(value);
    }
  };

  const addArrayCriteria = (values: any[], header: string) => {
    if (values?.length > 0) {
      criteriaHeader.push(header);
      criteriaInformation.push(values.join(', '));
    }
  };

  addSimpleCriteria(terme, "Terme");
  addSimpleCriteria(zoneGeoLabel, "Zone géographique");
  addArrayCriteria(typeStructure, "Type de structure");
  addArrayCriteria(statutJuridiqueStructure, "Status juridique");

  if (categories?.length > 0) {
    criteriaHeader.push("Catégorie FINESS");
    criteriaInformation.push(TransformeCategories(categoriesFiness, categories).join(', '));
  }

  if (capaciteMedicoSociaux?.length > 0) {
    criteriaHeader.push("Capacité etablissement sociaux et Médico-sociaux");
    criteriaInformation.push(TransformeCapacitiesetActivites(SortRanges(capaciteMedicoSociaux)).join(', '));
  }

  if (capaciteHandicap?.length > 0) {
    criteriaHeader.push("Capacité etablissement public en situation de handicap");
    criteriaInformation.push(TransformeCapacitiesetActivites(SortRanges(capaciteHandicap)).join(', '));
  }

  if (capaciteAgees?.length > 0) {
    criteriaHeader.push("Capacité etablissement pour personnes agées");
    criteriaInformation.push(TransformeCapacitiesetActivites(SortRanges(capaciteAgees)).join(', '));
  }

  if (activiteMco?.length > 0) {
    criteriaHeader.push("Activité MCO");
    criteriaInformation.push(TransformeCapacitiesetActivites(SortRanges(activiteMco)).join(', '));
  }
  if (activitePsy?.length > 0) {
    criteriaHeader.push("Activité PSY");
    criteriaInformation.push(TransformeCapacitiesetActivites(SortRanges(activitePsy)).join(', '));
  }
  if (activiteSsr?.length > 0) {
    criteriaHeader.push("Activité SSR");
    criteriaInformation.push(TransformeCapacitiesetActivites(SortRanges(activiteSsr)).join(', '));
  }
  if (activiteUsld?.length > 0) {
    criteriaHeader.push("Activité USLD");
    criteriaInformation.push(TransformeCapacitiesetActivites(SortRanges(activiteUsld)).join(', '));
  }

  if (orderBy && order) {
    criteriaHeader.push("Tri");
    criteriaInformation.push(orderByMap.get(orderBy) ?? "");
    criteriaHeader.push("Ordre");
    criteriaInformation.push((order === "ASC" ? "Croissant" : "Décroissant"));
  }

  return { criteriaHeader, criteriaInformation };
}

async function generateAndExportExcel(context: RechercheAvanceeContextValue | undefined, favoris: UserListViewModel[] | undefined, categories: CategoriesFinessViewModel[]) {
  if (context) {
    const fileName: string = `${getCurrentDate()}_Helios_rechercheavancee.xlsx`;
    const data = await getData(context);
    const dataTransormed = transformData(data, favoris);

    const searchHeader = ["Critères de recherche"];
    const { criteriaHeader, criteriaInformation } = generateCriteriaData(context, categories);

    const dataHeaders = [
      "Type d'établissement",
      "Favoris",
      "Raison Sociale",
      "Cat. FINESS",
      "Ville",
      "Département",
      "FINESS",
      "Rattachement(s)"
    ];

    const exportData = [searchHeader, criteriaHeader, criteriaInformation, [""], dataHeaders, ...dataTransormed];
    ExportToExcel(exportData, fileName,);
  }
}

const ExportExcelRechercheAvancee = ({ disabled, categories }: {
  disabled: boolean, categories: CategoriesFinessViewModel[]
}) => {
  const userContext = useContext(UserContext);
  const rechercheAvanceeContext = useContext(RechercheAvanceeContext);

  return (
    <button
      className="fr-btn fr-btn--tertiary-no-outline"
      disabled={disabled}
      name="Exporter"
      onClick={() => generateAndExportExcel(rechercheAvanceeContext, userContext?.favorisLists, categories)}
      title="Exporter"
      type="button"
    >
      Exporter
    </button>
  );
};

export default ExportExcelRechercheAvancee;

