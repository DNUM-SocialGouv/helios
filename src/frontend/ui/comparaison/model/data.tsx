import { ReactChild } from "react";

import { ContenuTauxDeCaf } from "../../indicateur-métier/taux-de-caf/ContenuTauxDeCaf";
import { ContenuDesTauxDAbsentéismes } from "../../établissement-territorial-médico-social/InfoBulle/ContenuDesTauxDAbsentéismes";
import { ContenuDePrestationsExternes } from "../../établissement-territorial-médico-social/InfoBulle/ContenuDuTauxDePrestationsExternes";
import { ContenuDuTauxDeRotationDuPersonnel } from "../../établissement-territorial-médico-social/InfoBulle/ContenuDuTauxDeRotationDuPersonnel";
import { ContenuDuTauxDEtpVacants } from "../../établissement-territorial-médico-social/InfoBulle/ContenuDuTauxDEtpVacants";
import { ContenuDuTauxOccupation } from "../../établissement-territorial-médico-social/InfoBulle/ContenuDuTauxOccupation";
import { ContenuFileActivePersonnesAccompagnées } from "../../établissement-territorial-médico-social/InfoBulle/ContenuFileActivePersonnesAccompagnées";
import { ContenuFondDeRoulementNetGlobal } from "../../établissement-territorial-médico-social/InfoBulle/ContenuFondDeRoulementNetGlobal";
import { ContenuRésultatNetComptable } from "../../établissement-territorial-médico-social/InfoBulle/ContenuRésultatNetComptable";
import { ContenuTauxDeVétustéConstruction } from "../../établissement-territorial-médico-social/InfoBulle/ContenuTauxDeVétustéConstruction";
import { ContenuTauxRéalisationActivité } from "../../établissement-territorial-médico-social/InfoBulle/ContenuTauxRéalisationActivité";

const tdbPref = <abbr title="Tableau de Bord de la Performance dans le secteur médico-social">TdB Perf</abbr>;
const cnsa = <abbr title="Caisse Nationale de Solidarité pour l’Autonomie">CNSA</abbr>;

