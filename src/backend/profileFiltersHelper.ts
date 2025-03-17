import { AllocationRessource } from "./métier/entities/AllocationRessource";
import { EntitéJuridique } from "./métier/entities/entité-juridique/EntitéJuridique";
import { ÉtablissementTerritorialMédicoSocial } from "./métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocial";
import { ÉtablissementTerritorialSanitaire } from "./métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaire";

export const filterEtablissementMedicoSocial = (result: any, profil: any): ÉtablissementTerritorialMédicoSocial => {
  const identité = filterIdentiteMedicoSocial(result.identité, profil.identité);
  const activités = filterActiviteMedicoSocial(result.activités, profil.activités);
  const autorisationsEtCapacités = filterAutorisationCapaciteMedicoSocial(result.autorisationsEtCapacités, profil.autorisationsEtCapacités);
  const budgetEtFinances = filterBudgetFinanceMedicoSocial(result.budgetEtFinances, profil.budgetEtFinances);
  const ressourcesHumaines = filterressourcesHumainesMedicoSocial(result.ressourcesHumaines, profil.ressourcesHumaines);
  const qualite = filterQualiteMedicoSocial(result.qualite, profil.Qualité);
  /* les autorisations pour le bloc Vigie RH sont les mêmes que celles du bloc ressources humaines helios.
      Vu que c'est tout ou rien pour les indicateurs ressources humaines , 
      on peut se baser sur le statut de l'un des indicateurs : nombreDeCddDeRemplacement.
  */

  const vigieRh = profil.ressourcesHumaines.nombreDeCddDeRemplacement === 'ok' ? result.vigieRh : { pyramideAges: [], tranchesAgesLibelles: ['ko'], professionFiliere:{ data:[], dateDeMiseAJour: 'ko' } };

  return {
    identité: identité,
    activités: activités,
    autorisationsEtCapacités: autorisationsEtCapacités,
    budgetEtFinances: budgetEtFinances,
    ressourcesHumaines: ressourcesHumaines,
    vigieRh: vigieRh,
    qualite: qualite,
    autorisations: profil
  };
};

export const filterEntiteJuridique = (result: EntitéJuridique, profil: any): EntitéJuridique => {
  const activités = filterActiviteEJ(result.activités, profil.activités);
  const autorisationsEtCapacites = filterAutorisationCapaciteEJ(result.autorisationsEtCapacites, profil.autorisationsEtCapacités);
  const budgetFinance = filterBudgetFinanceEJ(result.budgetFinance, profil.budgetEtFinance);
  const allocationRessource = filterBudgetFinanceAllocationRessourcesEJ(result.allocationRessource, profil.budgetEtFinance);
  const activitésMensuels = result.activitésMensuels;

  return {
    adresseAcheminement: profil.identité.adresse === 'ok' ? result.adresseAcheminement : { 'dateMiseÀJourSource': '', value: '' },
    adresseNuméroVoie: profil.identité.adresse === 'ok' ? result.adresseNuméroVoie : { 'dateMiseÀJourSource': '', value: '' },
    adresseTypeVoie: profil.identité.adresse === 'ok' ? result.adresseTypeVoie : { 'dateMiseÀJourSource': '', value: '' },
    adresseVoie: profil.identité.adresse === 'ok' ? result.adresseVoie : { 'dateMiseÀJourSource': '', value: '' },
    catégorisation: result.catégorisation,
    libelléStatutJuridique: profil.identité.statut_EJ === 'ok' ? result.libelléStatutJuridique : { 'dateMiseÀJourSource': '', value: '' },
    numéroFinessEntitéJuridique: result.numéroFinessEntitéJuridique,
    raisonSociale: profil.identité.nom === 'ok' ? result.raisonSociale : { 'dateMiseÀJourSource': '', value: '' },
    raisonSocialeCourte: profil.identité.nom === 'ok' ? result.raisonSocialeCourte : { 'dateMiseÀJourSource': '', value: '' },
    siren: profil.identité.siret === 'ok' ? result.siren : { 'dateMiseÀJourSource': '', value: '' },
    téléphone: profil.identité.télEtEmail === 'ok' ? result.téléphone : { 'dateMiseÀJourSource': '', value: '' },
    codeRegion: result.codeRegion,
    activités: activités,
    activitésMensuels: activitésMensuels,
    autorisationsEtCapacites: autorisationsEtCapacites,
    budgetFinance: budgetFinance,
    allocationRessource: allocationRessource,
    // to change "télEtEmail" by "dateOuverture"
    dateOuverture: profil.identité.télEtEmail === 'ok' ? result.dateOuverture : { 'dateMiseÀJourSource': '', value: '' },
  };
}


