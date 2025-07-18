import { ReactNode, useState } from "react";

import { DatesMisAjourSources } from "../../../backend/métier/entities/ResultatDeComparaison";
import { useDependencies } from "../commun/contexts/useDependencies";
import { StringFormater } from "../commun/StringFormater";
import { ApiComparaisonResultat, ComparaisonEJViewModel, ComparaisonSMSViewModel, ResultatComparaisonEJ, ResultatComparaisonSMS } from "../home/ComparaisonViewModel";
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
  résultats: ComparaisonSMSViewModel[] | ComparaisonEJViewModel[];
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

  const [topEnveloppes, setTopEnveloppes] = useState<string[]>([]);

  const construisLesRésultatsDeLaComparaison = (data: ApiComparaisonResultat, type: string): (ComparaisonSMSViewModel[] | ComparaisonEJViewModel[]) => {
    if (type === 'Médico-social')
      return data.resultat.map((resultat) => new ComparaisonSMSViewModel(resultat as ResultatComparaisonSMS));
    else if (type === 'Entité juridique')
      return data.resultat.map((resultat) => new ComparaisonEJViewModel(resultat as ResultatComparaisonEJ));
    else return data.resultat.map((resultat) => new ComparaisonSMSViewModel(resultat as ResultatComparaisonSMS));
  };

  const lancerLaComparaison = async (numerosFiness: string[], type: string, annee: string, codeRegion: string, codeProfiles: string[], order: string = "", orderBy: string = "", page: number = 1): Promise<void> => {
    const enveloppes = await getTopEnveloppes(annee);
    setTopEnveloppes(enveloppes);
    setState({ ...state, loading: true });

    if (numerosFiness && numerosFiness.length > 0) {
      fetch("/api/comparaison/compare", {
        body: JSON.stringify({ type, numerosFiness, annee, page, order, orderBy, forExport: false, codeRegion, enveloppe1: enveloppes[0], enveloppe2: enveloppes[1], enveloppe3: enveloppes[2], codeProfiles }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      })
        .then((response) => response.json())
        .then((data) => {
          setState({
            ...state,
            nombreRésultats: data.nombreDeResultats,
            lastPage: Math.ceil(data.nombreDeResultats / take),
            résultats: construisLesRésultatsDeLaComparaison(data, type),
            loading: false,
            listeAnnees: data.listeAnnees,
          });
        })
        .catch(() => {
          setState({ ...state, loading: false });
        });
    } else {
      setState({
        ...state,
        nombreRésultats: 0,
        lastPage: 1,
        loading: false,
        résultats: [],
        listeAnnees: [],
      })
    }
  }

  const getListAnnees = async (type: string, numeroFiness: string[]): Promise<number[]> => {
    const params = new URLSearchParams();
    params.set('type', type);
    numeroFiness.forEach(finess => params.append('numeroFiness', finess));
    const response = await fetch(`/api/comparaison/getListAnnees?${params.toString()}`, {
      headers: { "Content-Type": "application/json" },
      method: "GET",
    });
    const listAnnees = await response.json();
    return listAnnees;
  }

  const getTopEnveloppes = async (annee: string): Promise<string[]> => {
    const savedEnveloppesString = sessionStorage.getItem('topEnveloppe');
    const savedEnveloppesDateString = sessionStorage.getItem('dateTopEnveloppe');
    const today = new Date().toISOString().slice(0, 10);

    if (savedEnveloppesString === null || savedEnveloppesDateString !== today) {
      try {
        const response = await fetch("/api/comparaison/getTopEnveloppes", {
          headers: { "Content-Type": "application/json" },
          method: "GET",
        });
        const data = await response.json();
        sessionStorage.setItem('topEnveloppe', JSON.stringify(data))
        sessionStorage.setItem('dateTopEnveloppe', today)
        return data[annee] as string[] || [];
      } catch {
        return [];
      }
    } else {
      const savedEnveloppes = JSON.parse(savedEnveloppesString) as Record<string, string[]>;
      return savedEnveloppes[annee] as string[] || [];
    }
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

  const tableHeaders = (datesMisAjour: DatesMisAjourSources, structure: string) => {
    if (structure === 'Médico-social')
      return [
        { label: "", key: "delete", nomComplet: "" },
        { label: "", key: "etsLogo", nomComplet: "", sort: true },
        { label: "", key: "favori", nomComplet: "" },
        { label: "Raison sociale", nomComplet: "Raison sociale", key: "socialReason", sort: true, orderBy: "raison_sociale_courte" },
        { label: "N° FINESS", nomComplet: "N° FINESS", key: "numéroFiness", sort: true, orderBy: "numero_finess_etablissement_territorial" },
        {
          label: `Capacité Totale au ` + StringFormater.formatDate(datesMisAjour.date_mis_a_jour_finess),
          nomComplet: `Capacité Totale au ` + StringFormater.formatDate(datesMisAjour.date_mis_a_jour_finess),
          key: "capacite",
          info: true,
          sort: true,
          orderBy: "capacite_total",
        },
        { label: "Tx de réalisation de l’activité ", nomComplet: "Taux de réalisation de l’activité ", key: "realisationActivite", info: true, sort: true, orderBy: "taux_realisation_activite" },
        { label: "File active des personnes accompagnées sur la période", nomComplet: "File active des personnes accompagnées sur la période", key: "fileActivePersonnesAccompagnes", info: true, sort: true, orderBy: "file_active_personnes_accompagnees" },
        { label: "TO HP", key: "hebergementPermanent", nomComplet: "Taux d’occupation en hébergement permanent", info: true, sort: true, orderBy: "taux_occupation_en_hebergement_permanent" },
        { label: "TO HT", nomComplet: "Taux d’occupation en hébergement temporaire", key: "hebergementTemporaire", info: true, sort: true, orderBy: "taux_occupation_en_hebergement_temporaire" },
        { label: "TO AJ", nomComplet: "Taux d’occupation en accueil de jour", key: "acceuilDeJour", info: true, sort: true, orderBy: "taux_occupation_accueil_de_jour" },
        { label: "Tx de prest ext sur les prest directes", nomComplet: "Taux de prestations externes sur les prestations directes", key: "prestationExterne", info: true, sort: true, orderBy: "taux_prestation_externes" },
        { label: "Tx de rotation du personnel sur effectifs réels", nomComplet: "Taux de rotation du personnel sur effectifs réels", key: "rotationPersonnel", info: true, sort: true, orderBy: "taux_rotation_personnel" },
        { label: "Tx d'ETP vacants au 31/12", nomComplet: "Taux d'ETP vacants au 31/12", key: "etpVacant", info: true, sort: true, orderBy: "taux_etp_vacants" },
        { label: "Tx d'absentéisme", nomComplet: "Taux d'absentéisme", key: "absenteisme", info: true, sort: true, orderBy: "taux_absenteisme_hors_formation" },
        { label: "Tx de CAF", nomComplet: "Taux de CAF", key: "tauxCaf", info: true, sort: true, orderBy: "taux_de_caf" },
        { label: "Tx de vétusté de construction", nomComplet: "Taux de vétusté de construction", key: "vetusteConstruction", info: true, sort: true, orderBy: "taux_de_vetuste_construction" },
        { label: "FRNG", nomComplet: "Fond de roulement net global", key: "roulementNetGlobal", info: true, sort: true, orderBy: "fonds_de_roulement" },
        { label: "Résultat net comptable", nomComplet: "Résultat net comptable", key: "resultatNetComptable", info: true, sort: true, orderBy: "resultat_net_comptable" },
      ]
    else if (structure === 'Entité juridique') {
      return [
        { label: "", key: "delete", nomComplet: "" },
        { label: "", key: "etsLogo", nomComplet: "", sort: true },
        { label: "", key: "favori", nomComplet: "" },
        { label: "Raison sociale", nomComplet: "Raison sociale", key: "socialReason", sort: true, orderBy: "raison_sociale_courte" },
        { label: "N° FINESS", nomComplet: "N° FINESS", key: "numéroFiness", sort: true, orderBy: "numero_finess" },
        { label: "Statut juridique", nomComplet: "Statut juridique", key: "statutJuridique", sort: true, orderBy: "statut_juridique" },
        { label: "Rattachements", nomComplet: "Rattachements", key: "rattachements", sort: true, orderBy: "numero_finess" },
        { label: "Compte de résultat - Charges  (Budgets principaux)", nomComplet: "Compte de résultat - Charges  (Budgets principaux)", key: "chargesPrincipaux", sort: true, orderBy: "total_depenses_principales" },
        { label: "Compte de résultat - Charges  (Budgets Annexes)", nomComplet: "Compte de résultat - Charges  (Budgets Annexes)", key: "chargesAnnexes", sort: true, orderBy: "total_depenses_global - total_depenses_principales" },
        { label: "Compte de résultat - Produits (Budgets principaux)", nomComplet: "Compte de résultat - Produits (Budgets principaux)", key: "produitsPrincipaux", sort: true, orderBy: "total_recettes_principales" },
        { label: "Compte de résultat - Produits (Budgets Annexes)", nomComplet: "Compte de résultat - Produits (Budgets Annexes)", key: "produitsAnnexes", sort: true, orderBy: "total_recettes_global - total_recettes_principales " },
        { label: "Résultat net comptable", nomComplet: "Résultat net comptable", key: "resultatNetComptable", sort: true, orderBy: "resultat_net_comptable_san" },
        { label: "Taux de CAF", nomComplet: "Taux de CAF", key: "tauxCaf", sort: true, orderBy: "taux_de_caf_nette_san" },
        { label: "Ratio de dépendance financière", nomComplet: "Ratio de dépendance financière", key: "ratioDependanceFinanciere", sort: true, orderBy: "ratio_dependance_financiere" },
        { label: topEnveloppes[0], nomComplet: topEnveloppes[0], key: 'enveloppe1', sort: true, orderBy: "enveloppe_1" },
        { label: topEnveloppes[1], nomComplet: topEnveloppes[1], key: 'enveloppe2', sort: true, orderBy: "enveloppe_2" },
        { label: topEnveloppes[2], nomComplet: topEnveloppes[2], key: 'enveloppe3', sort: true, orderBy: "enveloppe_3" },
      ]
    }
    else
      return [
        { label: "", key: "delete", nomComplet: "" },
        { label: "", key: "etsLogo", nomComplet: "", sort: true },
        { label: "", key: "favori", nomComplet: "" },
        { label: "Raison sociale", nomComplet: "Raison sociale", key: "socialReason", sort: true, orderBy: "raison_sociale_courte" },
        { label: "N° FINESS", nomComplet: "N° FINESS", key: "numéroFiness", sort: true, orderBy: "numero_finess" },
      ]
  };

  return {
    lancerLaComparaison,
    contenuModal,
    tableHeaders,
    nombreRésultats: state.nombreRésultats,
    resultats: state.résultats,
    lastPage: state.lastPage,
    loading: state.loading,
    NombreDeResultatsMaxParPage: take,
    listeAnnees: state.listeAnnees,
    getListAnnees
  };
}