export const contenuModal = (name: string): { contenu: any; titre: ReactChild } => {
  switch (name) {
    case "realisationActivite":
      return {
        contenu: <ContenuTauxRéalisationActivité dateDeMiseÀJour="07/06/2022" source={tdbPref} />,
        titre: <>Taux d’occupation en accueil de jour</>,
      };
    case "fileActivePersonnesAccompagnes":
      return {
        contenu: <ContenuFileActivePersonnesAccompagnées dateDeMiseÀJour="04/03/2024" source={tdbPref} />,
        titre: <>File active des personnes accompagnées sur la période</>,
      };
    case "hebergementPermanent":
      return {
        contenu: <ContenuDuTauxOccupation dateDeMiseÀJour="07/06/2022" source={cnsa}></ContenuDuTauxOccupation>,
        titre: <>Taux d’occupation en hébergement permanent</>,
      };
    case "hebergementTemporaire":
      return {
        contenu: <ContenuDuTauxOccupation dateDeMiseÀJour="07/06/2022" source={cnsa}></ContenuDuTauxOccupation>,
        titre: <>Taux d’occupation en hébergement temporaire</>,
      };
    case "acceuilDeJour":
      return {
        contenu: <ContenuDuTauxOccupation dateDeMiseÀJour="07/06/2022" source={cnsa}></ContenuDuTauxOccupation>,
        titre: <>Taux d’occupation en accueil de jour</>,
      };
    case "prestationExterne":
      return {
        contenu: <ContenuDePrestationsExternes dateDeMiseÀJour="07/06/2022" source={tdbPref}></ContenuDePrestationsExternes>,
        titre: <>Taux de prestations externes sur les prestations directes</>,
      };
    case "rotationPersonnel":
      return {
        contenu: <ContenuDuTauxDeRotationDuPersonnel dateDeMiseÀJour="07/06/2022" source={tdbPref}></ContenuDuTauxDeRotationDuPersonnel>,
        titre: <>Taux de rotation du personnel sur effectifs réels</>,
      };
    case "etpVacant":
      return {
        contenu: <ContenuDuTauxDEtpVacants dateDeMiseÀJour="07/06/2022" source={tdbPref}></ContenuDuTauxDEtpVacants>,
        titre: <>Taux d’ETP vacants au 31/12</>,
      };
    case "absenteisme":
      return {
        contenu: <ContenuDesTauxDAbsentéismes dateDeMiseÀJour="07/06/2022" source={tdbPref}></ContenuDesTauxDAbsentéismes>,
        titre: <>Taux d&apos;Absentéiseme</>,
      };
    case "tauxCaf":
      return {
        contenu: <ContenuTauxDeCaf dateDeMiseÀJour="01/09/2022" source={cnsa}></ContenuTauxDeCaf>,
        titre: <>Taux de CAF</>,
      };
    case "vetusteConstruction":
      return {
        contenu: <ContenuTauxDeVétustéConstruction dateDeMiseÀJour="01/09/2022" source={cnsa}></ContenuTauxDeVétustéConstruction>,
        titre: <>Taux de vétusté construction</>,
      };
    case "resultatNetComptable":
      return {
        contenu: <ContenuRésultatNetComptable dateDeMiseÀJour="07/06/2022" source={cnsa}></ContenuRésultatNetComptable>,
        titre: <>Résultat net comptable</>,
      };
    case "roulementNetGlobal":
      return {
        contenu: <ContenuFondDeRoulementNetGlobal dateDeMiseÀJour="14/10/2024" source={cnsa}></ContenuFondDeRoulementNetGlobal>,
        titre: <>Fond de roulement net global</>,
      };
    default:
      return { contenu: "Aucun contenue à afficher pour l'instant", titre: "Bonjour" };
  }
};

export const tableHeaders = [
  { label: "", key: "delete" },
  { label: "", key: "etsLogo", sort: true },
  { label: "", key: "favori", sort: true },
  { label: "Raison Sociale Courte", key: "socialReason", sort: true },
  { label: "Numéro Finess", key: "numéroFiness", sort: true },
  { label: "Capacité Totale", key: "capacite", sort: true },
  { label: "Réalisation de l'activité", key: "realisationActivite" },
  { label: "Activité personnes accompagnées", key: "fileActivePersonnesAccompagnes" },
  { label: "HP", key: "hebergementPermanent" },
  { label: "HT", key: "hebergementTemporaire" },
  { label: "AJ", key: "acceuilDeJour" },
  { label: "Prestations externes vs directes", key: "prestationExterne" },
  { label: "Rotation du personnel", key: "rotationPersonnel" },
  { label: "ETP vacants", key: "etpVacant" },
  { label: "Absentéiseme", key: "absenteisme" },
  { label: "CAF", key: "tauxCaf" },
  { label: "Vétusté", key: "vetusteConstruction" },
  { label: "Fond net global", key: "roulementNetGlobal" },
  { label: "Resultat net comptable", key: "resultatNetComptable" },
];

export const moyenneInitialValues = {
  capaciteMoyenne: 0,
  realisationAcitiviteMoyenne: 0,
  fileActivePersonnesAccompagnesMoyenne: 0,
  hebergementPermanentMoyenne: 0,
  hebergementTemporaireMoyenne: 0,
  acceuilDeJourMoyenne: 0,
  prestationExterneMoyenne: 0,
  rotationPersonnelMoyenne: 0,
  etpVacantMoyenne: 0,
  absenteismeMoyenne: 0,
  tauxCafMoyenne: 0,
  vetusteConstructionMoyenne: 0,
  roulementNetGlobalMoyenne: 0,
  resultatNetComptableMoyenne: 0,
};

export const checkFillSvg = (
  <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z"></path>
  </svg>
);