export const filterEtablissementSanitaire = (result: any, profil: any): ÉtablissementTerritorialSanitaire => {
  const identité = filterIdentiteSanitaire(result.identité, profil.identité);
  const activités = filterActiviteSanitaire(result.activités, profil.activités);
  const autorisationsEtCapacités = filterAutorisationSanitaire(result.autorisationsEtCapacités, profil.autorisationsEtCapacités);

  const qualite = filterQualiteSanitaire(result.qualite, profil.Qualité);
  const allocationRessource = filterBudgetFinanceAllocationRessourcesEJ(result.allocationRessource, profil.budgetEtFinance);
  const budgetFinance = filterBudgetFinanceEJ(result.budgetFinance, profil.budgetEtFinance);
  return {
    identité: identité,
    activités: activités,
    activitésMensuels: result.activitésMensuels,
    autorisationsEtCapacités: autorisationsEtCapacités,
    qualite: qualite,
    budgetFinance: budgetFinance,
    allocationRessource: allocationRessource,
    appartientAEtablissementsSantePrivesIntérêtsCollectif: result.appartientAEtablissementsSantePrivesIntérêtsCollectif,
    autorisations: profil
  };
};

const filterIdentiteSanitaire = (identite: any, profil: any) => {
  const filtredIdentite = {
    adresseAcheminement: profil.adresse === 'ok' ? identite.adresseAcheminement : { 'dateMiseÀJourSource': '', value: '' },
    adresseNuméroVoie: profil.adresse === 'ok' ? identite.adresseNuméroVoie : { 'dateMiseÀJourSource': '', value: '' },
    adresseTypeVoie: profil.adresse === 'ok' ? identite.adresseTypeVoie : { 'dateMiseÀJourSource': '', value: '' },
    adresseVoie: profil.adresse === 'ok' ? identite.adresseVoie : { 'dateMiseÀJourSource': '', value: '' },
    catégorieÉtablissement: profil.catégorieÉtablissement === 'ok' ? identite.catégorieÉtablissement : { 'dateMiseÀJourSource': '', value: '' },
    codeModeTarification: profil.modeTarification === 'ok' ? identite.codeModeTarification : '',
    courriel: profil.télEtEmail === 'ok' ? identite.courriel : { 'dateMiseÀJourSource': '', value: '' },
    dateDEntréeEnVigueurDuCpom: profil.dateDEntréeEnVigueurDuCpom === 'ok' ? identite.dateDEntréeEnVigueurDuCpom : { 'dateMiseÀJourSource': '', value: '' },
    libelléCatégorieÉtablissement: profil.catégorieÉtablissement === 'ok' ? identite.libelléCatégorieÉtablissement : { 'dateMiseÀJourSource': '', value: '' },
    libelléModeTarification: profil.modeTarification === 'ok' ? identite.libelléModeTarification : { 'dateMiseÀJourSource': '', value: '' },
    numéroFinessEntitéJuridique: profil.EJ_rattachement === 'ok' ? identite.numéroFinessEntitéJuridique : { 'dateMiseÀJourSource': '', value: '' },
    numéroFinessÉtablissementPrincipal: profil.ET_principal_secondaire === 'ok' ? identite.numéroFinessÉtablissementPrincipal : { 'dateMiseÀJourSource': '', value: '' },
    numéroFinessÉtablissementTerritorial: profil.numéroFiness === 'ok' ? identite.numéroFinessÉtablissementTerritorial : { 'dateMiseÀJourSource': '', value: '' },
    raisonSociale: profil.nom === 'ok' ? identite.raisonSociale : { 'dateMiseÀJourSource': '', value: '' },
    raisonSocialeCourte: profil.nom === 'ok' ? identite.raisonSocialeCourte : { 'dateMiseÀJourSource': '', value: '' },
    siret: profil.siret === 'ok' ? identite.siret : { 'dateMiseÀJourSource': '', value: '' },
    typeÉtablissement: profil.ET_principal_secondaire === 'ok' ? identite.typeÉtablissement : { 'dateMiseÀJourSource': '', value: '' },
    téléphone: profil.télEtEmail === 'ok' ? identite.téléphone : { 'dateMiseÀJourSource': '', value: '' },
    raisonSocialeDeLEntitéDeRattachement: profil.EJ_rattachement === 'ok' ? identite.raisonSocialeDeLEntitéDeRattachement : { 'dateMiseÀJourSource': '', value: '' },
    statutJuridique: profil.statut_EJ === 'ok' ? identite.statutJuridique : { 'dateMiseÀJourSource': '', value: '' },
    codeRegion: identite.codeRegion,
    domaineÉtablissementPrincipal: identite.domaineÉtablissementPrincipal,
    // to change "télEtEmail" by "dateOuverture"
    dateOuverture: profil.télEtEmail === 'ok' ? identite.dateOuverture : { 'dateMiseÀJourSource': '', value: '' },
  }
  return filtredIdentite;
}

