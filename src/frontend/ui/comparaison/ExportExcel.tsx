import ExcelJS from "exceljs";
import { useContext } from "react";

import { useComparaison } from "./useComparaison";
import { DatesMisAjourSources, ResultatDeComparaison, ResultatEJ, ResultatSAN, ResultatSMS } from "../../../backend/métier/entities/ResultatDeComparaison";
import { ecrireLignesDansSheet, getIntervalCellulesNonVideDansColonne, telechargerWorkbook } from "../../utils/excelUtils";
import { sendEvent, EXPORT } from "../../utils/nomenclature-matomo";
import { SourceMatomo } from "../../utils/SourceMatomo";
import { UserContext } from "../commun/contexts/userContext";
import StringFormater from "../commun/StringFormater";
import { UserListViewModel } from "../user-list/UserListViewModel";

const DEFAULT_INDICATORS = ["etsLogo", "favori", "socialReason", "categorie", "numéroFiness"];

type IndicateurLisezMoi = Readonly<{
  key: string;
  libelle: string;
  libelleDansTemplate: string;
  placeholderDate: keyof DatesMisAjourSources;
}>;

const DETAIL_CAPACITE_SANITAIRE = `Source : SAE

Permet de caractériser les capacités d’accueil de l’établissement et les alternatives à l’hospitalisation conventionnelle avec nuitée dont il dispose.

Fréquence : Annuelle

Mode de calcul :
Nombre de lits MCO : Le nombre de lits installés correspond aux lits intégrés au sein de services d’hospitalisation complète, y compris l’hospitalisation de semaine.

Nombre de places MCO : Le nombre de places installées au 31 décembre de l’année est égal au nombre de patients pouvant être accueillis en même temps.

Nombre de lits SSR : Le nombre de lits installés au 31 décembre de l’année est égal à la somme du nombre de lits en état d’accueillir des malades.

Nombre de places SSR : Le nombre de places installées au 31 décembre de l’année en hospitalisation à temps partiel de jour ou de nuit est égal au nombre de patients pouvant être accueillis en même temps.

Nombre de lits PSY (capacité en HC) : le nombre de lits installés au 31 décembre de l’année est égal à la somme du nombre de lits en état d’accueillir des malades et du nombre de patients pouvant être pris en charge simultanément en hospitalisation à domicile (HAD).

Nombre de places PSY : Le nombre de places installées au 31 décembre de l’année en hospitalisation à temps partiel de jour ou de nuit est égal au nombre de patients pouvant être accueillis en même temps, hors prise en charge ambulatoire.

Nombre de lits USLD : Le nombre de lits installés au 31 décembre de l’année est égal à la somme du nombre de lits en état d’accueillir des malades.

Source(s) :
Statistique annuelle des établissements de santé (SAE) - Direction de la Recherche, des Études, de l’Évaluation et des Statistiques (DREES).

La Statistique annuelle des établissements de santé (SAE) est une enquête administrative exhaustive obligatoire, réalisée chaque année par la DREES auprès de tous les établissements de santé de France, pour recueillir des informations sur leur activité, leurs capacités, leurs équipements, et leurs personnel médicaux et non-médicaux.

Hélios collecte ces données depuis le SI mutualisé des ARS DIAMANT « Décisionnel Inter-ARS pour la Maîtrise et l’Anticipation. », outil décisionnel de pilotage centré sur la régulation de l’offre de soins, abordée sous les aspects des moyens humains, financiers, et productivité.`;

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
  const csrfRes = await fetch("/api/csrf");
  const { csrfToken } = await csrfRes.json();
  return fetch("/api/comparaison/compare", {
    body: JSON.stringify({ type, numerosFiness: parsedFiness, annee, order, orderBy, forExport: true, codeRegion, codeProfiles, enveloppe1, enveloppe2, enveloppe3 }),
    headers: { "Content-Type": "application/json", "x-csrf-token": csrfToken },
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
      global: (etab) => etab.global === 'NA' ? '' : etab.categorie === "500-EHPAD" ? '-' : etab.global ?? '-',
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
      nombreDeLitsMedecine: (etab) => etab.nombreDeLitsMedecine ?? "-",
      nombreDeLitsChirurgie: (etab) => etab.nombreDeLitsChirurgie ?? "-",
      nombreDeLitsObstetrique: (etab) => etab.nombreDeLitsObstetrique ?? "-",
      nombreDeLitsUsld: (etab) => etab.nombreDeLitsUsld ?? "-",
      nombreDeLitsSsr: (etab) => etab.nombreDeLitsSsr ?? "-",
      nombreDeLitsPsy: (etab) => etab.nombreDeLitsPsy ?? "-",
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
      fondsDeRoulement: (etab) => etab.fondsDeRoulement ?? "-",
      besoinFondsDeRoulement: (etab) => etab.besoinFondsDeRoulement ?? "-",
      tresorerie: (etab) => etab.tresorerie ?? "-",
    };

    return data.resultat.map((etab: ResultatSAN) =>
      enabledIndicators.map((key) =>
        indicatorExtractors[key] ? indicatorExtractors[key](etab) : "-"
      )
    );
  }
  else {
    const indicatorExtractors: Record<string, (etab: ResultatEJ) => string | number> = {
      etsLogo: (etab) => etab.type ?? "-",
      favori: (etab) => getFavoris(favoris, etab.numéroFiness),
      socialReason: (etab) => etab.socialReason ?? "-",
      categorie: (etab) => etab.categorie ?? "-",
      numéroFiness: (etab) => etab.numéroFiness ?? "-",
      statutJuridique: (etab) => etab.statutJuridique ?? "-",
      rattachements: (etab) => etab.rattachements ?? '-',
      sejoursHad: (etab) => etab.sejoursHad ?? '-',
      chargesPrincipaux: (etab) => etab.chargesPrincipaux ?? '-',
      chargesAnnexes: (etab) => etab.chargesAnnexes ?? '-',
      produitsPrincipaux: (etab) => etab.produitsPrincipaux ?? '-',
      produitsAnnexes: (etab) => etab.produitsAnnexes ?? '-',
      resultatNetComptableEj: (etab) => etab.resultatNetComptableEj ?? '-',
      tauxCafEj: (etab) => etab.tauxCafEj ?? '-',
      nombreEtpPm: (etab) => etab.nombreEtpPm ?? '-',
      nombreEtpPnm: (etab) => etab.nombreEtpPnm ?? '-',
      depensesInterimPm: (etab) => etab.depensesInterimPm ?? '-',
      joursAbsenteismePm: (etab) => etab.joursAbsenteismePm ?? '-',
      joursAbsenteismePnm: (etab) => etab.joursAbsenteismePnm ?? '-',
      ratioDependanceFinanciere: (etab) => etab.ratioDependanceFinanciere ?? '-',
      enveloppe1: (etab) => etab.enveloppe1 ?? '-',
      enveloppe2: (etab) => etab.enveloppe2 ?? '-',
      enveloppe3: (etab) => etab.enveloppe3 ?? '-',
      fondsDeRoulement: (etab) => etab.fondsDeRoulement ?? '-',
      besoinFondsDeRoulement: (etab) => etab.besoinFondsDeRoulement ?? '-',
      tresorerie: (etab) => etab.tresorerie ?? '-',
    };

    return data.resultat.map((etab: ResultatEJ) =>
      enabledIndicators.map((key) =>
        indicatorExtractors[key] ? indicatorExtractors[key](etab) : "-"
      )
    );
  }
}


