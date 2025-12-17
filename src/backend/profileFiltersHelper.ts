import { AllocationRessource } from "./métier/entities/AllocationRessource";
import { EntiteJuridiqueRessourcesHumaines } from "./métier/entities/entité-juridique/EntiteJuridiqueRessourcesHumaines";
import { EntitéJuridique } from "./métier/entities/entité-juridique/EntitéJuridique";
import { ÉtablissementTerritorialMédicoSocial } from "./métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocial";
import { EtablissementTerritorialSanitaireRH } from "./métier/entities/établissement-territorial-sanitaire/EtablissementTerritorialSanitaireRH";
import { ÉtablissementTerritorialSanitaire } from "./métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaire";

export const filterEtablissementMedicoSocial = (result: any, profil: any): ÉtablissementTerritorialMédicoSocial => {
  const identité = filterIdentiteMedicoSocial(result.identité, profil.identité);
  const activités = filterActiviteMedicoSocial(result.activités, profil.activités);
  const autorisationsEtCapacités = filterAutorisationCapaciteMedicoSocial(result.autorisationsEtCapacités, profil.autorisationsEtCapacités);
  const budgetEtFinances = filterBudgetFinanceMedicoSocial(result.budgetEtFinances, profil.budgetEtFinances);
  const ressourcesHumaines = filterressourcesHumainesMedicoSocial(result.ressourcesHumaines, profil.ressourcesHumaines);
  const qualite = filterQualiteSanitaireEtMS(result.qualite, profil.Qualité);
  /* les autorisations pour le bloc Vigie RH sont les mêmes que celles du bloc ressources humaines helios.
      Vu que c'est tout ou rien pour les indicateurs ressources humaines , 
      on peut se baser sur le statut de l'un des indicateurs : nombreDeCddDeRemplacement.
  */

  const vigieRh = profil.ressourcesHumaines?.nombreDeCddDeRemplacement === 'ok' ? result.vigieRh : {};

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
  const ressourcesHumaines = filterRessourcesHumainesEJ(result.ressourcesHumaines, profil.ressourcesHumaines);

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
    ressourcesHumaines
  };
}


export const filterEtablissementSanitaire = (result: any, profil: any): ÉtablissementTerritorialSanitaire => {
  const identité = filterIdentiteSanitaire(result.identité, profil.identité);
  const activités = filterActiviteSanitaire(result.activités, profil.activités);
  const autorisationsEtCapacités = filterAutorisationSanitaire(result.autorisationsEtCapacités, profil.autorisationsEtCapacités);

  const qualite = filterQualiteSanitaireEtMS(result.qualite, profil.Qualité);
  const allocationRessource = filterBudgetFinanceAllocationRessourcesEJ(result.allocationRessource, profil.budgetEtFinance);
  const budgetFinance = filterBudgetFinanceEJ(result.budgetFinance, profil.budgetEtFinance);
  const ressourcesHumaines = filterRessourcesHumainesSanitaire(result.ressourcesHumaines, profil.ressourcesHumaines);
  return {
    identité: identité,
    activités: activités,
    activitésMensuels: result.activitésMensuels,
    autorisationsEtCapacités: autorisationsEtCapacités,
    qualite: qualite,
    budgetFinance: budgetFinance,
    allocationRessource: allocationRessource,
    appartientAEtablissementsSantePrivesIntérêtsCollectif: result.appartientAEtablissementsSantePrivesIntérêtsCollectif,
    autorisations: profil,
    ressourcesHumaines
  };
};