const filterActiviteSanitaire = (activites: any, profil: any) => {
  for (const activite of activites) {
    activite.nombreDePassagesAuxUrgences = profil.nombrePassage === "ok" ? activite.nombreDePassagesAuxUrgences : { dateMiseÀJourSource: "", value: "" };

    activite.nombreJournéesCompletePsy = profil.nombreJournées === "ok" ? activite.nombreJournéesCompletePsy : { dateMiseÀJourSource: "", value: "" };
    activite.nombreJournéesCompletesSsr = profil.nombreJournées === "ok" ? activite.nombreJournéesCompletesSsr : { dateMiseÀJourSource: "", value: "" };
    activite.nombreJournéesPartiellesPsy = profil.nombreJournées === "ok" ? activite.nombreJournéesPartiellesPsy : { dateMiseÀJourSource: "", value: "" };
    activite.nombreJournéesPartielsSsr = profil.nombreJournées === "ok" ? activite.nombreJournéesPartielsSsr : { dateMiseÀJourSource: "", value: "" };

    activite.nombreSéjoursCompletsChirurgie = profil.nombreSéjours === "ok" ? activite.nombreSéjoursCompletsChirurgie : { dateMiseÀJourSource: "", value: "" };
    activite.nombreSéjoursCompletsMédecine = profil.nombreSéjours === "ok" ? activite.nombreSéjoursCompletsMédecine : { dateMiseÀJourSource: "", value: "" };
    activite.nombreSéjoursCompletsObstétrique =
      profil.nombreSéjours === "ok" ? activite.nombreSéjoursCompletsObstétrique : { dateMiseÀJourSource: "", value: "" };
    activite.nombreSéjoursPartielsChirurgie = profil.nombreSéjours === "ok" ? activite.nombreSéjoursPartielsChirurgie : { dateMiseÀJourSource: "", value: "" };
    activite.nombreSéjoursPartielsMédecine = profil.nombreSéjours === "ok" ? activite.nombreSéjoursPartielsMédecine : { dateMiseÀJourSource: "", value: "" };
    activite.nombreSéjoursPartielsObstétrique =
      profil.nombreSéjours === "ok" ? activite.nombreSéjoursPartielsObstétrique : { dateMiseÀJourSource: "", value: "" };
  }
  return activites;
};
const filterAutorisationSanitaire = (autorisationCapacite: any, profil: any) => {
  const filtredAutorisationCapacite = {
    autorisations: profil.autorisationsActivités === "ok" ? autorisationCapacite.autorisations : { dateMiseÀJourSource: "", activités: [] },
    autresActivités: profil.autresActivités === "ok" ? autorisationCapacite.autresActivités : { dateMiseÀJourSource: "", activités: [] },
    reconnaissancesContractuelles:
      profil.reconnaissanceContractuelleActivités === "ok" ? autorisationCapacite.reconnaissancesContractuelles : { dateMiseÀJourSource: "", activités: [] },
    équipementsMatérielsLourds:
      profil.equipementMaterielLourdsActivités === "ok" ? autorisationCapacite.équipementsMatérielsLourds : { dateMiseÀJourSource: "", équipements: [] },
    capacités: profil.capacités === "ok" ? autorisationCapacite.capacités : [{ dateMiseÀJourSource: "" }],
    numéroFinessÉtablissementTerritorial: autorisationCapacite.numéroFinessÉtablissementTerritorial,
  };
  return filtredAutorisationCapacite;
};

