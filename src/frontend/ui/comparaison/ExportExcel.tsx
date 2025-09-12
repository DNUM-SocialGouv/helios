import ExcelJS from "exceljs";
import { useContext } from "react";

import { useComparaison } from "./useComparaison";
import { DatesMisAjourSources, ResultatDeComparaison, ResultatEJ, ResultatSAN, ResultatSMS } from "../../../backend/métier/entities/ResultatDeComparaison";
import { ecrireLignesDansSheet, getIntervalCellulesNonVideDansColonne, telechargerWorkbook } from "../../utils/excelUtils";
import { UserContext } from "../commun/contexts/userContext";
import { StringFormater } from "../commun/StringFormater";
import { UserListViewModel } from "../user-list/UserListViewModel";


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

async function getComparaisonData(annee: string, type: string, order = "", orderBy = "", codeRegion: string, codeProfiles: string[], enveloppe1: string, enveloppe2: string, enveloppe3: string) {
  const listFiness = sessionStorage.getItem("listFinessNumbers");

  let parsedFiness = null;
  try {
    parsedFiness = listFiness ? JSON.parse(listFiness) : null;
  } catch (e) {
    alert("Error :" + e);
  }
  return fetch("/api/comparaison/compare", {
    body: JSON.stringify({ type, numerosFiness: parsedFiness, annee, order, orderBy, forExport: true, codeRegion, codeProfiles, enveloppe1, enveloppe2, enveloppe3 }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  })
    .then((response) => response.json())
    .then((data: ResultatDeComparaison) => {
      return ({
        resultat: data.resultat,
        type
      })
    }
    )
}

function getFavoris(favoris: UserListViewModel[] | undefined, numeroFiness: string): string {
  const isFavoris = favoris?.some(list => list.userListEtablissements.some(etablissement => etablissement.finessNumber === numeroFiness));
  return isFavoris ? "Oui" : "Non"
}

function transformData(data: any, favoris: UserListViewModel[] | undefined, type: string | undefined) {
  if (type === 'Social et Médico-Social')
    return data.resultat.map((etab: ResultatSMS) => [
      etab.type ?? "-",
      getFavoris(favoris, etab.numéroFiness),
      etab.socialReason ?? "-",
      etab.categorie ?? "-",
      etab.numéroFiness ?? "-",
      etab.capacite ?? "-",
      etab.realisationActivite === 'NA' ? '' : etab.realisationActivite === null ? '-' : etab.realisationActivite,
      etab.fileActivePersonnesAccompagnes === 'NA' ? '' : etab.fileActivePersonnesAccompagnes === null ? '-' : etab.fileActivePersonnesAccompagnes,
      etab.hebergementPermanent === 'NA' ? '' : etab.hebergementPermanent === null ? '-' : etab.hebergementPermanent,
      etab.hebergementTemporaire === 'NA' ? '' : etab.hebergementTemporaire === null ? '-' : etab.hebergementTemporaire,
      etab.acceuilDeJour === 'NA' ? '' : etab.acceuilDeJour === null ? '-' : etab.acceuilDeJour,
      etab.externat === 'NA' ? '' : etab.externat === null ? '-' : etab.externat,
      etab.semiInternat === 'NA' ? '' : etab.semiInternat === null ? '-' : etab.semiInternat,
      etab.internat === 'NA' ? '' : etab.internat === null ? '-' : etab.internat,
      etab.autres === 'NA' ? '' : etab.autres === null ? '-' : etab.autres,
      etab.seances === 'NA' ? '' : etab.seances === null ? '-' : etab.seances,
      etab.prestationExterne === 'NA' ? '' : etab.prestationExterne === null ? '-' : etab.prestationExterne,
      etab.rotationPersonnel === 'NA' ? '' : etab.rotationPersonnel === null ? '-' : etab.rotationPersonnel,
      etab.etpVacant === 'NA' ? '' : etab.etpVacant === null ? '-' : etab.etpVacant,
      etab.absenteisme === 'NA' ? '' : etab.absenteisme === null ? '-' : etab.absenteisme,
      etab.tauxCaf === 'NA' ? '' : etab.tauxCaf === null ? '-' : etab.tauxCaf,
      etab.vetusteConstruction === 'NA' ? '' : etab.vetusteConstruction === null ? '-' : etab.vetusteConstruction,
      etab.roulementNetGlobal === 'NA' ? '' : etab.roulementNetGlobal === null ? '-' : etab.roulementNetGlobal,
      etab.resultatNetComptable === 'NA' ? '' : etab.resultatNetComptable === null ? '-' : etab.resultatNetComptable
    ])
  else if (type === 'Sanitaire')
    return data.resultat.map((etab: ResultatSAN) => [
      etab.type ?? "-",
      getFavoris(favoris, etab.numéroFiness),
      etab.socialReason ?? "-",
      etab.categorie ?? "-",
      etab.numéroFiness ?? "-",
      etab.totalHosptMedecine ?? "-",
      etab.totalHosptChirurgie === null ? '-' : etab.totalHosptChirurgie,
      etab.totalHosptObstetrique === null ? '-' : etab.totalHosptObstetrique,
      etab.totalHosptPsy === null ? '-' : etab.totalHosptPsy,
      etab.totalHosptSsr === null ? '-' : etab.totalHosptSsr,
      etab.passagesUrgences === null ? '-' : etab.passagesUrgences,
      etab.journeesUsld === null ? '-' : etab.journeesUsld,
      etab.enveloppe1 === null ? '-' : etab.enveloppe1,
      etab.enveloppe2 === null ? '-' : etab.enveloppe2,
      etab.enveloppe3 === null ? '-' : etab.enveloppe3,
    ])
  else return data.resultat.map((etab: ResultatEJ) => [
    etab.type ?? "-",
    getFavoris(favoris, etab.numéroFiness),
    etab.socialReason ?? "-",
    etab.categorie ?? "-",
    etab.numéroFiness ?? "-",
    etab.statutJuridique ?? "-",
    etab.rattachements === null ? '-' : etab.rattachements,
    etab.sejoursHad === null ? '-' : etab.sejoursHad,
    etab.chargesPrincipaux === null ? '-' : etab.chargesPrincipaux,
    etab.chargesAnnexes === null ? '-' : etab.chargesAnnexes,
    etab.produitsPrincipaux === null ? '-' : etab.produitsPrincipaux,
    etab.produitsAnnexes === null ? '-' : etab.produitsAnnexes,
    etab.resultatNetComptableEj === null ? '-' : etab.resultatNetComptableEj,
    etab.tauxCafEj === null ? '-' : etab.tauxCafEj,
    etab.ratioDependanceFinanciere === null ? '-' : etab.ratioDependanceFinanciere,
    etab.enveloppe1 === null ? '-' : etab.enveloppe1,
    etab.enveloppe2 === null ? '-' : etab.enveloppe2,
    etab.enveloppe3 === null ? '-' : etab.enveloppe3,
  ])
}


export async function ExportToExcel(
  header: string[],
  headerType: (string | undefined)[],
  headers: string[],
  data: (string | number)[][],
  fileName: string,
  datesMaj: DatesMisAjourSources,
  nomFichierTemplate: string
) {
  const response = await fetch(`/templates/${nomFichierTemplate}`);
  const arrayBuffer = await response.arrayBuffer();

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(arrayBuffer);

  const sheetComparaison = workbook.getWorksheet(1);
  const sheetLisezMoi = workbook.getWorksheet(2);

  if (!sheetComparaison) throw new Error("Feuille comparaison introuvable dans le template");
  if (!sheetLisezMoi) throw new Error("Feuille LisezMoi introuvable dans le template");

  const lignes: (string | number)[][] = [
    header,
    headerType as (string | number)[],
    [""],
    headers,
    ...data,
  ];


  ecrireLignesDansSheet(lignes, sheetComparaison);
  remplacerPlaceholdersParDatesDansColonne(sheetLisezMoi, datesMaj, 2);//La date de maj est dans la 2ème colonne
  telechargerWorkbook(workbook, fileName);
}


function remplacerPlaceholdersParDatesDansColonne(sheetLisezMoi: ExcelJS.Worksheet, datesMaj: DatesMisAjourSources, colonne: number) {
  const dernierLigneNonVide = getIntervalCellulesNonVideDansColonne(sheetLisezMoi, colonne)?.derniereLigne ?? 0;

  for (let ligne = 1; ligne <= dernierLigneNonVide; ligne++) {
    const placeholder = sheetLisezMoi.getCell(ligne, colonne).text.trim(); //Placeholder est la valeur fictive mise dans le template pour positionner les dates de MAJ
    if (placeholder in datesMaj) {
      const cle = placeholder as keyof DatesMisAjourSources;
      sheetLisezMoi.getCell(ligne, colonne).value = StringFormater.formatDate(datesMaj[cle]);
    }
  }
}

async function generateAndExportExcel(
  year: string, structure: string, order: string, orderBy: string, favoris: UserListViewModel[] | undefined, datesMisAjour: DatesMisAjourSources, codeRegion: string, codeProfiles: string[], getTopEnveloppes: any
) {


  const fileName: string = `${getCurrentDate()}_Helios_comparaison${year}.xlsx`;
  const enveloppes = await getTopEnveloppes(year, structure);

  const data = await getComparaisonData(year, structure, order, orderBy, codeRegion, codeProfiles, enveloppes[0], enveloppes[1], enveloppes[2])

  const type = getType(data.type)
  const headerType = ["Indicateurs", type];

  const dataTransormed = transformData(data, favoris, type);
  const headerYear = ["Année", year];

  const headersEJ = [
    "Type d'établissement",
    "Favoris",
    "Raison Sociale",
    "Cat. FINESS",
    "FINESS",
    "Statut juridique",
    "Rattachements",
    "Nb de séjours HAD",
    "Compte de résultat - Charges  (Budgets principaux)",
    "Compte de résultat - Charges  (Budgets Annexes)",
    "Compte de résultat - Produits (Budgets principaux)",
    "Compte de résultat - Produits (Budgets Annexes)",
    "Résultat net comptable",
    "Taux de CAF",
    "Ratio de dépendance financière",
    `Allocation de ressources: ${enveloppes[0]}`,
    `Allocation de ressources: ${enveloppes[1]}`,
    `Allocation de ressources: ${enveloppes[2]}`
  ];

  const headersMS = [
    "Type d'établissement",
    "Favoris",
    "Raison Sociale",
    "Cat. FINESS",
    "FINESS",
    `Capacité Totale au ${StringFormater.formatDate(datesMisAjour.date_mis_a_jour_finess)}`,
    "Taux de réalisation de l'activité (en %)",
    "File active des personnes accompagnées sur la période",
    "Taux d'occupation en hébergement permanent (en %)",
    "Taux d'occupation en hébergement temporaire (en %)",
    "Taux d'occupation en accueil de jour (en %)",
    "Taux d’occupation externat (en %)",
    "Taux d’occupation semi-internat (en %)",
    "Taux d’occupation internat (en %)",
    "Taux d’occupation autre 1, 2 et 3 (en %)",
    "Taux d'occupation Séances (en %)",
    "Taux de prestations externes sur les prestations directes (en %)",
    "Taux de rotation du personnel sur effectifs réels (en %)",
    "Taux d'ETP vacants au 31/12 (en %)",
    "Taux d'absentéisme (en %)",
    "Taux de CAF (en %)",
    "Taux de vétusté des construction (en %)",
    "Fond de roulement net global (en €)",
    "Résultat net comptable (en €)"
  ];

  const headersSAN = [
    "Type d'établissement",
    "Favoris",
    "Raison Sociale",
    "Cat. FINESS",
    "FINESS",
    `Nb de séjours Médecine -Total Hospt`,
    "Nb de séjours Chirurgie -Total Hospt",
    "Nb séjours Obstétrique -Total Hospt",
    "Nb journées Psychiatrie - Total Hospt",
    "Nb journées SSR- Total Hospt",
    "Nb de passage aux urgences",
    "Nb journées USLD",
    `Allocation de ressources: ${enveloppes[0]}`,
    `Allocation de ressources: ${enveloppes[1]}`,
    `Allocation de ressources: ${enveloppes[2]}`
  ];

  let headers: string[];
  let nomFichierTemplate: string;
  switch (type) {
    case 'Entité juridique':
      headers = headersEJ;
      nomFichierTemplate = "template_comparaison_EJ.xlsx"
      break;
    case 'Social et Médico-Social':
      headers = headersMS;
      nomFichierTemplate = "template_comparaison_MS.xlsx"
      break;
    case 'Sanitaire':
      headers = headersSAN;
      nomFichierTemplate = "template_comparaison_SAN.xlsx"
      break;
    default:
      throw new Error("Illegal state: type d'établissement non identifié");
  }

  ExportToExcel(headerYear,
    headerType,
    headers,
    dataTransormed,
    fileName,
    datesMisAjour,
    nomFichierTemplate
  );
}

const ExportExcel = ({
  year, type, order, orderBy, disabled, datesMisAjour, codeRegion, codeProfiles
}: {
  year: string, type: string, order: string, orderBy: string, disabled: boolean, datesMisAjour: DatesMisAjourSources, codeRegion: string, codeProfiles: string[]
}) => {
  const userContext = useContext(UserContext);
  const { getTopEnveloppes } = useComparaison();

  return (
    <button
      className="fr-btn fr-btn--tertiary-no-outline"
      disabled={disabled}
      name="Exporter"
      onClick={() => generateAndExportExcel(year, type, order, orderBy, userContext?.favorisLists, datesMisAjour, codeRegion, codeProfiles, getTopEnveloppes)}
      title="Exporter"
      type="button"
    >
      Exporter
    </button>
  );
};

export default ExportExcel;
