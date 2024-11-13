import { ReactChild } from "react";

import { ContenuTauxDeCaf } from "../../indicateur-métier/taux-de-caf/ContenuTauxDeCaf";
import { ContenuDesTauxDAbsentéismes } from "../../établissement-territorial-médico-social/InfoBulle/ContenuDesTauxDAbsentéismes";
import { ContenuDePrestationsExternes } from "../../établissement-territorial-médico-social/InfoBulle/ContenuDuTauxDePrestationsExternes";
import { ContenuDuTauxDeRotationDuPersonnel } from "../../établissement-territorial-médico-social/InfoBulle/ContenuDuTauxDeRotationDuPersonnel";
import { ContenuDuTauxDEtpVacants } from "../../établissement-territorial-médico-social/InfoBulle/ContenuDuTauxDEtpVacants";
import { ContenuDuTauxOccupation } from "../../établissement-territorial-médico-social/InfoBulle/ContenuDuTauxOccupation";
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
    default:
      return { contenu: "", titre: "" };
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
  { label: "HP", key: "hebergementPermanent" },
  { label: "HT", key: "hebergementTemporaire" },
  { label: "AJ", key: "acceuilDeJour" },
  { label: "Prestations externes vs directes", key: "prestationExterne" },
  { label: "Rotation du personnel", key: "rotationPersonnel" },
  { label: "ETP vacants", key: "etpVacant" },
  { label: "Absentéiseme", key: "absenteisme" },
  { label: "CAF", key: "tauxCaf" },
  { label: "Vétusté", key: "vetusteConstruction" },
  { label: "Resultat net comptable", key: "resultatNetComptable" },
];