export async function ExportToExcel(
  header: string[],
  headerType: (string | undefined)[],
  headers: string[],
  data: (string | number)[][],
  fileName: string,
  datesMaj: DatesMisAjourSources,
  nomFichierTemplate: string,
  indicateursLisezMoi?: IndicateurLisezMoi[]
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
    if (indicateursLisezMoi) {
      ecrireIndicateursDansLisezMoi(sheetLisezMoi, indicateursLisezMoi);
    }
    remplacerPlaceholdersParDatesDansColonne(sheetLisezMoi, datesMaj, 2);//La date de maj est dans la 2ème colonne
    telechargerWorkbook(workbook, fileName);
  }
}

function ecrireIndicateursDansLisezMoi(sheetLisezMoi: ExcelJS.Worksheet, indicateursLisezMoi: IndicateurLisezMoi[]) {
  const lignesDuTemplate = new Map<string, ExcelJS.Row>();
  sheetLisezMoi.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      const libelle = row.getCell(1).text.trim();
      if (libelle) {
        lignesDuTemplate.set(libelle, row);
      }
    }
  });

  const styleLigneIndicateur = lignesDuTemplate.values().next().value;
  if (sheetLisezMoi.rowCount > 1) {
    sheetLisezMoi.spliceRows(2, sheetLisezMoi.rowCount - 1);
  }

  indicateursLisezMoi.forEach((indicateur) => {
    const ligneTemplate = lignesDuTemplate.get(indicateur.libelleDansTemplate);
    const ligne = sheetLisezMoi.addRow([
      indicateur.libelle,
      indicateur.placeholderDate,
      ligneTemplate?.getCell(3).value ?? getDetailIndicateurLisezMoi(indicateur),
    ]);
    recopierStyleLigne(styleLigneIndicateur, ligne);
  });
}