const filterIdentiteSanitaire = (identite: any, profil: any) => {
  if (profil.adresse !== 'ok') {
    identite.adresseAcheminement = { 'dateMiseÀJourSource': '', value: '' };
    identite.adresseNuméroVoie = { 'dateMiseÀJourSource': '', value: '' };
    identite.adresseTypeVoie = { 'dateMiseÀJourSource': '', value: '' };
    identite.adresseVoie = { 'dateMiseÀJourSource': '', value: '' };
  }

  if (profil.catégorieÉtablissement !== 'ok') {
    identite.catégorieÉtablissement = { 'dateMiseÀJourSource': '', value: '' };
    identite.libelléCatégorieÉtablissement = { 'dateMiseÀJourSource': '', value: '' };
  }

  if (profil.modeTarification !== 'ok') {
    identite.codeModeTarification = '';
    identite.libelléModeTarification = { 'dateMiseÀJourSource': '', value: '' };
  }

  identite.dateDEntréeEnVigueurDuCpom = profil.dateDEntréeEnVigueurDuCpom === 'ok' ? identite.dateDEntréeEnVigueurDuCpom : { 'dateMiseÀJourSource': '', value: '' };

  if (profil.EJ_rattachement !== 'ok') {
    identite.numéroFinessEntitéJuridique = { 'dateMiseÀJourSource': '', value: '' };
    identite.raisonSocialeDeLEntitéDeRattachement = { 'dateMiseÀJourSource': '', value: '' };
  }

  if (profil.ET_principal_secondaire !== 'ok') {
    identite.numéroFinessÉtablissementPrincipal = { 'dateMiseÀJourSource': '', value: '' };
    identite.typeÉtablissement = { 'dateMiseÀJourSource': '', value: '' };
  }

  identite.numéroFinessÉtablissementTerritorial = profil.numéroFiness === 'ok' ? identite.numéroFinessÉtablissementTerritorial : { 'dateMiseÀJourSource': '', value: '' };

  if (profil.nom !== 'ok') {
    identite.raisonSociale = { 'dateMiseÀJourSource': '', value: '' };
    identite.raisonSocialeCourte = { 'dateMiseÀJourSource': '', value: '' };
  }

  identite.siret = profil.siret === 'ok' ? identite.siret : { 'dateMiseÀJourSource': '', value: '' };

  if (profil.statut_EJ !== 'ok') {
    identite.statutJuridique = { 'dateMiseÀJourSource': '', value: '' };
    identite.categorisationDeLEntitéDeRattachement = { 'dateMiseÀJourSource': '', value: '' };
  }

  // to change "télEtEmail" by "dateOuverture"
  if (profil.télEtEmail !== 'ok') {
    identite.dateOuverture = { 'dateMiseÀJourSource': '', value: '' };
    identite.téléphone = { 'dateMiseÀJourSource': '', value: '' };
    identite.courriel = { 'dateMiseÀJourSource': '', value: '' };
  }
  return identite;
}

const filterActiviteSanitaire = (activites: any[], profil: any) => {
  const fieldGroups = [
    {
      condition: profil.nombrePassage === "ok",
      fields: ["nombreDePassagesAuxUrgences"]
    },
    {
      condition: profil.nombreJournées === "ok",
      fields: [
        "nombreJournéesCompletePsy",
        "nombreJournéesCompletesSsr",
        "nombreJournéesPartiellesPsy",
        "nombreJournéesPartielsSsr"
      ]
    },
    {
      condition: profil.nombreSéjours === "ok",
      fields: [
        "nombreSéjoursCompletsChirurgie",
        "nombreSéjoursCompletsMédecine",
        "nombreSéjoursCompletsObstétrique",
        "nombreSéjoursPartielsChirurgie",
        "nombreSéjoursPartielsMédecine",
        "nombreSéjoursPartielsObstétrique"
      ]
    },
    {
      condition: profil.nombreJourneesUsld === "ok",
      fields: ["nombreJourneesUsld"]
    },
    {
      condition: profil.dureeMoyenneSejour === "ok",
      fields: [
        "dureeMoyenneSejourMedecine",
        "dureeMoyenneSejourChirurgie",
        "dureeMoyenneSejourObstetrique"
      ]
    }

  ];
  return activites.map(activite => {
    const filteredActivite = { ...activite };

    fieldGroups.forEach(({ condition, fields }) => {
      fields.forEach(field => {
        if (!condition) {
          filteredActivite[field] = { dateMiseÀJourSource: "", value: "" };
        }
      });
    });

    return filteredActivite;
  });
};

const filterAutorisationSanitaire = (autorisationCapacite: any, profil: any) => {
  const filtredAutorisationCapacite = {
    autorisations: profil.autorisationsActivités === "ok" ? autorisationCapacite.autorisations : { dateMiseÀJourSource: "", activités: [] },
    autresActivités: profil.autresActivités === "ok" ? autorisationCapacite.autresActivités : { dateMiseÀJourSource: "", activités: [] },
    reconnaissancesContractuelles:
      profil.reconnaissanceContractuelleActivités === "ok" ? autorisationCapacite.reconnaissancesContractuelles : { dateMiseÀJourSource: "", activités: [] },
    équipementsMatérielsLourds:
      profil.equipementMaterielLourdsActivités === "ok" ? autorisationCapacite.équipementsMatérielsLourds : { dateMiseÀJourSource: "", équipements: [] },
    autorisationsAmm: profil.autorisationsActivités === "ok" ? autorisationCapacite.autorisationsAmm : { dateMiseÀJourSource: "", activités: [] },
    capacités: profil.capacités === "ok" ? autorisationCapacite.capacités : [{ dateMiseÀJourSource: "" }],
    numéroFinessÉtablissementTerritorial: autorisationCapacite.numéroFinessÉtablissementTerritorial,
  };
  return filtredAutorisationCapacite;
};

