

import { useContext } from "react";
import * as XLSX from "xlsx";

import { MoyenneSMS, ResultatDeComparaison, ResultatSMS } from "../../../backend/métier/entities/ResultatDeComparaison";
import { UserContext } from "../commun/contexts/userContext";
import { RechercheViewModel } from "../home/RechercheViewModel";

export function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const currentDate = `${year}${month}${day}`;
  return currentDate;
}

function getType(type: string | undefined) {
  if (type === "Médico-social") return "Social et Médico-Social"
  else return type;
}

async function getComparaisonData(annee: string, order = "", orderBy = "", codeRegion: string, codeProfiles: string[]) {
  const listFiness = sessionStorage.getItem("listFinessNumbers");
  const typeStored = sessionStorage.getItem("comparaisonType");

  let parsedFiness = null;
  try {
    parsedFiness = listFiness ? JSON.parse(listFiness) : null;
  } catch (e) {
    alert("Error :" + e);
  }

  const type = typeStored || undefined;

  return fetch("/api/comparaison/compare", {
    body: JSON.stringify({ type, numerosFiness: parsedFiness, annee, order, orderBy, forExport: true, codeRegion, codeProfiles }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  })
    .then((response) => response.json())
    .then((data: ResultatDeComparaison) => {
      return ({ resultat: data.resultat, moyenne: data.moyennes, type })
    }
    )
}

function getFavoris(favoris: RechercheViewModel[] | undefined, numeroFiness: string): string {
  const filtredFavoris = favoris?.filter((item) => item.numéroFiness === numeroFiness);
  return filtredFavoris && filtredFavoris.length > 0 ? "Oui" : "Non"
}

function transformData(data: any, favoris: RechercheViewModel[] | undefined) {
  return data.resultat.map((etab: ResultatSMS) => [
    etab.type ?? "-",
    getFavoris(favoris, etab.numéroFiness),
    etab.socialReason ?? "-",
    etab.numéroFiness ?? "-",
    etab.capacite ?? "-",
    etab.realisationActivite === 'NA' ? '' : etab.realisationActivite === null ? '-' : etab.realisationActivite,
    etab.fileActivePersonnesAccompagnes === 'NA' ? '' : etab.fileActivePersonnesAccompagnes === null ? '-' : etab.fileActivePersonnesAccompagnes,
    etab.hebergementPermanent === 'NA' ? '' : etab.hebergementPermanent === null ? '-' : etab.hebergementPermanent,
    etab.hebergementTemporaire === 'NA' ? '' : etab.hebergementTemporaire === null ? '-' : etab.hebergementTemporaire,
    etab.acceuilDeJour === 'NA' ? '' : etab.acceuilDeJour === null ? '-' : etab.acceuilDeJour,
    etab.prestationExterne === 'NA' ? '' : etab.prestationExterne === null ? '-' : etab.prestationExterne,
    etab.rotationPersonnel === 'NA' ? '' : etab.rotationPersonnel === null ? '-' : etab.rotationPersonnel,
    etab.etpVacant === 'NA' ? '' : etab.etpVacant === null ? '-' : etab.etpVacant,
    etab.absenteisme === 'NA' ? '' : etab.absenteisme === null ? '-' : etab.absenteisme,
    etab.tauxCaf === 'NA' ? '' : etab.tauxCaf === null ? '-' : etab.tauxCaf,
    etab.vetusteConstruction === 'NA' ? '' : etab.vetusteConstruction === null ? '-' : etab.vetusteConstruction,
    etab.roulementNetGlobal === 'NA' ? '' : etab.roulementNetGlobal === null ? '-' : etab.roulementNetGlobal,
    etab.resultatNetComptable === 'NA' ? '' : etab.resultatNetComptable === null ? '-' : etab.resultatNetComptable
  ]);
}

function transformMoyenne(moyenne: MoyenneSMS): (string | number)[] {
  return [
    "Moyenne",
    "-",
    "-",
    "-",
    moyenne.capaciteMoyenne ?? "-",
    moyenne.realisationAcitiviteMoyenne ?? "-",
    moyenne.fileActivePersonnesAccompagnesMoyenne ?? "-",
    moyenne.hebergementPermanentMoyenne ?? "-",
    moyenne.hebergementTemporaireMoyenne ?? "-",
    moyenne.acceuilDeJourMoyenne ?? "-",
    moyenne.prestationExterneMoyenne ?? "-",
    moyenne.rotationPersonnelMoyenne ?? "-",
    moyenne.etpVacantMoyenne ?? "-",
    moyenne.absenteismeMoyenne ?? "-",
    moyenne.tauxCafMoyenne ?? "-",
    moyenne.vetusteConstructionMoyenne ?? "-",
    moyenne.roulementNetGlobalMoyenne ?? "-",
    moyenne.resultatNetComptableMoyenne ?? "-"
  ]
}

function ExportToExcel(header: string[], headerType: (string | undefined)[], headers: string[], data: (string | Number)[][], fileName: string, moyenneResultat: (string | Number)[]) {
  const ws = XLSX.utils.aoa_to_sheet([header, headerType, [""], headers, moyenneResultat, ...data]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Comparaison");
  XLSX.writeFile(wb, fileName);
}

async function generateAndExportExcel(
  year: string, order: string, orderBy: string, favoris: RechercheViewModel[] | undefined, datesMisAjour: string, codeRegion: string, codeProfiles: string[]
) {

  const fileName: string = `${getCurrentDate()}_Helios_comparaison${year}.xlsx`;
  const data = await getComparaisonData(year, order, orderBy, codeRegion, codeProfiles)
  const dataTransormed = transformData(data, favoris);
  const moyenneTransformed = transformMoyenne(data.moyenne as MoyenneSMS)

  const headerYear = ["Année", year];

  const type = getType(data.type)
  const headerType = ["Indicateurs", type];

  const headers = [
    "Type d'établissement",
    "Favoris",
    "Raison Sociale",
    "FINESS",
    `Capacité Totale au ${datesMisAjour}`,
    "Taux de réalisation de l'activité (en %)",
    "File active des personnes accompagnées sur la période",
    "Taux d'occupation en hébergement permanent (en %)",
    "Taux d'occupation en hébergement temporaire (en %)",
    "Taux d'occupation en accueil de jour (en %)",
    "Taux de prestations externes sur les prestations directes (en %)",
    "Taux de rotation du personnel sur effectifs réels (en %)",
    "Taux d'ETP vacants au 31/12 (en %)",
    "Taux d'absentéisme (en %)",
    "Taux de CAF (en %)",
    "Taux de vétusté des construction (en %)",
    "Fond de roulement net global (en €)",
    "Résultat net comptable (en €)"
  ];
  ExportToExcel(headerYear, headerType, headers, dataTransormed, fileName, moyenneTransformed);
}

const ExportExcel = ({
  year, order, orderBy, disabled, datesMisAjour, codeRegion, codeProfiles
}: {
  year: string, order: string, orderBy: string, disabled: boolean, datesMisAjour: string, codeRegion: string, codeProfiles: string[]
}) => {
  const userContext = useContext(UserContext);

  return (
    <button
      className="fr-btn fr-btn--secondary fr-fi-download-line fr-btn--icon-left fr-mt-1w"
      disabled={disabled}
      name="Exporter"
      onClick={() => generateAndExportExcel(year, order, orderBy, userContext?.favoris, datesMisAjour, codeRegion, codeProfiles)}
      title="Exporter"
      type="button"
    >
      Exporter
    </button>
  );
};

export default ExportExcel;