function getDetailIndicateurLisezMoi(indicateur: IndicateurLisezMoi) {
  if (indicateur.libelleDansTemplate === "Capacité installée par activités sanitaire") {
    return DETAIL_CAPACITE_SANITAIRE;
  }
  return "";
}

function recopierStyleLigne(ligneSource: ExcelJS.Row | undefined, ligneCible: ExcelJS.Row) {
  if (!ligneSource) return;

  ligneSource.eachCell({ includeEmpty: true }, (celluleSource, colonne) => {
    const celluleCible = ligneCible.getCell(colonne);
    celluleCible.style = { ...celluleSource.style };
    celluleCible.alignment = celluleSource.alignment ? { ...celluleSource.alignment } : undefined;
  });
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
  sendEvent(EXPORT(SourceMatomo.COMPARAISON));

  const fileName: string = `${getCurrentDate()}_Helios_comparaison${year}.xlsx`;
  const enveloppes = await getTopEnveloppes(year, structure);

  const data = await getComparaisonData(year, structure, order, orderBy, codeRegion, codeProfiles, enveloppes[0], enveloppes[1], enveloppes[2])

  const type = getType(data.type)
  const headerType = ["Indicateurs", type];

  const indicators = [...DEFAULT_INDICATORS, ...enabledIndicators];
  const dataTransormed = transformData(data, favoris, type, indicators);

  const headerYear = ["Année", year];

  let headers: string[];
  let nomFichierTemplate: string;
  let indicateursLisezMoi: IndicateurLisezMoi[] | undefined;
  switch (type) {
    case 'Entité juridique':
      headers = getEJHeaders(indicators, enveloppes);
      nomFichierTemplate = "template_comparaison_EJ.xlsx"
      break;
    case 'Social et Médico-Social':
      headers = getMSHeaders(datesMisAjour.date_mis_a_jour_finess, indicators);
      nomFichierTemplate = "template_comparaison_MS.xlsx"
      break;
    case 'Sanitaire':
      headers = getSanHeaders(indicators, enveloppes);
      nomFichierTemplate = "template_comparaison_SAN.xlsx"
      indicateursLisezMoi = getSanIndicateursLisezMoi(enabledIndicators, enveloppes);
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
    nomFichierTemplate,
    indicateursLisezMoi
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
    ["global", "Taux d'occupation global (en %)"],
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
    ["nombreDeLitsMedecine", "Nb lits Médecine"],
    ["nombreDeLitsChirurgie", "Nb lits Chirurgie"],
    ["nombreDeLitsObstetrique", "Nb lits Obstétrique"],
    ["nombreDeLitsUsld", "Nb lits USLD"],
    ["nombreDeLitsSsr", "Nb lits SSR"],
    ["nombreDeLitsPsy", "Nb lits PSY (HC)"],
    ["totalHosptMedecine", "Nb de séjours Médecine - Total Hospt"],
    ["totalHosptChirurgie", "Nb de séjours Chirurgie - Total Hospt"],
    ["totalHosptObstetrique", "Nb séjours Obstétrique - Total Hospt"],
    ["totalHosptPsy", "Nb journées Psychiatrie - Total Hospt"],
    ["totalHosptSsr", "Nb journées SSR - Total Hospt"],
    ["passagesUrgences", "Nb de passages aux urgences"],
    ["journeesUsld", "Nb journées USLD"],
    ["nombreEtpPm", "Nb ETP PM"],
    ["nombreEtpPnm", "Nb ETP PNM"],
    ["depensesInterimPm", "Dépenses intérim PM"],
    ["joursAbsenteismePm", "Jours d’absentéisme PM"],
    ["joursAbsenteismePnm", "Jours d’absentéisme PNM"],
    ["enveloppe1", `Allocation de ressources: ${enveloppes[0] ? enveloppes[0] : 'Non renseigné'}`],
    ["enveloppe2", `Allocation de ressources: ${enveloppes[1] ? enveloppes[1] : 'Non renseigné'}`],
    ["enveloppe3", `Allocation de ressources: ${enveloppes[2] ? enveloppes[2] : 'Non renseigné'}`],
    ["fondsDeRoulement", "Fonds de roulement"],
    ["besoinFondsDeRoulement", "Besoin en fonds de roulement"],
    ["tresorerie", "Trésorerie"],
  ]);

  return Array.from(headersSan.entries())
    .filter(([key,]) => enabledIndicators.includes(key))
    .map(([, value]) => value);
}