const filterRessourcesHumainesSanitaire = (ressourcesHumaines: EtablissementTerritorialSanitaireRH[], profil: any): EtablissementTerritorialSanitaireRH[] => {
  ressourcesHumaines.forEach((rh) => {
    if (profil.nombreEtpPm !== 'ok') rh.nombreEtpPm.valeur = "";
    if (profil.nombreEtpPnm !== 'ok') rh.nombreEtpPnm.valeur = "";
    if (profil.depensesInterimPm !== 'ok') rh.depensesInterimPm.valeur = "";
    if (profil.joursAbsenteismePm !== 'ok') rh.joursAbsenteismePm.valeur = "";
    if (profil.joursAbsenteismePnm !== 'ok') rh.joursAbsenteismePnm.valeur = "";
  });
  return ressourcesHumaines;
}


const filterQualiteSanitaireEtMS = (qualite: any, profil: any) => {
  const filtredQualite = {
    reclamations: profil.DonnéesSirec === "ok" ? qualite.reclamations : [{ details: [] }],
    evenementsIndesirables: profil.DonnéesSivss === "ok" ? qualite.evenementsIndesirables : [],
    inspectionsEtControles: profil.DonnéesSiicea === "ok" ? qualite.inspectionsEtControles : { dateMiseAJourSource: "", inspectionsEtControles: [] },
  };
  return filtredQualite;
};

const filterIdentiteMedicoSocial = (identite: any, profil: any) => {
  if (profil.adresse !== 'ok') {
    identite.adresseAcheminement = { 'dateMiseÀJourSource': '', value: '' };
    identite.adresseNuméroVoie = { 'dateMiseÀJourSource': '', value: '' };
    identite.adresseTypeVoie = { 'dateMiseÀJourSource': '', value: '' };
    identite.adresseVoie = { 'dateMiseÀJourSource': '', value: '' };
  }

  identite.catégorieÉtablissement = profil.catégorieÉtablissement === 'ok' ? identite.catégorieÉtablissement : { 'dateMiseÀJourSource': '', value: '' };

  if (profil.modeTarification !== 'ok') {
    identite.codeModeTarification = { 'dateMiseÀJourSource': '', value: '' };
    identite.libelléModeTarification = { 'dateMiseÀJourSource': '', value: '' };
  }

  if (profil.télEtEmail !== 'ok') {
    identite.courriel = { 'dateMiseÀJourSource': '', value: '' };
    identite.téléphone = { 'dateMiseÀJourSource': '', value: '' };
    identite.dateOuverture = { 'dateMiseÀJourSource': '', value: '' };
  }

  identite.dateDEntréeEnVigueurDuCpom = profil.dateDEntréeEnVigueurDuCpom === 'ok' ? identite.dateDEntréeEnVigueurDuCpom : { 'dateMiseÀJourSource': '', value: '' };

  identite.libelléCatégorieÉtablissement = profil.catégorieÉtablissement === 'ok' ? identite.libelléCatégorieÉtablissement : { 'dateMiseÀJourSource': '', value: '' };

  if (profil.EJ_rattachement !== 'ok') {
    identite.numéroFinessEntitéJuridique = { 'dateMiseÀJourSource': '', value: '' };
    identite.raisonSocialeDeLEntitéDeRattachement = { 'dateMiseÀJourSource': '', value: '' };
  }

  if (profil.ET_principal_secondaire !== 'ok') {
    identite.numéroFinessÉtablissementPrincipal = { 'dateMiseÀJourSource': '', value: '' };
    identite.typeÉtablissement = { 'dateMiseÀJourSource': '', value: '' };
  }

  identite.numéroFinessÉtablissementTerritorial = profil.numéroFiness === 'ok' ? identite.numéroFinessÉtablissementTerritorial : '';

  if (profil.nom !== 'ok') {
    identite.raisonSociale = { 'dateMiseÀJourSource': '', value: '' };
    identite.raisonSocialeCourte = { 'dateMiseÀJourSource': '', value: '' };
  }

  identite.siret = profil.siret === 'ok' ? identite.siret : { 'dateMiseÀJourSource': '', value: '' };

  if (profil.statut_EJ !== 'ok') {
    identite.statutJuridique = { 'dateMiseÀJourSource': '', value: '' };
    identite.categorisationDeLEntitéDeRattachement = { 'dateMiseÀJourSource': '', value: '' };
  }

  identite.estMonoÉtablissement = profil.mono_établissement === 'ok' ? identite.estMonoÉtablissement : { 'dateMiseÀJourSource': '', value: '' };
  return identite;
}