const filterQualiteSanitaire = (qualite: any, profil: any) => {
  const filtredQualite = {
    reclamations: profil.DonnéesSirec === "ok" ? qualite.reclamations : [{ details: [] }],
    evenementsIndesirables: profil.DonnéesSivss === "ok" ? qualite.evenementsIndesirables : [],
    inspectionsEtControles: profil.DonnéesSiicea === "ok" ? qualite.inspectionsEtControles : { dateMiseAJourSource: "", inspectionsEtControles: [] },
  };
  return filtredQualite;
};

const filterIdentiteMedicoSocial = (identite: any, profil: any) => {
  const filtredIdentite = {
    adresseAcheminement: profil.adresse === 'ok' ? identite.adresseAcheminement : { 'dateMiseÀJourSource': '', value: '' },
    adresseNuméroVoie: profil.adresse === 'ok' ? identite.adresseNuméroVoie : { 'dateMiseÀJourSource': '', value: '' },
    adresseTypeVoie: profil.adresse === 'ok' ? identite.adresseTypeVoie : { 'dateMiseÀJourSource': '', value: '' },
    adresseVoie: profil.adresse === 'ok' ? identite.adresseVoie : { 'dateMiseÀJourSource': '', value: '' },
    catégorieÉtablissement: profil.catégorieÉtablissement === 'ok' ? identite.catégorieÉtablissement : { 'dateMiseÀJourSource': '', value: '' },
    codeModeTarification: profil.modeTarification === 'ok' ? identite.codeModeTarification : { 'dateMiseÀJourSource': '', value: '' },
    courriel: profil.télEtEmail === 'ok' ? identite.courriel : { 'dateMiseÀJourSource': '', value: '' },
    dateDEntréeEnVigueurDuCpom: profil.dateDEntréeEnVigueurDuCpom === 'ok' ? identite.dateDEntréeEnVigueurDuCpom : { 'dateMiseÀJourSource': '', value: '' },
    libelléCatégorieÉtablissement: profil.catégorieÉtablissement === 'ok' ? identite.libelléCatégorieÉtablissement : { 'dateMiseÀJourSource': '', value: '' },
    libelléModeTarification: profil.modeTarification === 'ok' ? identite.libelléModeTarification : { 'dateMiseÀJourSource': '', value: '' },
    numéroFinessEntitéJuridique: profil.EJ_rattachement === 'ok' ? identite.numéroFinessEntitéJuridique : { 'dateMiseÀJourSource': '', value: '' },
    numéroFinessÉtablissementPrincipal: profil.ET_principal_secondaire === 'ok' ? identite.numéroFinessÉtablissementPrincipal : { 'dateMiseÀJourSource': '', value: '' },
    numéroFinessÉtablissementTerritorial: profil.numéroFiness === 'ok' ? identite.numéroFinessÉtablissementTerritorial : '',
    raisonSociale: profil.nom === 'ok' ? identite.raisonSociale : { 'dateMiseÀJourSource': '', value: '' },
    raisonSocialeCourte: profil.nom === 'ok' ? identite.raisonSocialeCourte : { 'dateMiseÀJourSource': '', value: '' },
    siret: profil.siret === 'ok' ? identite.siret : { 'dateMiseÀJourSource': '', value: '' },
    typeÉtablissement: profil.ET_principal_secondaire === 'ok' ? identite.typeÉtablissement : { 'dateMiseÀJourSource': '', value: '' },
    téléphone: profil.télEtEmail === 'ok' ? identite.téléphone : { 'dateMiseÀJourSource': '', value: '' },
    raisonSocialeDeLEntitéDeRattachement: profil.EJ_rattachement === 'ok' ? identite.raisonSocialeDeLEntitéDeRattachement : { 'dateMiseÀJourSource': '', value: '' },
    statutJuridique: profil.statut_EJ === 'ok' ? identite.statutJuridique : { 'dateMiseÀJourSource': '', value: '' },
    estMonoÉtablissement: profil.mono_établissement === 'ok' ? identite.estMonoÉtablissement : { 'dateMiseÀJourSource': '', value: '' },
    codeRegion: identite.codeRegion,
    domaineÉtablissementPrincipal: identite.domaineÉtablissementPrincipal,
    dateOuverture: profil.télEtEmail === 'ok' ? identite.dateOuverture : { 'dateMiseÀJourSource': '', value: '' },
  }
  return filtredIdentite;
}


