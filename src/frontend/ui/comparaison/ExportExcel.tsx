import ExcelJS from "exceljs";
import { useContext } from "react";

import { useComparaison } from "./useComparaison";
import { DatesMisAjourSources, ResultatDeComparaison, ResultatEJ, ResultatSAN, ResultatSMS } from "../../../backend/métier/entities/ResultatDeComparaison";
import { ecrireLignesDansSheet, getIntervalCellulesNonVideDansColonne, telechargerWorkbook } from "../../utils/excelUtils";
import { UserContext } from "../commun/contexts/userContext";
import { StringFormater } from "../commun/StringFormater";
import { UserListViewModel } from "../user-list/UserListViewModel";

const DEFAULT_INDICATORS = ["etsLogo", "favori", "socialReason", "categorie", "numéroFiness"];

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

function transformData(data: any, favoris: UserListViewModel[] | undefined, type: string | undefined, enabledIndicators: string[]): (string | number)[][] {
  if (type === 'Social et Médico-Social') {
    const indicatorExtractors: Record<string, (etab: ResultatSMS) => string | number> = {
      etsLogo: (etab) => etab.type ?? "-",
      favori: (etab) => getFavoris(favoris, etab.numéroFiness),
      socialReason: (etab) => etab.socialReason ?? "-",
      categorie: (etab) => etab.categorie ?? "-",
      numéroFiness: (etab) => etab.numéroFiness ?? "-",
      capacite: (etab) => etab.capacite ?? "-",
      realisationActivite: (etab) => etab.realisationActivite === 'NA' ? '' : etab.realisationActivite ?? '-',
      fileActivePersonnesAccompagnes: (etab) => etab.fileActivePersonnesAccompagnes === 'NA' ? '' : etab.fileActivePersonnesAccompagnes ?? '-',
      hebergementPermanent: (etab) => etab.hebergementPermanent === 'NA' ? '' : etab.hebergementPermanent ?? '-',
      hebergementTemporaire: (etab) => etab.hebergementTemporaire === 'NA' ? '' : etab.hebergementTemporaire ?? '-',
      acceuilDeJour: (etab) => etab.acceuilDeJour === 'NA' ? '' : etab.acceuilDeJour ?? '-',
      externat: (etab) => etab.externat === 'NA' ? '' : etab.externat ?? '-',
      semiInternat: (etab) => etab.semiInternat === 'NA' ? '' : etab.semiInternat ?? '-',
      internat: (etab) => etab.internat === 'NA' ? '' : etab.internat ?? '-',
      autres: (etab) => etab.autres === 'NA' ? '' : etab.autres ?? '-',
      seances: (etab) => etab.seances === 'NA' ? '' : etab.seances ?? '-',
      prestationExterne: (etab) => etab.prestationExterne === 'NA' ? '' : etab.prestationExterne ?? '-',
      rotationPersonnel: (etab) => etab.rotationPersonnel === 'NA' ? '' : etab.rotationPersonnel ?? '-',
      etpVacant: (etab) => etab.etpVacant === 'NA' ? '' : etab.etpVacant ?? '-',
      absenteisme: (etab) => etab.absenteisme === 'NA' ? '' : etab.absenteisme ?? '-',
      tauxCaf: (etab) => etab.tauxCaf === 'NA' ? '' : etab.tauxCaf ?? '-',
      vetusteConstruction: (etab) => etab.vetusteConstruction === 'NA' ? '' : etab.vetusteConstruction ?? '-',
      roulementNetGlobal: (etab) => etab.roulementNetGlobal === 'NA' ? '' : etab.roulementNetGlobal ?? '-',
      resultatNetComptable: (etab) => etab.resultatNetComptable === 'NA' ? '' : etab.resultatNetComptable ?? '-',
    };

    return data.resultat.map((etab: ResultatSMS) =>
      enabledIndicators.map((key) =>
        indicatorExtractors[key] ? indicatorExtractors[key](etab) : "-"
      )
    );
  } else if (type === 'Sanitaire') {
    const indicatorExtractors: Record<string, (etab: ResultatSAN) => string | number> = {
      etsLogo: (etab) => etab.type ?? "-",
      favori: (etab) => getFavoris(favoris, etab.numéroFiness),
      socialReason: (etab) => etab.socialReason ?? "-",
      categorie: (etab) => etab.categorie ?? "-",
      numéroFiness: (etab) => etab.numéroFiness ?? "-",
      totalHosptMedecine: (etab) => etab.totalHosptMedecine ?? "-",
      totalHosptChirurgie: (etab) => etab.totalHosptChirurgie ?? "-",
      totalHosptObstetrique: (etab) => etab.totalHosptObstetrique ?? "-",
      totalHosptPsy: (etab) => etab.totalHosptPsy ?? "-",
      totalHosptSsr: (etab) => etab.totalHosptSsr ?? "-",
      passagesUrgences: (etab) => etab.passagesUrgences ?? "-",
      journeesUsld: (etab) => etab.journeesUsld ?? "-",
      nombreEtpPm: (etab) => etab.nombreEtpPm ?? "-",
      nombreEtpPnm: (etab) => etab.nombreEtpPnm ?? "-",
      depensesInterimPm: (etab) => etab.depensesInterimPm ?? "-",
      joursAbsenteismePm: (etab) => etab.joursAbsenteismePm ?? "-",
      joursAbsenteismePnm: (etab) => etab.joursAbsenteismePnm ?? "-",
      enveloppe1: (etab) => etab.enveloppe1 ?? "-",
      enveloppe2: (etab) => etab.enveloppe2 ?? "-",
      enveloppe3: (etab) => etab.enveloppe3 ?? "-",
    };

    return data.resultat.map((etab: ResultatSAN) =>
      enabledIndicators.map((key) =>
        indicatorExtractors[key] ? indicatorExtractors[key](etab) : "-"
      )
    );
  }
  else return data.resultat.map((etab: ResultatEJ) => [
    etab.type ?? "-",
    getFavoris(favoris, etab.numéroFiness),
    etab.socialReason ?? "-",
    etab.categorie ?? "-",
    etab.numéroFiness ?? "-",
    etab.statutJuridique ?? "-",
    etab.rattachements ?? '-',
    etab.sejoursHad ?? '-',
    etab.chargesPrincipaux ?? '-',
    etab.chargesAnnexes ?? '-',
    etab.produitsPrincipaux ?? '-',
    etab.produitsAnnexes ?? '-',
    etab.resultatNetComptableEj ?? '-',
    etab.tauxCafEj ?? '-',
    etab.nombreEtpPm ?? '-',
    etab.nombreEtpPnm ?? '-',
    etab.depensesInterimPm ?? '-',
    etab.joursAbsenteismePm ?? '-',
    etab.joursAbsenteismePnm ?? '-',
    etab.ratioDependanceFinanciere ?? '-',
    etab.enveloppe1 ?? '-',
    etab.enveloppe2 ?? '-',
    etab.enveloppe3 ?? '-'
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

  if (sheetComparaison && sheetLisezMoi) {
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
  year: string, structure: string, order: string, orderBy: string, favoris: UserListViewModel[] | undefined, datesMisAjour: DatesMisAjourSources, codeRegion: string, codeProfiles: string[], getTopEnveloppes: any, enabledIndicators: string[]
) {


  const fileName: string = `${getCurrentDate()}_Helios_comparaison${year}.xlsx`;
  const enveloppes = await getTopEnveloppes(year, structure);

  const data = await getComparaisonData(year, structure, order, orderBy, codeRegion, codeProfiles, enveloppes[0], enveloppes[1], enveloppes[2])

  const type = getType(data.type)
  const headerType = ["Indicateurs", type];

  const indicators = [...DEFAULT_INDICATORS, ...enabledIndicators];
  const dataTransormed = transformData(data, favoris, type, indicators);

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
    "Nb ETP PM",
    "Nb ETP PNM",
    "Dépenses intérim PM",
    "Jours d’absentéisme PM",
    "Jours d’absentéisme PNM",
    "Ratio de dépendance financière",
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
      headers = getMSHeaders(datesMisAjour.date_mis_a_jour_finess, indicators);
      nomFichierTemplate = "template_comparaison_MS.xlsx"
      break;
    case 'Sanitaire':
      headers = getSanHeaders(indicators, enveloppes);
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

const getMSHeaders = (dateMiseAJourFiness: string, enabledIndicators: string[]): string[] => {
  const headersMS = new Map<string, string>([
    ["etsLogo", "Type d'établissement"],
    ["favori", "Favoris"],
    ["socialReason", "Raison Sociale"],
    ["categorie", "Cat. FINESS"],
    ["numéroFiness", "FINESS"],
    ["capacite", `Capacité Totale au ${StringFormater.formatDate(dateMiseAJourFiness)}`],
    ["realisationActivite", "Taux de réalisation de l'activité (en %)"],
    ["fileActivePersonnesAccompagnes", "File active des personnes accompagnées sur la période"],
    ["hebergementPermanent", "Taux d'occupation en hébergement permanent (en %)"],
    ["hebergementTemporaire", "Taux d'occupation en hébergement temporaire (en %)"],
    ["acceuilDeJour", "Taux d'occupation en accueil de jour (en %)"],
    ["externat", "Taux d’occupation externat (en %)"],
    ["semiInternat", "Taux d’occupation semi-internat (en %)"],
    ["internat", "Taux d’occupation internat (en %)"],
    ["autres", "Taux d’occupation autre 1, 2 et 3 (en %)"],
    ["seances", "Taux d'occupation Séances (en %)"],
    ["prestationExterne", "Taux de prestations externes sur les prestations directes (en %)"],
    ["rotationPersonnel", "Taux de rotation du personnel sur effectifs réels (en %)"],
    ["etpVacant", "Taux d'ETP vacants au 31/12 (en %)"],
    ["absenteisme", "Taux d'absentéisme (en %)"],
    ["tauxCaf", "Taux de CAF (en %)"],
    ["vetusteConstruction", "Taux de vétusté des constructions (en %)"],
    ["roulementNetGlobal", "Fond de roulement net global (en €)"],
    ["resultatNetComptable", "Résultat net comptable (en €)"],
  ]);

  return Array.from(headersMS.entries())
    .filter(([key,]) => enabledIndicators.includes(key))
    .map(([, value]) => value);
}

const getSanHeaders = (enabledIndicators: string[], enveloppes: string[]): string[] => {
  const headersSan = new Map<string, string>([
    ["etsLogo", "Type d'établissement"],
    ["favori", "Favoris"],
    ["socialReason", "Raison Sociale"],
    ["categorie", "Cat. FINESS"],
    ["numéroFiness", "FINESS"],
    ["totalHosptMedecine", "Nb de séjours Médecine -Total Hospt"],
    ["totalHosptChirurgie", "Nb de séjours Chirurgie -Total Hospt"],
    ["totalHosptObstetrique", "Nb séjours Obstétrique -Total Hospt"],
    ["totalHosptPsy", "Nb journées Psychiatrie - Total Hospt"],
    ["totalHosptSsr", "Nb journées SSR- Total Hospt"],
    ["passagesUrgences", "Nb de passage aux urgences"],
    ["journeesUsld", "Nb journées USLD"],
    ["nombreEtpPm", "Nb ETP PM"],
    ["nombreEtpPnm", "Nb ETP PNM"],
    ["depensesInterimPm", "Dépenses intérim PM"],
    ["joursAbsenteismePm", "Jours d’absentéisme PM"],
    ["joursAbsenteismePnm", "Jours d’absentéisme PNM"],
    ["enveloppe1", `Allocation de ressources: ${enveloppes[0]}`],
    ["enveloppe2", `Allocation de ressources: ${enveloppes[1]}`],
    ["enveloppe3", `Allocation de ressources: ${enveloppes[2]}`]
  ]);

  return Array.from(headersSan.entries())
    .filter(([key,]) => enabledIndicators.includes(key))
    .map(([, value]) => value);
}

const ExportExcel = ({
  year, type, order, orderBy, disabled, datesMisAjour, codeRegion, codeProfiles, enabledIndicators
}: {
  year: string, type: string, order: string, orderBy: string, disabled: boolean, datesMisAjour: DatesMisAjourSources, codeRegion: string, codeProfiles: string[], enabledIndicators: string[]
}) => {
  const userContext = useContext(UserContext);
  const { getTopEnveloppes } = useComparaison();

  return (
    <button
      className="fr-btn fr-btn--tertiary-no-outline"
      disabled={disabled}
      name="Exporter"
      onClick={() => generateAndExportExcel(year, type, order, orderBy, userContext?.favorisLists, datesMisAjour, codeRegion, codeProfiles, getTopEnveloppes, enabledIndicators)}
      title="Exporter"
      type="button"
    >
      Exporter
    </button>
  );
};

export default ExportExcel;
