import { ReactNode, useState } from "react";

import { DatesMisAjourSources } from "../../../backend/métier/entities/ResultatDeComparaison";
import { useDependencies } from "../commun/contexts/useDependencies";
import { StringFormater } from "../commun/StringFormater";
import { ContenuAllocationRessourcesEJ } from "../entité-juridique/bloc-budget-finance/allocation-ressources/ContenuAllocationRessourcesEJ";
import { ContenuCompteDeRésultatEJ } from "../entité-juridique/bloc-budget-finance/compte-de-resultat/ContenuCompteDeRésultatEJ";
import { ContenuRatioDependanceFinancière } from "../entité-juridique/bloc-budget-finance/ratio-dependance-financiere/RatioDependanceFinanciere";
import { ApiComparaisonResultat, ComparaisonEJViewModel, ComparaisonSANViewModel, ComparaisonSMSViewModel, ResultatComparaisonEJ, ResultatComparaisonSAN, ResultatComparaisonSMS } from "../home/ComparaisonViewModel";
import { ContenuNombreHAD } from "../indicateur-métier/nombre-de-had/ContenuNombreHAD";
import { ContenuNombreDeJourneesUsld } from "../indicateur-métier/nombre-journees-usld/ContenuNombreDeJourneesUsld";
import { ContenuNombreDePassagesAuxUrgences } from "../indicateur-métier/nombre-passage-urgence/ContenuNombreDePassagesAuxUrgences";
import { ContenuRésultatNetComptableEJ } from "../indicateur-métier/resultat-net-comptable/ContenuRésultatNetComptableEJ";
import { ContenuTauxDeCaf } from "../indicateur-métier/taux-de-caf/ContenuTauxDeCaf";
import { ContenuTauxDeCafEJ } from "../indicateur-métier/taux-de-caf/ContenuTauxDeCafEJ";
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
import { ContenuDuTauxOccupationESMS } from "../établissement-territorial-médico-social/InfoBulle/ContenuTauxOccupationESMS";
import { ContenuTauxRéalisationActivité } from "../établissement-territorial-médico-social/InfoBulle/ContenuTauxRéalisationActivité";
import { ContenuNombreDeJournéesPSYetSSR } from "../établissement-territorial-sanitaire/InfoBulle/ContenuNombreDeJournéesPSYetSSR";
import { ContenuNombreDeSéjourMCO } from "../établissement-territorial-sanitaire/InfoBulle/ContenuNombreDeSéjourMCO";