const filterActiviteMedicoSocial = (activites: any, profil: any) => {
  for (const activite of activites) {
    activite.duréeMoyenneSéjourAccompagnementPersonnesSorties =
      profil.duréeMoyenneSéjourAccompagnementPersonnesSorties === "ok"
        ? activite.duréeMoyenneSéjourAccompagnementPersonnesSorties
        : { dateMiseÀJourSource: "", value: "" };
    activite.fileActivePersonnesAccompagnées =
      profil.fileActivePersonnesAccompagnées === "ok" ? activite.fileActivePersonnesAccompagnées : { dateMiseÀJourSource: "", value: "" };
    activite.nombreMoyenJournéesAbsencePersonnesAccompagnées =
      profil.nombreMoyenJournéesAbsencePersonnesAccompagnées === "ok"
        ? activite.nombreMoyenJournéesAbsencePersonnesAccompagnées
        : { dateMiseÀJourSource: "", value: "" };
    activite.tauxOccupationAccueilDeJour =
      profil.tauxOccupationAccueilDeJour === "ok" ? activite.tauxOccupationAccueilDeJour : { dateMiseÀJourSource: "", value: "" };
    activite.tauxOccupationHébergementPermanent =
      profil.tauxOccupationHébergementPermanent === "ok" ? activite.tauxOccupationHébergementPermanent : { dateMiseÀJourSource: "", value: "" };
    activite.tauxOccupationHébergementTemporaire =
      profil.tauxOccupationHébergementTemporaire === "ok" ? activite.tauxOccupationHébergementTemporaire : { dateMiseÀJourSource: "", value: "" };
    activite.tauxRéalisationActivité = profil.tauxRéalisationActivité === "ok" ? activite.tauxRéalisationActivité : { dateMiseÀJourSource: "", value: "" };
  }
  return activites;
};

const filterAutorisationCapaciteMedicoSocial = (autorisationCapacite: any, profil: any) => {
  const filtredAutorisationCapacite = {
    autorisations: profil.autorisations === "ok" ? autorisationCapacite.autorisations : { dateMiseÀJourSource: "", disciplines: [] },
    capacités: profil.capacités === "ok" ? autorisationCapacite.capacités : { dateMiseÀJourSource: "", capacitéParActivité: [] },
    numéroFinessÉtablissementTerritorial: autorisationCapacite.numéroFinessÉtablissementTerritorial,
  };
  return filtredAutorisationCapacite;
};