const filterActiviteMedicoSocial = (activites: any[], profil: any) => {
  const fieldConfigurations = [
    {
      field: 'duréeMoyenneSéjourAccompagnementPersonnesSorties',
      condition: profil.duréeMoyenneSéjourAccompagnementPersonnesSorties === "ok",
      defaultValue: { dateMiseÀJourSource: "", value: "" }
    },
    {
      field: 'fileActivePersonnesAccompagnées',
      condition: profil.fileActivePersonnesAccompagnées === "ok",
      defaultValue: { dateMiseÀJourSource: "", value: "" }
    },
    {
      field: 'nombreMoyenJournéesAbsencePersonnesAccompagnées',
      condition: profil.nombreMoyenJournéesAbsencePersonnesAccompagnées === "ok",
      defaultValue: { dateMiseÀJourSource: "", value: "" }
    },
    {
      field: 'tauxOccupationAccueilDeJour',
      condition: profil.tauxOccupationAccueilDeJour === "ok",
      defaultValue: { dateMiseÀJourSource: "", value: "" }
    },
    {
      field: 'tauxOccupationHébergementPermanent',
      condition: profil.tauxOccupationHébergementPermanent === "ok",
      defaultValue: { dateMiseÀJourSource: "", value: "" }
    },
    {
      field: 'tauxOccupationHébergementTemporaire',
      condition: profil.tauxOccupationHébergementTemporaire === "ok",
      defaultValue: { dateMiseÀJourSource: "", value: "" }
    },
    {
      field: 'tauxRéalisationActivité',
      condition: profil.tauxRéalisationActivité === "ok",
      defaultValue: { dateMiseÀJourSource: "", value: "" }
    },
    {
      field: 'tauxOccupationGlobal',
      condition: profil.tauxOccupationGlobal === "ok",
      defaultValue: { dateMiseÀJourSource: "", value: "" }
    },
    {
      field: 'tauxOccupationExternat',
      condition: profil.tauxOccupationExternat === "ok",
      defaultValue: { value: "" }
    },
    {
      field: 'tauxOccupationSemiInternat',
      condition: profil.tauxOccupationSemiInternat === "ok",
      defaultValue: { value: "" }
    },
    {
      field: 'tauxOccupationInternat',
      condition: profil.tauxOccupationInternat === "ok",
      defaultValue: { value: "" }
    },
    {
      field: 'tauxOccupationAutre',
      condition: profil.tauxOccupationAutre === "ok",
      defaultValue: { value: "" }
    },
    {
      field: 'tauxOccupationSeances',
      condition: profil.tauxOccupationSeances === "ok",
      defaultValue: { value: "" }
    }
  ];

  return activites.map(activite => {
    const filteredActivite = { ...activite };

    fieldConfigurations.forEach(({ field, condition, defaultValue }) => {
      if (!condition) {
        filteredActivite[field] = defaultValue;
      }
    });

    return filteredActivite;
  });
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
    if (profil.compteRésultats !== "ok") {
      budgetFinance.cadreBudgétaire = "";
      budgetFinance.chargesEtProduits = { dateMiseÀJourSource: "" };
      budgetFinance.recettesEtDépenses = { dateMiseÀJourSource: "" };
    }

    budgetFinance.contributionAuxFraisDeSiège = profil.contributionAuxFraisDeSiège === "ok" ? budgetFinance.contributionAuxFraisDeSiège : { dateMiseÀJourSource: "", valeur: "" };

    budgetFinance.fondsDeRoulement = profil.fondsDeRoulement === "ok" ? budgetFinance.fondsDeRoulement : { dateMiseÀJourSource: "", valeur: "" };

    budgetFinance.résultatNetComptable = profil.résultatNetComptable === "ok" ? budgetFinance.résultatNetComptable : { dateMiseÀJourSource: "", valeur: "" };

    budgetFinance.tauxDeCafNette = profil.tauxDeCafNette === "ok" ? budgetFinance.tauxDeCafNette : { dateMiseÀJourSource: "", valeur: "" };

    budgetFinance.tauxDeVétustéConstruction = profil.tauxDeVétustéConstruction === "ok" ? budgetFinance.tauxDeVétustéConstruction : { dateMiseÀJourSource: "", valeur: "" };
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

const filterActiviteEJ = (activites: any, profil: any) => {
  const fieldGroups = [
    {
      condition: profil.nombrePassage === "ok",
      fields: ["nombreDePassagesAuxUrgences"]
    },
    {
      condition: profil.nombreJournées === "ok",
      fields: [
        "nombreJournéesCompletesPsy",
        "nombreJournéesCompletesSsr",
        "nombreJournéesPartiellesPsy",
        "nombreJournéesPartiellesSsr"
      ]
    },
    {
      condition: profil.nombreSéjours === "ok",
      fields: [
        "nombreSéjoursCompletsChirurgie",
        "nombreSéjoursCompletsMédecine",
        "nombreSéjoursCompletsObstétrique",
        "nombreSéjoursPartielsChirurgie",
        "nombreSéjoursPartielsMédecine",
        "nombreSéjoursPartielsObstétrique"
      ]
    },
    {
      condition: profil.nombreSéjoursHad === "ok",
      fields: ["nombreSéjoursHad"]
    },
    {
      condition: profil.nombreJourneesUsld === "ok",
      fields: ["nombreJourneesUsld"]
    }
  ];

  return activites.map((activite: any) => {
    const filteredActivite = { ...activite };

    fieldGroups.forEach(({ condition, fields }) => {
      fields.forEach(field => {
        if (!condition) {
          filteredActivite[field] = { dateMiseÀJourSource: "", value: "" };
        }
      });
    });

    return filteredActivite;
  });

};

const filterAutorisationCapaciteEJ = (autorisationsEtCapacites: any, profil: any) => {
  const filtredAutorisationCapacite = {
    autorisationsActivités:
      profil.autorisationsActivités === "ok" ? autorisationsEtCapacites.autorisationsActivités : { dateMiseÀJourSource: "", autorisations: [] },
    autorisationsAmmSanitaire:
      profil.autorisationsActivités === "ok" ? autorisationsEtCapacites.autorisationsAmmSanitaire : { dateMiseÀJourSource: "", autorisations: [] },
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
    if (profil.compteRésultats !== "ok") {
      budget.depensesTitreIGlobal = "";
      budget.depensesTitreIIGlobal = "";
      budget.depensesTitreIIIGlobal = "";
      budget.depensesTitreIVGlobal = "";
      budget.totalDepensesGlobal = "";

      budget.recettesTitreIGlobal = "";
      budget.recettesTitreIIGlobal = "";
      budget.recettesTitreIIIGlobal = "";
      budget.recettesTitreIVGlobal = "";
      budget.totalRecettesGlobal = "";

      budget.depensesTitreIPrincipales = "";
      budget.depensesTitreIIPrincipales = "";
      budget.depensesTitreIIIPrincipales = "";
      budget.depensesTitreIVPrincipales = "";
      budget.totalDepensesPrincipales = "";

      budget.recettesTitreIPrincipales = "";
      budget.recettesTitreIIPrincipales = "";
      budget.recettesTitreIIIPrincipales = "";
      budget.totalRecettesPrincipales = "";

      budget.depensesTitreIAnnexe = "";
      budget.depensesTitreIIAnnexe = "";
      budget.depensesTitreIIIAnnexe = "";
      budget.depensesTitreIVAnnexe = "";
      budget.totalDepensesAnnexe = "";

      budget.recettesTitreIAnnexe = "";
      budget.recettesTitreIIAnnexe = "";
      budget.recettesTitreIIIAnnexe = "";
      budget.recettesTitreIVAnnexe = "";
      budget.totalRecettesAnnexe = "";
    }

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
      /*  @ts-ignore */
      alrSub.montantNotifié = profil.allocationDeRessources === "ok" ? alrSub.montantNotifié : "";
    }
  }

  return allocationRessource;
};

const filterRessourcesHumainesEJ = (ressourcesHumaines: EntiteJuridiqueRessourcesHumaines[], profil: any): EntiteJuridiqueRessourcesHumaines[] => {
  ressourcesHumaines.forEach((rh) => {
    if (profil.nombreEtpPm !== 'ok') rh.nombreEtpPm.valeur = "";
    if (profil.nombreEtpPnm !== 'ok') rh.nombreEtpPnm.valeur = "";
    if (profil.depensesInterimPm !== 'ok') rh.depensesInterimPm.valeur = "";
    if (profil.joursAbsenteismePm !== 'ok') rh.joursAbsenteismePm.valeur = "";
    if (profil.joursAbsenteismePnm !== 'ok') rh.joursAbsenteismePnm.valeur = "";
  });
  return ressourcesHumaines;
}

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