type comparaisonState = Readonly<{
  nombreRésultats: number;
  lastPage: number;
  résultats: ComparaisonSMSViewModel[] | ComparaisonEJViewModel[] | ComparaisonSANViewModel[];
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

  const construisLesRésultatsDeLaComparaison = (data: ApiComparaisonResultat, type: string): (ComparaisonSMSViewModel[] | ComparaisonEJViewModel[] | ComparaisonSANViewModel[]) => {
    if (type === 'Médico-social')
      return data.resultat.map((resultat) => new ComparaisonSMSViewModel(resultat as ResultatComparaisonSMS));
    else if (type === 'Entité juridique')
      return data.resultat.map((resultat) => new ComparaisonEJViewModel(resultat as ResultatComparaisonEJ));
    else return data.resultat.map((resultat) => new ComparaisonSANViewModel(resultat as ResultatComparaisonSAN));
  };

  const lancerLaComparaison = async (numerosFiness: string[], type: string, annee: string, codeRegion: string, codeProfiles: string[], order: string = "", orderBy: string = "", page: number = 1): Promise<void> => {
    const enveloppes = await getTopEnveloppes(annee, type);
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
    const response = await fetch(`/api/comparaison/getListAnnees`, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({ numeroFiness, type }),
    });
    const listAnnees = await response.json();
    return listAnnees;
  }

  const getcomparedTypes = async (numeroFiness: string[]): Promise<string[]> => {
    if (numeroFiness.length > 0) {
      const response = await fetch('/api/comparaison/getTypesFromFiness', {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ numeroFiness }),
      });

      return response.json();
    } else {
      return [];
    }

  };


  const getTopEnveloppes = async (annee: string, type: string): Promise<string[]> => {
    const savedEnveloppesEjString = sessionStorage.getItem('topEnveloppeEj');
    const savedEnveloppesSanString = sessionStorage.getItem('topEnveloppeSan');
    const savedEnveloppesDateString = sessionStorage.getItem('dateTopEnveloppe');
    const today = new Date().toISOString().slice(0, 10);

    if (savedEnveloppesEjString === null || savedEnveloppesSanString === null || savedEnveloppesDateString !== today) {
      try {
        const response = await fetch("/api/comparaison/getTopEnveloppes", {
          headers: { "Content-Type": "application/json" },
          method: "GET",
        });
        const data = await response.json();
        sessionStorage.setItem('topEnveloppeEj', JSON.stringify(data.topEnveloppesEj))
        sessionStorage.setItem('topEnveloppeSan', JSON.stringify(data.topEnveloppesSan))
        sessionStorage.setItem('dateTopEnveloppe', today)
        if (type === 'Sanitaire') {
          return data.topEnveloppesSan[annee] as string[] || [];
        }
        else if (type === 'Entité juridique') {
          return data.topEnveloppesEj[annee] as string[] || [];
        }
        else {
          return []
        }
      } catch {
        return [];
      }
    } else {
      if (type === 'Sanitaire') {
        const savedEnveloppes = JSON.parse(savedEnveloppesSanString) as Record<string, string[]>;
        return savedEnveloppes[annee] as string[] || [];
      }
      else if (type === 'Entité juridique') {
        const savedEnveloppes = JSON.parse(savedEnveloppesEjString) as Record<string, string[]>;
        return savedEnveloppes[annee] as string[] || [];
      }
      else {
        return []
      }
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
      case "externat":
      case "semiInternat":
      case "internat":
      case "autres":
      case "seances":
        return {
          contenu: <ContenuDuTauxOccupationESMS dateDeMiseÀJour={StringFormater.formatDate(dates.date_mis_a_jour_cnsa)} source={wording.CNSA} />,
          titre: getTitreModalESMS(name),
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
      case "chargesPrincipaux":
      case "chargesAnnexes":
      case "produitsPrincipaux":
      case "produitsAnnexes":
        return {
          contenu: <ContenuCompteDeRésultatEJ dateDeMiseÀJour={StringFormater.formatDate(dates.date_mis_a_jour_ancre)} source={wording.ANCRE} />,
          titre: wording.COMPTE_DE_RÉSULTAT_CF,
        };
      case "resultatNetComptableEj":
        return {
          contenu: <ContenuRésultatNetComptableEJ dateDeMiseÀJour={StringFormater.formatDate(dates.date_mis_a_jour_ancre)} source={wording.ANCRE} />,
          titre: wording.RÉSULTAT_NET_COMPTABLE,
        };
      case "tauxCafEj":
        return {
          contenu: <ContenuTauxDeCafEJ dateDeMiseÀJour={StringFormater.formatDate(dates.date_mis_a_jour_ancre)} source={wording.ANCRE} />,
          titre: wording.TAUX_DE_CAF,
        };
      case "ratioDependanceFinanciere":
        return {
          contenu: <ContenuRatioDependanceFinancière dateDeMiseÀJour={StringFormater.formatDate(dates.date_mis_a_jour_ancre)} source={wording.ANCRE} />,
          titre: wording.RATIO_DEPENDANCE_FINANCIERE,
        };
      case "totalHosptMedecine":
      case "totalHosptChirurgie":
      case "totalHosptObstetrique":
        return {
          contenu: <ContenuNombreDeSéjourMCO dateDeMiseÀJour={StringFormater.formatDate(dates.date_mis_a_jour_pmsi)} estComparaison={true} estEntitéJuridique={false} source={wording.PMSI} />,
          titre: wording.NOMBRE_DE_SÉJOUR_MCO,
        };
      case "totalHosptPsy":
      case "totalHosptSsr":
        return {
          contenu: <ContenuNombreDeJournéesPSYetSSR dateDeMiseÀJour={StringFormater.formatDate(dates.date_mis_a_jour_pmsi)} estComparaison={true} estEntitéJuridique={false} source={wording.PMSI} />,
          titre: wording.NOMBRE_DE_JOURNÉES_PSY_ET_SSR,
        };
      case "passagesUrgences":
        return {
          contenu: <ContenuNombreDePassagesAuxUrgences dateDeMiseÀJour={StringFormater.formatDate(dates.date_mis_a_jour_rpu)} source={wording.RPU} />,
          titre: wording.NOMBRE_DE_PASSAGES_AUX_URGENCES,
        };
      case "sejoursHad":
        return {
          contenu: <ContenuNombreHAD dateDeMiseÀJour={StringFormater.formatDate(dates.date_mis_a_jour_pmsi)} source={wording.PMSI} />,
          titre: wording.NOMBRE_DE_HAD,
        };
      case "journeesUsld":
        return {
          contenu: <ContenuNombreDeJourneesUsld dateDeMiseÀJour={StringFormater.formatDate(dates.date_mis_a_jour_sae)} estEntitéJuridique={false} source={wording.SAE} />,
          titre: wording.NOMBRE_DE_JOURNEES_USLD,
        };
      case "enveloppe1":
      case "enveloppe2":
      case "enveloppe3":
        return {
          contenu: <ContenuAllocationRessourcesEJ comparaison={true} dateDeMiseÀJour={StringFormater.formatDate(dates.date_mis_a_jour_hapi)} source={wording.HAPI} />,
          titre: wording.ALLOCATION_DE_RESSOURCES,
        };
      default:
        return { contenu: "Aucun contenue à afficher pour l'instant", titre: "Bonjour" };
    }
  }

  const getTitreModalESMS = (name: string) => {
    switch (name) {
      case "externat":
        return wording.TAUX_OCCUPATION_EXTERNAT;
      case "semiInternat":
        return wording.TAUX_OCCUPATION_SEMI_INTERNAT;
      case "internat":
        return wording.TAUX_OCCUPATION_INTERNAT;
      case "autres":
        return wording.TAUX_OCCUPATION_AUTRE;
      default:
        return wording.TAUX_OCCUPATION_SEANCES
    }
  }

  const tableHeaders = (datesMisAjour: DatesMisAjourSources, structure: string) => {
    if (structure === 'Médico-social')
      return [
        { label: "", key: "delete", nomComplet: "" },
        { label: "", key: "etsLogo", nomComplet: "", sort: true, orderBy: "type" },
        { label: "", key: "favori", nomComplet: "" },
        { label: "Raison sociale", nomComplet: "Raison sociale", key: "socialReason", sort: true, orderBy: "raison_sociale_courte" },
        { label: "Cat. FINESS", nomComplet: "Cat. FINESS", key: "categorie", sort: true, orderBy: "libelle_categorie" },
        { label: "N° FINESS", nomComplet: "N° FINESS", key: "numéroFiness", sort: true, orderBy: "numero_finess" },
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
        { label: "TO Externat", nomComplet: "Taux d’occupation externat", key: "externat", info: true, sort: true, orderBy: "taux_occupation_externat" },
        { label: "TO Semi internat", nomComplet: "Taux d’occupation semi-internat", key: "semiInternat", info: true, sort: true, orderBy: "taux_occupation_semi_internat" },
        { label: "TO Internat", nomComplet: "Taux d’occupation internat", key: "internat", info: true, sort: true, orderBy: "taux_occupation_internat" },
        { label: "TO Autre 1, 2 et 3", nomComplet: "Taux d’occupation autre 1, 2 et 3", key: "autres", info: true, sort: true, orderBy: "taux_occupation_autres" },
        { label: "TO Séances", nomComplet: "Taux d'occupation Séances", key: "seances", info: true, sort: true, orderBy: "taux_occupation_seances" },
        { label: "Tx de prest ext sur les prest directes", nomComplet: "Taux de prestations externes sur les prestations directes", key: "prestationExterne", info: true, sort: true, orderBy: "taux_prestation_externes" },
        { label: "Tx de rotation du personnel sur effectifs réels", nomComplet: "Taux de rotation du personnel sur effectifs réels", key: "rotationPersonnel", info: true, sort: true, orderBy: "taux_rotation_personnel" },
        { label: "Tx d'ETP vacants au 31/12", nomComplet: "Taux d'ETP vacants au 31/12", key: "etpVacant", info: true, sort: true, orderBy: "taux_etp_vacants" },
        { label: "Tx d'absentéisme", nomComplet: "Taux d'absentéisme", key: "absenteisme", info: true, sort: true, orderBy: "taux_absenteisme_hors_formation" },
        { label: "Tx de CAF", nomComplet: "Taux de CAF", key: "tauxCaf", info: true, sort: true, orderBy: "taux_de_caf" },
        { label: "Tx de vétusté des constructions", nomComplet: "Taux de vétusté des constructions", key: "vetusteConstruction", info: true, sort: true, orderBy: "taux_de_vetuste_construction" },
        { label: "FRNG", nomComplet: "Fond de roulement net global", key: "roulementNetGlobal", info: true, sort: true, orderBy: "fonds_de_roulement" },
        { label: "Résultat net comptable", nomComplet: "Résultat net comptable", key: "resultatNetComptable", info: true, sort: true, orderBy: "resultat_net_comptable" },
      ]
    else if (structure === 'Entité juridique') {
      return [
        { label: "", key: "delete", nomComplet: "" },
        { label: "", key: "etsLogo", nomComplet: "", sort: true, orderBy: "type" },
        { label: "", key: "favori", nomComplet: "" },
        { label: "Raison sociale", nomComplet: "Raison sociale", key: "socialReason", sort: true, orderBy: "raison_sociale_courte" },
        { label: "Cat. FINESS", nomComplet: "Cat. FINESS", key: "categorie", sort: true, orderBy: "libelle_categorie" },
        { label: "N° FINESS", nomComplet: "N° FINESS", key: "numéroFiness", sort: true, orderBy: "numero_finess" },
        { label: "Statut juridique", nomComplet: "Statut juridique", key: "statutJuridique", sort: true, orderBy: "statut_juridique" },
        { label: "Rattachements", nomComplet: "Rattachements", key: "rattachements", sort: true, orderBy: "numero_finess" },
        { label: "Nb séjours HAD", nomComplet: "Nb de séjours HAD", key: "sejoursHad", info: true, sort: true, orderBy: "nombre_sejours_had" },
        { label: "Nb ETP PM", nomComplet: "Nombre d’ETP PM", key: "nombreEtpPm", info: true, sort: true, orderBy: "nombre_etp_pm" },
        { label: "Nb ETP PNM", nomComplet: "Nombre d’ETP PNM", key: "nombreEtpPnm", info: true, sort: true, orderBy: "nombre_etp_pnm" },
        { label: "Dépenses intérim PM", nomComplet: "Dépenses d’intérim", key: "depensesInterimPm", info: true, sort: true, orderBy: "depenses_interim_pm" },
        { label: "Jours d’absentéisme PM", nomComplet: "Jours d’absentéisme PM", key: "joursAbsenteismePm", info: true, sort: true, orderBy: "jours_absenteisme_pm" },
        { label: "Jours d’absentéisme PNM", nomComplet: "Jours d’absentéisme PNM", key: "joursAbsenteismePnm", info: true, sort: true, orderBy: "jours_absenteisme_pnm" },
        { label: "Cpte résultat - Charges (principaux) ", nomComplet: "Compte de résultat - Charges  (Budgets principaux)", key: "chargesPrincipaux", info: true, sort: true, orderBy: "total_depenses_principales" },
        { label: " Cpte résultat - Charges (annexes)", nomComplet: "Compte de résultat - Charges  (Budgets Annexes)", key: "chargesAnnexes", info: true, sort: true, orderBy: "total_depenses_global - total_depenses_principales" },
        { label: "Cpte résultat - Produits (principaux)", nomComplet: "Compte de résultat - Produits (Budgets principaux)", key: "produitsPrincipaux", info: true, sort: true, orderBy: "total_recettes_principales" },
        { label: "Cpte résultat - Produits (annexes)", nomComplet: "Compte de résultat - Produits (Budgets Annexes)", key: "produitsAnnexes", info: true, sort: true, orderBy: "total_recettes_global - total_recettes_principales " },
        { label: "Résultat net comptable", nomComplet: "Résultat net comptable", key: "resultatNetComptableEj", info: true, sort: true, orderBy: "resultat_net_comptable_san" },
        { label: "Tx CAF", nomComplet: "Taux de CAF", key: "tauxCafEj", info: true, sort: true, orderBy: "taux_de_caf_nette_san" },
        { label: "Ratio de dépendance financière", nomComplet: "Ratio de dépendance financière", key: "ratioDependanceFinanciere", info: true, sort: true, orderBy: "ratio_dependance_financiere" },
        { label: `Alloc. ressoures: ${topEnveloppes[0]}`, nomComplet: `Allocation de ressources: ${topEnveloppes[0]}`, key: 'enveloppe1', info: true, sort: true, orderBy: "enveloppe_1" },
        { label: `Alloc. ressoures: ${topEnveloppes[1]}`, nomComplet: `Allocation de ressources: ${topEnveloppes[1]}`, key: 'enveloppe2', info: true, sort: true, orderBy: "enveloppe_2" },
        { label: `Alloc. ressoures: ${topEnveloppes[2]}`, nomComplet: `Allocation de ressources: ${topEnveloppes[2]}`, key: 'enveloppe3', info: true, sort: true, orderBy: "enveloppe_3" },
      ]
    }
    else
      return [
        { label: "", key: "delete", nomComplet: "" },
        { label: "", key: "etsLogo", nomComplet: "", sort: true, orderBy: "type" },
        { label: "", key: "favori", nomComplet: "" },
        { label: "Raison sociale", nomComplet: "Raison sociale", key: "socialReason", sort: true, orderBy: "raison_sociale_courte" },
        { label: "Cat. FINESS", nomComplet: "Cat. FINESS", key: "categorie", sort: true, orderBy: "libelle_categorie" },
        { label: "N° FINESS", nomComplet: "N° FINESS", key: "numéroFiness", sort: true, orderBy: "numero_finess" },
        { label: "Nb séjours Médecine -Total Hospt", nomComplet: "Nb de séjours Médecine -Total Hospt", key: "totalHosptMedecine", info: true, sort: true, orderBy: "total_hospt_medecine" },
        { label: "Nb séjours Chirurgie -Total Hospt", nomComplet: "Nb de séjours Chirurgie -Total Hospt", key: "totalHosptChirurgie", info: true, sort: true, orderBy: "total_hospt_chirurgie" },
        { label: "Nb séjours Obstétrique -Total Hospt", nomComplet: "Nb de séjours Obstétrique -Total Hospt", key: "totalHosptObstetrique", info: true, sort: true, orderBy: "total_hospt_obstetrique" },
        { label: "Nb journées Psychiatrie - Total Hospt", nomComplet: "Nb de  journées Psychiatrie - Total Hospt", key: "totalHosptPsy", info: true, sort: true, orderBy: "total_hospt_ssr" },
        { label: "Nb journées  SSR- Total Hospt", nomComplet: "Nb de journées  SSR- Total Hospt", key: "totalHosptSsr", info: true, sort: true, orderBy: "total_hospt_psy" },
        { label: "Nb de passage aux urgences", nomComplet: "Nb de passage aux urgences", key: "passagesUrgences", info: true, sort: true, orderBy: "nombre_passages_urgences" },
        { label: "Nb journées USLD", nomComplet: "Nb de journées USLD", key: "journeesUsld", info: true, sort: true, orderBy: "nombre_journees_usld" },
        { label: `Alloc. ressoures: ${topEnveloppes[0]}`, nomComplet: `Allocation de ressources: ${topEnveloppes[0]}`, key: 'enveloppe1', info: true, sort: true, orderBy: "enveloppe_1" },
        { label: `Alloc. ressoures: ${topEnveloppes[1]}`, nomComplet: `Allocation de ressources: ${topEnveloppes[1]}`, key: 'enveloppe2', info: true, sort: true, orderBy: "enveloppe_2" },
        { label: `Alloc. ressoures: ${topEnveloppes[2]}`, nomComplet: `Allocation de ressources: ${topEnveloppes[2]}`, key: 'enveloppe3', info: true, sort: true, orderBy: "enveloppe_3" },
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
    getListAnnees,
    getcomparedTypes,
    getTopEnveloppes
  };
}