const filterBudgetFinanceMedicoSocial = (budgetFinances: any, profil: any) => {
  for (const budgetFinance of budgetFinances) {
    budgetFinance.cadreBudgétaire = profil.compteRésultats === "ok" ? budgetFinance.cadreBudgétaire : "";
    budgetFinance.chargesEtProduits = profil.compteRésultats === "ok" ? budgetFinance.chargesEtProduits : { dateMiseÀJourSource: "" };
    budgetFinance.recettesEtDépenses = profil.compteRésultats === "ok" ? budgetFinance.recettesEtDépenses : { dateMiseÀJourSource: "" };
    budgetFinance.contributionAuxFraisDeSiège =
      profil.contributionAuxFraisDeSiège === "ok" ? budgetFinance.contributionAuxFraisDeSiège : { dateMiseÀJourSource: "", valeur: "" };
    budgetFinance.fondsDeRoulement = profil.fondsDeRoulement === "ok" ? budgetFinance.fondsDeRoulement : { dateMiseÀJourSource: "", valeur: "" };
    budgetFinance.résultatNetComptable = profil.résultatNetComptable === "ok" ? budgetFinance.résultatNetComptable : { dateMiseÀJourSource: "", valeur: "" };
    budgetFinance.tauxDeCafNette = profil.tauxDeCafNette === "ok" ? budgetFinance.tauxDeCafNette : { dateMiseÀJourSource: "", valeur: "" };
    budgetFinance.tauxDeVétustéConstruction =
      profil.tauxDeVétustéConstruction === "ok" ? budgetFinance.tauxDeVétustéConstruction : { dateMiseÀJourSource: "", valeur: "" };
  }
  return budgetFinances;
};

const filterressourcesHumainesMedicoSocial = (ressourcesHumaines: any, profil: any) => {
  for (const ressource of ressourcesHumaines) {
    ressource.nombreDEtpRéalisés = profil.nombreDEtpRéalisés === "ok" ? ressource.nombreDEtpRéalisés : { dateMiseÀJourSource: "", valeur: "" };
    ressource.nombreDeCddDeRemplacement =
      profil.nombreDeCddDeRemplacement === "ok" ? ressource.nombreDeCddDeRemplacement : { dateMiseÀJourSource: "", valeur: "" };
    ressource.tauxDAbsentéisme = profil.tauxDAbsentéisme === "ok" ? ressource.tauxDAbsentéisme : { dateMiseÀJourSource: "" };
    ressource.tauxDEtpVacants = profil.tauxDEtpVacants === "ok" ? ressource.tauxDEtpVacants : { dateMiseÀJourSource: "", valeur: "" };
    ressource.tauxDePrestationsExternes =
      profil.tauxDePrestationsExternes === "ok" ? ressource.tauxDePrestationsExternes : { dateMiseÀJourSource: "", valeur: "" };
    ressource.tauxDeRotationDuPersonnel =
      profil.tauxDeRotationDuPersonnel === "ok" ? ressource.tauxDeRotationDuPersonnel : { dateMiseÀJourSource: "", valeur: "" };
  }
  return ressourcesHumaines;
};

const filterQualiteMedicoSocial = (qualite: any, profil: any) => {
  const filtredQualite = {
    reclamations: profil.DonnéesSirec === "ok" ? qualite.reclamations : [{ details: [] }],
    evenementsIndesirables: profil.DonnéesSivss === "ok" ? qualite.evenementsIndesirables : [],
    inspectionsEtControles: profil.DonnéesSiicea === "ok" ? qualite.inspectionsEtControles : { dateMiseAJourSource: "", inspectionsEtControles: [] },
  };
  return filtredQualite;
};

const filterActiviteEJ = (activites: any, profil: any) => {
  for (const activite of activites) {
    activite.nombreSéjoursCompletsChirurgie = profil.nombreSéjours === "ok" ? activite.nombreSéjoursCompletsChirurgie : { dateMiseÀJourSource: "", value: "" };
    activite.nombreSéjoursCompletsMédecine = profil.nombreSéjours === "ok" ? activite.nombreSéjoursCompletsMédecine : { dateMiseÀJourSource: "", value: "" };
    activite.nombreSéjoursCompletsObstétrique =
      profil.nombreSéjours === "ok" ? activite.nombreSéjoursCompletsObstétrique : { dateMiseÀJourSource: "", value: "" };
    activite.nombreSéjoursPartielsChirurgie = profil.nombreSéjours === "ok" ? activite.nombreSéjoursPartielsChirurgie : { dateMiseÀJourSource: "", value: "" };
    activite.nombreSéjoursPartielsMédecine = profil.nombreSéjours === "ok" ? activite.nombreSéjoursPartielsMédecine : { dateMiseÀJourSource: "", value: "" };
    activite.nombreSéjoursPartielsObstétrique =
      profil.nombreSéjours === "ok" ? activite.nombreSéjoursPartielsObstétrique : { dateMiseÀJourSource: "", value: "" };
    activite.nombreJournéesCompletesPsy = profil.nombreJournées === "ok" ? activite.nombreJournéesCompletesPsy : { dateMiseÀJourSource: "", value: "" };
    activite.nombreJournéesCompletesSsr = profil.nombreJournées === "ok" ? activite.nombreJournéesCompletesSsr : { dateMiseÀJourSource: "", value: "" };
    activite.nombreJournéesPartiellesPsy = profil.nombreJournées === "ok" ? activite.nombreJournéesPartiellesPsy : { dateMiseÀJourSource: "", value: "" };
    activite.nombreJournéesPartiellesSsr = profil.nombreJournées === "ok" ? activite.nombreJournéesPartiellesSsr : { dateMiseÀJourSource: "", value: "" };
    activite.nombreDePassagesAuxUrgences = profil.nombrePassage === "ok" ? activite.nombreDePassagesAuxUrgences : { dateMiseÀJourSource: "", value: "" };
    activite.nombreSéjoursHad = profil.nombreSéjoursHad === "ok" ? activite.nombreSéjoursHad : { dateMiseÀJourSource: "", value: "" };
  }
  return activites;
};

