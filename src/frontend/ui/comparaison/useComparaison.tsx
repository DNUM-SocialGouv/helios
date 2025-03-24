import { parse } from "cookie";
import { ReactNode, useState } from "react";

import { DatesMisAjourSources } from "../../../backend/métier/entities/ResultatDeComparaison";
import { useDependencies } from "../commun/contexts/useDependencies";
import { StringFormater } from "../commun/StringFormater";
import { ApiComparaisonResultat, ComparaisonViewModel } from "../home/ComparaisonViewModel";
import { ContenuTauxDeCaf } from "../indicateur-métier/taux-de-caf/ContenuTauxDeCaf";
import { ContenuCapacitéParActivité } from "../établissement-territorial-médico-social/InfoBulle/ContenuCapacitéParActivité";
import { ContenuDesTauxDAbsentéismes } from "../établissement-territorial-médico-social/InfoBulle/ContenuDesTauxDAbsentéismes";
import { ContenuDePrestationsExternes } from "../établissement-territorial-médico-social/InfoBulle/ContenuDuTauxDePrestationsExternes";
import { ContenuDuTauxDeRotationDuPersonnel } from "../établissement-territorial-médico-social/InfoBulle/ContenuDuTauxDeRotationDuPersonnel";
import { ContenuDuTauxDEtpVacants } from "../établissement-territorial-médico-social/InfoBulle/ContenuDuTauxDEtpVacants";
import { ContenuDuTauxOccupation } from "../établissement-territorial-médico-social/InfoBulle/ContenuDuTauxOccupation";
import { ContenuFileActivePersonnesAccompagnées } from "../établissement-territorial-médico-social/InfoBulle/ContenuFileActivePersonnesAccompagnées";
import { ContenuFondDeRoulementNetGlobal } from "../établissement-territorial-médico-social/InfoBulle/ContenuFondDeRoulementNetGlobal";
import { ContenuRésultatNetComptable } from "../établissement-territorial-médico-social/InfoBulle/ContenuRésultatNetComptable";
import { ContenuTauxDeVétustéConstruction } from "../établissement-territorial-médico-social/InfoBulle/ContenuTauxDeVétustéConstruction";
import { ContenuTauxRéalisationActivité } from "../établissement-territorial-médico-social/InfoBulle/ContenuTauxRéalisationActivité";


type comparaisonState = Readonly<{
  nombreRésultats: number;
  lastPage: number;
  résultats: ComparaisonViewModel[];
  loading: boolean;
  listeAnnees: number[];
}>;