const getSanIndicateursLisezMoi = (enabledIndicators: string[], enveloppes: string[]): IndicateurLisezMoi[] => {
  const indicateursSan = new Map<string, Omit<IndicateurLisezMoi, "key">>([
    ["nombreDeLitsMedecine", {
      libelle: "Nb lits Médecine",
      libelleDansTemplate: "Nombre de lits Médecine",
      placeholderDate: "date_mis_a_jour_sae"
    }],
    ["nombreDeLitsChirurgie", {
      libelle: "Nb lits Chirurgie",
      libelleDansTemplate: "Nombre de lits Chirurgie",
      placeholderDate: "date_mis_a_jour_sae"
    }],
    ["nombreDeLitsObstetrique", {
      libelle: "Nb lits Obstétrique",
      libelleDansTemplate: "Nombre de lits Obstétrique",
      placeholderDate: "date_mis_a_jour_sae"
    }],
    ["nombreDeLitsUsld", {
      libelle: "Nb lits USLD",
      libelleDansTemplate: "Nombre de lits USLD",
      placeholderDate: "date_mis_a_jour_sae"
    }],
    ["nombreDeLitsSsr", {
      libelle: "Nb lits SSR",
      libelleDansTemplate: "Nombre de lits SSR",
      placeholderDate: "date_mis_a_jour_sae"
    }],
    ["nombreDeLitsPsy", {
      libelle: "Nb lits PSY (HC)",
      libelleDansTemplate: "Nombre de lits PSY (Hospitalisation complète)",
      placeholderDate: "date_mis_a_jour_sae"
    }],
    ["totalHosptMedecine", {
      libelle: "Nb de séjours Médecine - Total Hospt",
      libelleDansTemplate: "Nb de séjours Médecine -Total Hospt",
      placeholderDate: "date_mis_a_jour_pmsi"
    }],
    ["totalHosptChirurgie", {
      libelle: "Nb de séjours Chirurgie - Total Hospt",
      libelleDansTemplate: "Nb de séjours Médecine -Total Hospt",
      placeholderDate: "date_mis_a_jour_pmsi"
    }],
    ["totalHosptObstetrique", {
      libelle: "Nb séjours Obstétrique - Total Hospt",
      libelleDansTemplate: "Nb de séjours Médecine -Total Hospt",
      placeholderDate: "date_mis_a_jour_pmsi"
    }],
    ["totalHosptPsy", {
      libelle: "Nb journées Psychiatrie - Total Hospt",
      libelleDansTemplate: "Nb journées Psychiatrie - Total Hospt",
      placeholderDate: "date_mis_a_jour_pmsi"
    }],
    ["totalHosptSsr", {
      libelle: "Nb journées SSR - Total Hospt",
      libelleDansTemplate: "Nb journées Psychiatrie - Total Hospt",
      placeholderDate: "date_mis_a_jour_pmsi"
    }],
    ["passagesUrgences", {
      libelle: "Nb de passages aux urgences",
      libelleDansTemplate: "Nb de passage aux urgences",
      placeholderDate: "date_mis_a_jour_rpu"
    }],
    ["journeesUsld", {
      libelle: "Nb journées USLD",
      libelleDansTemplate: "Nb journées USLD",
      placeholderDate: "date_mis_a_jour_sae"
    }],
    ["nombreEtpPm", {
      libelle: "Nb ETP PM",
      libelleDansTemplate: "Nb ETP PM",
      placeholderDate: "date_mis_a_jour_ancre"
    }],
    ["nombreEtpPnm", {
      libelle: "Nb ETP PNM",
      libelleDansTemplate: "Nb ETP PNM",
      placeholderDate: "date_mis_a_jour_ancre"
    }],
    ["depensesInterimPm", {
      libelle: "Dépenses intérim PM",
      libelleDansTemplate: "Dépenses intérim PM",
      placeholderDate: "date_mis_a_jour_ancre"
    }],
    ["joursAbsenteismePm", {
      libelle: "Jours d’absentéisme PM",
      libelleDansTemplate: "Jours d’absentéisme PM",
      placeholderDate: "date_mis_a_jour_ancre"
    }],
    ["joursAbsenteismePnm", {
      libelle: "Jours d’absentéisme PNM",
      libelleDansTemplate: "Jours d’absentéisme PNM",
      placeholderDate: "date_mis_a_jour_ancre"
    }],
    ["enveloppe1", {
      libelle: `Allocation de ressources: ${enveloppes[0] ? enveloppes[0] : 'Non renseigné'}`,
      libelleDansTemplate: "Allocation de ressources",
      placeholderDate: "date_mis_a_jour_hapi"
    }],
    ["enveloppe2", {
      libelle: `Allocation de ressources: ${enveloppes[1] ? enveloppes[1] : 'Non renseigné'}`,
      libelleDansTemplate: "Allocation de ressources",
      placeholderDate: "date_mis_a_jour_hapi"
    }],
    ["enveloppe3", {
      libelle: `Allocation de ressources: ${enveloppes[2] ? enveloppes[2] : 'Non renseigné'}`,
      libelleDansTemplate: "Allocation de ressources",
      placeholderDate: "date_mis_a_jour_hapi"
    }],
    ["fondsDeRoulement", {
      libelle: "Fonds de roulement",
      libelleDansTemplate: "Fonds de roulement",
      placeholderDate: "date_mis_a_jour_ancre"
    }],
    ["besoinFondsDeRoulement", {
      libelle: "Besoin en fonds de roulement",
      libelleDansTemplate: "Besoin en fonds de roulement",
      placeholderDate: "date_mis_a_jour_ancre"
    }],
    ["tresorerie", {
      libelle: "Trésorerie",
      libelleDansTemplate: "Tresorerie",
      placeholderDate: "date_mis_a_jour_ancre"
    }],
  ]);

  return enabledIndicators.flatMap((key) => {
    const indicateur = indicateursSan.get(key);
    return indicateur ? [{ key, ...indicateur }] : [];
  });
}