const filterAutorisationCapaciteEJ = (autorisationsEtCapacites: any, profil: any) => {
  const filtredAutorisationCapacite = {
    autorisationsActivités:
      profil.autorisationsActivités === "ok" ? autorisationsEtCapacites.autorisationsActivités : { dateMiseÀJourSource: "", autorisations: [] },
    autresActivités: profil.autresActivités === "ok" ? autorisationsEtCapacites.autresActivités : { dateMiseÀJourSource: "", autorisations: [] },
    reconnaissanceContractuelleActivités:
      profil.reconnaissanceContractuelleActivités === "ok"
        ? autorisationsEtCapacites.reconnaissanceContractuelleActivités
        : { dateMiseÀJourSource: "", autorisations: [] },
    equipementMaterielLourdsActivités:
      profil.equipementMaterielLourdsActivités === "ok"
        ? autorisationsEtCapacites.equipementMaterielLourdsActivités
        : { dateMiseÀJourSource: "", autorisations: [] },
    capacités: profil.capacités === "ok" ? autorisationsEtCapacites.capacités : [{ dateMiseÀJourSource: "" }],
    numéroFinessEntitéJuridique: autorisationsEtCapacites.numéroFinessEntitéJuridique,
  };
  return filtredAutorisationCapacite;
};