export function useComparaison() {
  const { wording } = useDependencies();


  const take = 20;
  const [state, setState] = useState<comparaisonState>({
    nombreRésultats: 0,
    lastPage: 1,
    loading: false,
    résultats: [],
    listeAnnees: [],
  });

  const construisLesRésultatsDeLaComparaison = (data: ApiComparaisonResultat): ComparaisonViewModel[] => {
    return data.resultat.map((resultat) => new ComparaisonViewModel(resultat));
  };

  const lancerLaComparaison = async (annee: string, codeRegion: string, codeProfiles: string[], order: string = "", orderBy: string = "", page: number = 1): Promise<void> => {
    const listFiness = sessionStorage.getItem("listFinessNumbers");
    let typeStored = sessionStorage.getItem("comparaisonType");
    if (!typeStored) {
      const cookies = parse(document.cookie);
      typeStored = cookies["type"] ?? "";
      sessionStorage.setItem("comparaisonType", typeStored);
    }

    let numerosFiness = [];
    try {
      numerosFiness = listFiness ? JSON.parse(listFiness) : null;
    } catch (e) {
    }

    const type = typeStored ?? "";

    setState({ ...state, loading: true });
    fetch("/api/comparaison/compare", {
      body: JSON.stringify({ type, numerosFiness, annee, page, order, orderBy, forExport: false, codeRegion, codeProfiles }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        setState({
          ...state,
          nombreRésultats: data.nombreDeResultats,
          lastPage: Math.ceil(data.nombreDeResultats / take),
          résultats: construisLesRésultatsDeLaComparaison(data),
          loading: false,
          listeAnnees: data.listeAnnees,
        });
      })
      .catch(() => {
        setState({ ...state, loading: false });
      });
  };


  const contenuModal = (name: string, dates: DatesMisAjourSources): { contenu: any; titre: ReactNode } => {
    switch (name) {
      case "realisationActivite":
        return { contenu: <ContenuTauxRéalisationActivité dateDeMiseÀJour={StringFormater.formatDate(dates.date_mis_a_jour_tdbPerf)} source={wording.TDB_PERF}></ContenuTauxRéalisationActivité>, titre: wording.TAUX_RÉALISATION_ACTIVITÉ }
      case "fileActivePersonnesAccompagnes":
        return {
          contenu: <ContenuFileActivePersonnesAccompagnées dateDeMiseÀJour={StringFormater.formatDate(dates.date_mis_a_jour_tdbPerf)} source={wording.TDB_PERF} />,
          titre: wording.FILE_ACTIVE_PERSONNES_ACCOMPAGNÉES,
        };
      case "hebergementPermanent":
        return {
          contenu: <ContenuDuTauxOccupation dateDeMiseÀJour={StringFormater.formatDate(dates.date_mis_a_jour_cnsa)} source={wording.CNSA}></ContenuDuTauxOccupation>,
          titre: wording.TAUX_OCCUPATION_HÉBERGEMENT_PERMANENT,
        };
      case "hebergementTemporaire":
        return {
          contenu: <ContenuDuTauxOccupation dateDeMiseÀJour={StringFormater.formatDate(dates.date_mis_a_jour_cnsa)} source={wording.CNSA}></ContenuDuTauxOccupation>,
          titre: wording.TAUX_OCCUPATION_HÉBERGEMENT_TEMPORAIRE,
        };
      case "acceuilDeJour":
        return {
          contenu: <ContenuDuTauxOccupation dateDeMiseÀJour={StringFormater.formatDate(dates.date_mis_a_jour_cnsa)} source={wording.CNSA}></ContenuDuTauxOccupation>,
          titre: wording.TAUX_OCCUPATION_ACCUEIL_DE_JOUR,
        };
      case "prestationExterne":
        return {
          contenu: <ContenuDePrestationsExternes dateDeMiseÀJour={StringFormater.formatDate(dates.date_mis_a_jour_tdbPerf)} source={wording.TDB_PERF}></ContenuDePrestationsExternes>,
          titre: wording.TAUX_DE_PRESTATIONS_EXTERNES_SUR_LES_PRESTATIONS_DIRECTES,
        };
      case "rotationPersonnel":
        return {
          contenu: <ContenuDuTauxDeRotationDuPersonnel dateDeMiseÀJour={StringFormater.formatDate(dates.date_mis_a_jour_tdbPerf)} source={wording.TDB_PERF}></ContenuDuTauxDeRotationDuPersonnel>,
          titre: wording.TAUX_DE_ROTATION_DU_PERSONNEL,
        };
      case "etpVacant":
        return {
          contenu: <ContenuDuTauxDEtpVacants dateDeMiseÀJour={StringFormater.formatDate(dates.date_mis_a_jour_tdbPerf)} source={wording.TDB_PERF}></ContenuDuTauxDEtpVacants>,
          titre: wording.TAUX_D_ETP_VACANTS_AU_31_12,
        };
      case "absenteisme":
        return {
          contenu: <ContenuDesTauxDAbsentéismes dateDeMiseÀJour={StringFormater.formatDate(dates.date_mis_a_jour_tdbPerf)} source={wording.TDB_PERF}></ContenuDesTauxDAbsentéismes>,
          titre: wording.TAUX_D_ABSENTÉISME,
        };
      case "tauxCaf":
        return {
          contenu: <ContenuTauxDeCaf dateDeMiseÀJour={StringFormater.formatDate(dates.date_mis_a_jour_cnsa)} source={wording.CNSA}></ContenuTauxDeCaf>,
          titre: wording.TAUX_DE_CAF,
        };
      case "vetusteConstruction":
        return {
          contenu: <ContenuTauxDeVétustéConstruction dateDeMiseÀJour={StringFormater.formatDate(dates.date_mis_a_jour_tdbPerf)} source={wording.TDB_PERF}></ContenuTauxDeVétustéConstruction>,
          titre: wording.TAUX_DE_VÉTUSTÉ_CONSTRUCTION,
        };
      case "resultatNetComptable":
        return {
          contenu: <ContenuRésultatNetComptable dateDeMiseÀJour={StringFormater.formatDate(dates.date_mis_a_jour_tdbPerf)} source={wording.TDB_PERF}></ContenuRésultatNetComptable>,
          titre: wording.RÉSULTAT_NET_COMPTABLE,
        };
      case "roulementNetGlobal":
        return {
          contenu: <ContenuFondDeRoulementNetGlobal dateDeMiseÀJour={StringFormater.formatDate(dates.date_mis_a_jour_tdbPerf)} source={wording.TDB_PERF}></ContenuFondDeRoulementNetGlobal>,
          titre: wording.FONDS_DE_ROULEMENT_NET_GLOBAL,
        };
      case "capacite":
        return {
          contenu: <ContenuCapacitéParActivité dateDeMiseÀJour={StringFormater.formatDate(dates.date_mis_a_jour_finess)} source={wording.FINESS} />,
          titre: wording.CAPACITÉ_INSTALLÉE_PAR_ACTIVITÉS,
        };
      default:
        return { contenu: "Aucun contenue à afficher pour l'instant", titre: "Bonjour" };
    }
  }

  return {
    lancerLaComparaison,
    contenuModal,
    nombreRésultats: state.nombreRésultats,
    resultats: state.résultats,
    lastPage: state.lastPage,
    loading: state.loading,
    NombreDeResultatsMaxParPage: take,
    listeAnnees: state.listeAnnees
  };
}