const getEJHeaders = (enabledIndicators: string[], enveloppes: string[]): string[] => {
  const headersEJ = new Map<string, string>([
    ["etsLogo", "Type d'établissement"],
    ["favori", "Favoris"],
    ["socialReason", "Raison Sociale"],
    ["categorie", "Cat. FINESS"],
    ["numéroFiness", "FINESS"],
    ["statutJuridique", "Statut juridique"],
    ["rattachements", "Rattachements"],
    ["sejoursHad", "Nb de séjours HAD"],
    ["nombreEtpPm", "Nb ETP PM"],
    ["nombreEtpPnm", "Nb ETP PNM"],
    ["depensesInterimPm", "Dépenses intérim PM"],
    ["joursAbsenteismePm", "Jours d’absentéisme PM"],
    ["joursAbsenteismePnm", "Jours d’absentéisme PNM"],
    ["chargesPrincipaux", "Compte de résultat - Charges  (Budgets principaux)"],
    ["chargesAnnexes", "Compte de résultat - Charges  (Budgets Annexes)"],
    ["produitsPrincipaux", "Compte de résultat - Produits (Budgets principaux)"],
    ["produitsAnnexes", "Compte de résultat - Produits (Budgets Annexes)"],
    ["resultatNetComptableEj", "Résultat net comptable"],
    ["tauxCafEj", "Taux de CAF"],
    ["ratioDependanceFinanciere", "Ratio de dépendance financière"],
    ["enveloppe1", `Allocation de ressources: ${enveloppes[0] ? enveloppes[0] : 'Non renseigné'}`],
    ["enveloppe2", `Allocation de ressources: ${enveloppes[1] ? enveloppes[1] : 'Non renseigné'}`],
    ["enveloppe3", `Allocation de ressources: ${enveloppes[2] ? enveloppes[2] : 'Non renseigné'}`],
    ["fondsDeRoulement", "Fonds de roulement"],
    ["besoinFondsDeRoulement", "Besoin en fonds de roulement"],
    ["tresorerie", "Trésorerie"],
  ]);

  return Array.from(headersEJ.entries())
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