const filterBudgetFinanceEJ = (budgetFinance: any, profil: any) => {

  for (const budget of budgetFinance) {
    budget.depensesTitreIGlobal = profil.compteRésultats === "ok" ? budget.depensesTitreIGlobal : "";
    budget.depensesTitreIIGlobal = profil.compteRésultats === "ok" ? budget.depensesTitreIIGlobal : "";
    budget.depensesTitreIIIGlobal = profil.compteRésultats === "ok" ? budget.depensesTitreIIIGlobal : "";
    budget.depensesTitreIVGlobal = profil.compteRésultats === "ok" ? budget.depensesTitreIVGlobal : "";
    budget.totalDepensesGlobal = profil.compteRésultats === "ok" ? budget.totalDepensesGlobal : "";

    budget.recettesTitreIGlobal = profil.compteRésultats === "ok" ? budget.recettesTitreIGlobal : "";
    budget.recettesTitreIIGlobal = profil.compteRésultats === "ok" ? budget.recettesTitreIIGlobal : "";
    budget.recettesTitreIIIGlobal = profil.compteRésultats === "ok" ? budget.recettesTitreIIIGlobal : "";
    budget.recettesTitreIVGlobal = profil.compteRésultats === "ok" ? budget.recettesTitreIVGlobal : "";
    budget.totalRecettesGlobal = profil.compteRésultats === "ok" ? budget.totalRecettesGlobal : "";

    budget.depensesTitreIPrincipales = profil.compteRésultats === "ok" ? budget.depensesTitreIPrincipales : "";
    budget.depensesTitreIIPrincipales = profil.compteRésultats === "ok" ? budget.depensesTitreIIPrincipales : "";
    budget.depensesTitreIIIPrincipales = profil.compteRésultats === "ok" ? budget.depensesTitreIIIPrincipales : "";
    budget.depensesTitreIVPrincipales = profil.compteRésultats === "ok" ? budget.depensesTitreIVPrincipales : "";
    budget.totalDepensesPrincipales = profil.compteRésultats === "ok" ? budget.totalDepensesPrincipales : "";

    budget.recettesTitreIPrincipales = profil.compteRésultats === "ok" ? budget.recettesTitreIPrincipales : "";
    budget.recettesTitreIIPrincipales = profil.compteRésultats === "ok" ? budget.recettesTitreIIPrincipales : "";
    budget.recettesTitreIIIPrincipales = profil.compteRésultats === "ok" ? budget.recettesTitreIIIPrincipales : "";
    budget.totalRecettesPrincipales = profil.compteRésultats === "ok" ? budget.totalRecettesPrincipales : "";

    budget.depensesTitreIAnnexe = profil.compteRésultats === "ok" ? budget.depensesTitreIAnnexe : "";
    budget.depensesTitreIIAnnexe = profil.compteRésultats === "ok" ? budget.depensesTitreIIAnnexe : "";
    budget.depensesTitreIIIAnnexe = profil.compteRésultats === "ok" ? budget.depensesTitreIIIAnnexe : "";
    budget.depensesTitreIVAnnexe = profil.compteRésultats === "ok" ? budget.depensesTitreIVAnnexe : "";
    budget.totalDepensesAnnexe = profil.compteRésultats === "ok" ? budget.totalDepensesAnnexe : "";

    budget.recettesTitreIAnnexe = profil.compteRésultats === "ok" ? budget.recettesTitreIAnnexe : "";
    budget.recettesTitreIIAnnexe = profil.compteRésultats === "ok" ? budget.recettesTitreIIAnnexe : "";
    budget.recettesTitreIIIAnnexe = profil.compteRésultats === "ok" ? budget.recettesTitreIIIAnnexe : "";
    budget.recettesTitreIVAnnexe = profil.compteRésultats === "ok" ? budget.recettesTitreIVAnnexe : "";
    budget.totalRecettesAnnexe = profil.compteRésultats === "ok" ? budget.totalRecettesAnnexe : "";

    budget.resultatNetComptable = profil.résultatNetComptable === "ok" ? budget.resultatNetComptable : "";
    budget.ratioDependanceFinanciere = profil.ratioDépendanceFinancière === "ok" ? budget.ratioDependanceFinanciere : "";
    budget.tauxDeCafNetSan = profil.tauxDeCafNette === "ok" ? budget.tauxDeCafNetSan : "";
  }

  return budgetFinance;
};

const filterBudgetFinanceAllocationRessourcesEJ = (allocationRessource: AllocationRessource, profil: any) => {

  for (const alr of allocationRessource.data) {
    for (const alrSub of alr.allocationRessoure) {
      alrSub.enveloppe = profil.allocationDeRessources === "ok" ? alrSub.enveloppe : "";
      alrSub.sousEnveloppe = profil.allocationDeRessources === "ok" ? alrSub.sousEnveloppe : "";
      alrSub.modeDeDélégation = profil.allocationDeRessources === "ok" ? alrSub.modeDeDélégation : "";
      {/*  @ts-ignore */ }
      alrSub.montantNotifié = profil.allocationDeRessources === "ok" ? alrSub.montantNotifié : "";
    }
  }

  return allocationRessource;
};

export const combineProfils = (userProfils: any[]) => {
  const combinedProfile = userProfils[0];
  if (userProfils.length > 1) {
    for (const profile of userProfils) {
      for (const bloc in profile) {
        if (profile.hasOwnProperty(bloc)) {
          const blocIndicators = profile[bloc];

          for (const indicator in blocIndicators) {
            if (blocIndicators.hasOwnProperty(indicator)) {
              const indicatorValue = blocIndicators[indicator];
              if (indicatorValue === "ok") combinedProfile[bloc][indicator] = "ok";
            }
          }
        }
      }
    }
  }
  return combinedProfile;
};
