import { ActivitesSanitaireMensuel } from "./métier/entities/ActivitesSanitaireMensuel";
import { AllocationRessource } from "./métier/entities/AllocationRessource";
import { CatégorisationEnum, EntitéJuridique, EntitéJuridiqueIdentité } from "./métier/entities/entité-juridique/EntitéJuridique";
import { EntitéJuridiqueActivités } from "./métier/entities/entité-juridique/EntitéJuridiqueActivités";
import { EntitéJuridiqueAutorisationEtCapacité } from "./métier/entities/entité-juridique/EntitéJuridiqueAutorisationEtCapacité";
import { EntitéJuridiqueBudgetFinance } from "./métier/entities/entité-juridique/EntitéJuridiqueBudgetFinance";
import { filterEntiteJuridique } from "./profileFiltersHelper";

function getIdentiteJuridique(): EntitéJuridiqueIdentité {
  return {
    adresseAcheminement: { dateMiseÀJourSource: "dateMajAddressAch", value: "adresseAcheminement" },
    adresseNuméroVoie: { dateMiseÀJourSource: "dateMajAdressNumVoie", value: "AdressNumVoie" },
    adresseTypeVoie: { dateMiseÀJourSource: "dateMajAdressTypeVoie", value: "adresseTypeVoie" },
    adresseVoie: { dateMiseÀJourSource: "dateMajAddressVoie", value: "adresseVoie" },
    catégorisation: CatégorisationEnum.PUBLIC,
    libelléStatutJuridique: { dateMiseÀJourSource: "dateMajLibStatJuri", value: "libStatusJuri" },
    numéroFinessEntitéJuridique: { dateMiseÀJourSource: "dateMajNumFinessJuri", value: "numFinessJuri" },
    raisonSociale: { dateMiseÀJourSource: "dateMajRaisonSociale", value: "raisonSociale" },
    raisonSocialeCourte: { dateMiseÀJourSource: "dateMajRaisonSocialeCourte", value: "raisonSocialeCourte" },
    siren: {
      dateMiseÀJourSource: "dateMajSiren", value: "siren"
    },
    téléphone: { dateMiseÀJourSource: "dateMajTel", value: "tel" },
    dateOuverture: { dateMiseÀJourSource: "dateMajDateOuv", value: "dateOuverture" },
    codeRegion: "codeRegion",
  };
};

function getActiviteJuridique(): EntitéJuridiqueActivités {
  return {
    année: 2025,
    nombreDePassagesAuxUrgences: { dateMiseÀJourSource: "dateMajNbPassUrg", value: 1 },
    nombreJournéesCompletesPsy: { dateMiseÀJourSource: "dateMajJourCompPsy", value: 2 },
    nombreJournéesCompletesSsr: { dateMiseÀJourSource: "dateMajJourCompSsr", value: 3 },
    nombreJournéesPartiellesPsy: { dateMiseÀJourSource: "dateMajJourPartPsy", value: 4 },
    nombreJournéesPartiellesSsr: { dateMiseÀJourSource: "dateMajJourPartSsr", value: 5 },
    nombreSéjoursCompletsChirurgie: { dateMiseÀJourSource: "dateMajCompChir", value: 6 },
    nombreSéjoursCompletsMédecine: { dateMiseÀJourSource: "dateMajCompMed", value: 7 },
    nombreSéjoursCompletsObstétrique: { dateMiseÀJourSource: "dateMajCompObst", value: 8 },
    nombreSéjoursPartielsChirurgie: { dateMiseÀJourSource: "dateMajPartChir", value: 9 },
    nombreSéjoursPartielsMédecine: { dateMiseÀJourSource: "dateMajPartMed", value: 10 },
    nombreSéjoursPartielsObstétrique: { dateMiseÀJourSource: "dateMajPartObst", value: 11 },
    nombreSéjoursHad: { dateMiseÀJourSource: "dateMajHad", value: 12 },
    nombreJourneesUsld: { dateMiseÀJourSource: "dateMajJourUsld", value: 13 },
  };
}

function getActiviteMensuelleJuridique(): ActivitesSanitaireMensuel {
  return {
    dateDeMiseAJour: "dateMajActMensJuri",
    activitesSanitaireMensuelList: [{
      année: 2025,
      mois: 12,
      nombreJournéesPartiellesSsr: 1,
      nombreJournéesCompletesSsr: 2,
      nombreSéjoursCompletsChirurgie: 3,
      nombreSéjoursCompletsMédecine: 4,
      nombreSéjoursCompletsObstétrique: 5,
      nombreSéjoursPartielsChirurgie: 6,
      nombreSéjoursPartielsMédecine: 7,
      nombreSéjoursPartielsObstétrique: 8,
    }],
  };
}

function getAutorisationCapaciteJuridique(): EntitéJuridiqueAutorisationEtCapacité {
  return {
    numéroFinessEntitéJuridique: "numFinEtJuri",
    capacités: [{
      année: 2025, dateMiseÀJourSource: "dateMajCap", nombreDeLitsEnChirurgie: 1, nombreDeLitsEnMédecine: 2, nombreDeLitsEnObstétrique: 3, nombreDeLitsEnSsr: 4, nombreDeLitsEnUsld: 5, nombreDeLitsOuPlacesEnPsyHospitalisationComplète: 6, nombreDePlacesEnChirurgie: 7, nombreDePlacesEnMédecine: 8, nombreDePlacesEnObstétrique: 9, nombreDePlacesEnPsyHospitalisationPartielle: 10, nombreDePlacesEnSsr: 11
    }],
    autorisationsActivités: { dateMiseÀJourSource: "dateMajAutorisation", autorisations: [{ modalites: [], libelle: "libAutoriAct", code: "codeAutoriAct" }] },
    autresActivités: { dateMiseÀJourSource: "dateMajAutreActivite", autorisations: [{ modalites: [], libelle: "libAutreAct", code: "codeAutreAct" }] },
    reconnaissanceContractuelleActivités: { dateMiseÀJourSource: "dateMajReco", autorisations: [{ modalites: [], libelle: "libRecoContr", code: "codeRecoContr" }] },
    equipementMaterielLourdsActivités: { dateMiseÀJourSource: "dateMajEquipeLourd", autorisations: [] },

  }
}

function getBudgetFinanceJuridique(): EntitéJuridiqueBudgetFinance {
  return {
    dateMiseÀJourSource: "dateMajBudg",
    année: 2025,
    depensesTitreIGlobal: 1,
    depensesTitreIIGlobal: 2,
    depensesTitreIIIGlobal: 3,
    depensesTitreIVGlobal: 4,
    totalDepensesGlobal: 5,
    recettesTitreIGlobal: 6,
    recettesTitreIIGlobal: 7,
    recettesTitreIIIGlobal: 8,
    recettesTitreIVGlobal: 9,
    totalRecettesGlobal: 10,
    depensesTitreIPrincipales: 11,
    depensesTitreIIPrincipales: 12,
    depensesTitreIIIPrincipales: 13,
    depensesTitreIVPrincipales: 14,
    totalDepensesPrincipales: 15,
    recettesTitreIPrincipales: 16,
    recettesTitreIIPrincipales: 17,
    recettesTitreIIIPrincipales: 18,
    totalRecettesPrincipales: 19,
    depensesTitreIAnnexe: 20,
    depensesTitreIIAnnexe: 21,
    depensesTitreIIIAnnexe: 22,
    depensesTitreIVAnnexe: 23,
    totalDepensesAnnexe: 24,
    recettesTitreIAnnexe: 25,
    recettesTitreIIAnnexe: 26,
    recettesTitreIIIAnnexe: 27,
    recettesTitreIVAnnexe: 28,
    totalRecettesAnnexe: 29,
    resultatNetComptable: 30,
    ratioDependanceFinanciere: 31,
    tauxDeCafNetSan: 32,
  }
}

function getAllocationRessource(): AllocationRessource {
  return {
    dateMiseÀJourSource: "dateMaj",
    data: [{
      année: 2025,
      allocationRessoure: [{
        enveloppe: "enveloppe",
        sousEnveloppe: "sousEnveloppe",
        modeDeDélégation: "modeDeDélégation",
        montantNotifié: 1,

      }],
    }],
  }
}

function getFullEntiteJuridique(): EntitéJuridique {
  return {
    ...getIdentiteJuridique(),
    activités: [getActiviteJuridique()],
    activitésMensuels: getActiviteMensuelleJuridique(),
    budgetFinance: [getBudgetFinanceJuridique()],
    autorisationsEtCapacites: getAutorisationCapaciteJuridique(),
    allocationRessource: getAllocationRessource(),
  }
}

function getIdentityProfile() {
  return {
    adresse: 'ok',
    statut_EJ: 'ok',
    nom: 'ok',
    siret: 'ok',
    télEtEmail: 'ok',
  };
};

function getActiviteProfile() {
  return {
    nombreSéjours: "ok",
    nombreJournées: "ok",
    nombrePassage: "ok",
    nombreSéjoursHad: "ok",
    nombreJourneesUsld: "ok",
  }
}

function getAutorisationCapaciteProfile() {
  return {
    autorisationsActivités: "ok",
    autresActivités: "ok",
    reconnaissanceContractuelleActivités: "ok",
    equipementMaterielLourdsActivités: "ok",
    capacités: "ok",
  }
}

function getBudgetFinanceProfile() {
  return {
    compteRésultats: "ok",
    résultatNetComptable: "ok",
    ratioDépendanceFinancière: "ok",
    tauxDeCafNette: "ok",
    allocationDeRessources: "ok",
  }
}

function getFullProfile() {
  return {
    identité: getIdentityProfile(),
    activités: getActiviteProfile(),
    autorisationsEtCapacités: getAutorisationCapaciteProfile(),
    budgetEtFinance: getBudgetFinanceProfile(),
  }
}

describe("Filtre des informations d’identité des etablissement juridique par rapport au profil", () => {
  it("laisse toutes les informations si il y a les droits", () => {
    // Given
    const rawEntity = getFullEntiteJuridique();
    let entiteJuriResult = getFullEntiteJuridique();
    const profile = getFullProfile();

    // When
    entiteJuriResult = filterEntiteJuridique(entiteJuriResult, profile);

    // Then
    expect(entiteJuriResult).toEqual(rawEntity);
  });

  it("retire l’adresse si il n’y a pas les droits", () => {
    // Given
    const rawEntity = getFullEntiteJuridique();
    const expectedIdentity = {
      ...rawEntity,
      adresseAcheminement: { 'dateMiseÀJourSource': '', value: '' },
      adresseNuméroVoie: { 'dateMiseÀJourSource': '', value: '' },
      adresseTypeVoie: { 'dateMiseÀJourSource': '', value: '' },
      adresseVoie: { 'dateMiseÀJourSource': '', value: '' },
    }

    let entiteJuriResult = getFullEntiteJuridique();
    const profile = getFullProfile();
    profile.identité.adresse = "Ko";

    // When
    entiteJuriResult = filterEntiteJuridique(entiteJuriResult, profile);

    // Then
    expect(entiteJuriResult).toEqual(expectedIdentity);
  });

  it("retire le statut juridique si il n’y a pas les droits", () => {
    // Given
    const rawEntity = getFullEntiteJuridique();
    const expectedIdentity = {
      ...rawEntity,
      libelléStatutJuridique: { 'dateMiseÀJourSource': '', value: '' },
    }

    let entiteJuriResult = getFullEntiteJuridique();
    const profile = getFullProfile();
    profile.identité.statut_EJ = "Ko";

    // When
    entiteJuriResult = filterEntiteJuridique(entiteJuriResult, profile);

    // Then
    expect(entiteJuriResult).toEqual(expectedIdentity);
  });

  it("retire les informations de raison sociale si il n’y a pas les droits", () => {
    // Given
    const rawEntity = getFullEntiteJuridique();
    const expectedIdentity = {
      ...rawEntity,
      raisonSociale: { 'dateMiseÀJourSource': '', value: '' },
      raisonSocialeCourte: { 'dateMiseÀJourSource': '', value: '' },
    }

    let entiteJuriResult = getFullEntiteJuridique();
    const profile = getFullProfile();
    profile.identité.nom = "Ko";

    // When
    entiteJuriResult = filterEntiteJuridique(entiteJuriResult, profile);

    // Then
    expect(entiteJuriResult).toEqual(expectedIdentity);
  });

  it("retire le siren si il n’y a pas les droits", () => {
    // Given
    const rawEntity = getFullEntiteJuridique();
    const expectedIdentity = {
      ...rawEntity,
      siren: { 'dateMiseÀJourSource': '', value: '' },
    }

    let entiteJuriResult = getFullEntiteJuridique();
    const profile = getFullProfile();
    profile.identité.siret = "Ko";

    // When
    entiteJuriResult = filterEntiteJuridique(entiteJuriResult, profile);

    // Then
    expect(entiteJuriResult).toEqual(expectedIdentity);
  });

  it("retire les informations de contact si il n’y a pas les droits", () => {
    // Given
    const rawEntity = getFullEntiteJuridique();
    const expectedIdentity = {
      ...rawEntity,
      téléphone: { 'dateMiseÀJourSource': '', value: '' },
      dateOuverture: { 'dateMiseÀJourSource': '', value: '' },
    }

    let entiteJuriResult = getFullEntiteJuridique();
    const profile = getFullProfile();
    profile.identité.télEtEmail = "Ko";

    // When
    entiteJuriResult = filterEntiteJuridique(entiteJuriResult, profile);

    // Then
    expect(entiteJuriResult).toEqual(expectedIdentity);
  });
});

describe("Filtre des informations d’activité des etablissement juridique par rapport au profil", () => {
  it("laisse toutes les informations si il y a tous les droits", () => {
    // Given
    const rawActivity = getActiviteJuridique();

    let entiteJuridiqueResult = getFullEntiteJuridique();
    const profile = getFullProfile();

    // When
    entiteJuridiqueResult = filterEntiteJuridique(entiteJuridiqueResult, profile);

    // Then
    expect(entiteJuridiqueResult.activités).toEqual([rawActivity]);
  });

  it("retire les info sur les sejours si il n’y a pas les droits", () => {
    // Given
    const rawActivity = getActiviteJuridique();
    const expectedActivity = {
      ...rawActivity,
      nombreSéjoursCompletsChirurgie: { dateMiseÀJourSource: "", value: "" },
      nombreSéjoursCompletsMédecine: { dateMiseÀJourSource: "", value: "" },
      nombreSéjoursCompletsObstétrique: { dateMiseÀJourSource: "", value: "" },
      nombreSéjoursPartielsChirurgie: { dateMiseÀJourSource: "", value: "" },
      nombreSéjoursPartielsMédecine: { dateMiseÀJourSource: "", value: "" },
      nombreSéjoursPartielsObstétrique: { dateMiseÀJourSource: "", value: "" },

    }

    let entiteJuridiqueResult = getFullEntiteJuridique();
    const profile = getFullProfile();
    profile.activités.nombreSéjours = "Ko";

    // When
    entiteJuridiqueResult = filterEntiteJuridique(entiteJuridiqueResult, profile);

    // Then
    expect(entiteJuridiqueResult.activités).toEqual([expectedActivity]);
  });

  it("retire les info sur le nombre de journee si il n’y a pas les droits", () => {
    // Given
    const rawActivity = getActiviteJuridique();
    const expectedActivity = {
      ...rawActivity,
      nombreJournéesCompletesPsy: { dateMiseÀJourSource: "", value: "" },
      nombreJournéesCompletesSsr: { dateMiseÀJourSource: "", value: "" },
      nombreJournéesPartiellesPsy: { dateMiseÀJourSource: "", value: "" },
      nombreJournéesPartiellesSsr: { dateMiseÀJourSource: "", value: "" },
    }

    let entiteJuridiqueResult = getFullEntiteJuridique();
    const profile = getFullProfile();
    profile.activités.nombreJournées = "Ko";

    // When
    entiteJuridiqueResult = filterEntiteJuridique(entiteJuridiqueResult, profile);

    // Then
    expect(entiteJuridiqueResult.activités).toEqual([expectedActivity]);
  });

  it("retire les info sur le nombre de passage si il n’y a pas les droits", () => {
    // Given
    const rawActivity = getActiviteJuridique();
    const expectedActivity = {
      ...rawActivity,
      nombreDePassagesAuxUrgences: { dateMiseÀJourSource: "", value: "" },
    }

    let entiteJuridiqueResult = getFullEntiteJuridique();
    const profile = getFullProfile();
    profile.activités.nombrePassage = "Ko";

    // When
    entiteJuridiqueResult = filterEntiteJuridique(entiteJuridiqueResult, profile);

    // Then
    expect(entiteJuridiqueResult.activités).toEqual([expectedActivity]);
  });

  it("retire les info de sejour had si il n’y a pas les droits", () => {
    // Given
    const rawActivity = getActiviteJuridique();
    const expectedActivity = {
      ...rawActivity,
      nombreSéjoursHad: { dateMiseÀJourSource: "", value: "" },
    }

    let entiteJuridiqueResult = getFullEntiteJuridique();
    const profile = getFullProfile();
    profile.activités.nombreSéjoursHad = "Ko";

    // When
    entiteJuridiqueResult = filterEntiteJuridique(entiteJuridiqueResult, profile);

    // Then
    expect(entiteJuridiqueResult.activités).toEqual([expectedActivity]);
  });

  it("retire les info de sejour Usld si il n’y a pas les droits", () => {
    // Given
    const rawActivity = getActiviteJuridique();
    const expectedActivity = {
      ...rawActivity,
      nombreJourneesUsld: { dateMiseÀJourSource: "", value: "" },
    }

    let entiteJuridiqueResult = getFullEntiteJuridique();
    const profile = getFullProfile();
    profile.activités.nombreJourneesUsld = "Ko";

    // When
    entiteJuridiqueResult = filterEntiteJuridique(entiteJuridiqueResult, profile);

    // Then
    expect(entiteJuridiqueResult.activités).toEqual([expectedActivity]);
  });

})

describe("Filtre des informations d’autorisation des etablissement juridique par rapport au profil", () => {
  it("laisse toutes les informations si il y a tous les droits", () => {
    // Given
    const rawAutorisationCapacity = getAutorisationCapaciteJuridique();

    let entiteJuridiqueResult = getFullEntiteJuridique();
    const profile = getFullProfile();

    // When
    entiteJuridiqueResult = filterEntiteJuridique(entiteJuridiqueResult, profile);

    // Then
    expect(entiteJuridiqueResult.autorisationsEtCapacites).toEqual(rawAutorisationCapacity);
  });

  it("retire les info d’autorisation d’activite si il n’y a pas les droits", () => {
    // Given
    const rawAutorisationCapacity = getAutorisationCapaciteJuridique();
    const expectedAutorisationCapacity = {
      ...rawAutorisationCapacity,
      autorisationsActivités: { dateMiseÀJourSource: "", autorisations: [] },
    }

    let entiteJuridiqueResult = getFullEntiteJuridique();
    const profile = getFullProfile();
    profile.autorisationsEtCapacités.autorisationsActivités = "Ko";

    // When
    entiteJuridiqueResult = filterEntiteJuridique(entiteJuridiqueResult, profile);

    // Then
    expect(entiteJuridiqueResult.autorisationsEtCapacites).toEqual(expectedAutorisationCapacity);
  });

  it("retire les info d’autorisation d’autre activite si il n’y a pas les droits", () => {
    // Given
    const rawAutorisationCapacity = getAutorisationCapaciteJuridique();
    const expectedAutorisationCapacity = {
      ...rawAutorisationCapacity,
      autresActivités: { dateMiseÀJourSource: "", autorisations: [] },
    }

    let entiteJuridiqueResult = getFullEntiteJuridique();
    const profile = getFullProfile();
    profile.autorisationsEtCapacités.autresActivités = "Ko";

    // When
    entiteJuridiqueResult = filterEntiteJuridique(entiteJuridiqueResult, profile);

    // Then
    expect(entiteJuridiqueResult.autorisationsEtCapacites).toEqual(expectedAutorisationCapacity);
  });

  it("retire les info de reconnaissance contractuelle si il n’y a pas les droits", () => {
    // Given
    const rawAutorisationCapacity = getAutorisationCapaciteJuridique();
    const expectedAutorisationCapacity = {
      ...rawAutorisationCapacity,
      reconnaissanceContractuelleActivités: { dateMiseÀJourSource: "", autorisations: [] },
    }

    let entiteJuridiqueResult = getFullEntiteJuridique();
    const profile = getFullProfile();
    profile.autorisationsEtCapacités.reconnaissanceContractuelleActivités = "Ko";

    // When
    entiteJuridiqueResult = filterEntiteJuridique(entiteJuridiqueResult, profile);

    // Then
    expect(entiteJuridiqueResult.autorisationsEtCapacites).toEqual(expectedAutorisationCapacity);
  });

  it("retire les info d’activite d’equipement materiel lourd si il n’y a pas les droits", () => {
    // Given
    const rawAutorisationCapacity = getAutorisationCapaciteJuridique();
    const expectedAutorisationCapacity = {
      ...rawAutorisationCapacity,
      equipementMaterielLourdsActivités: { dateMiseÀJourSource: "", autorisations: [] },
    }

    let entiteJuridiqueResult = getFullEntiteJuridique();
    const profile = getFullProfile();
    profile.autorisationsEtCapacités.equipementMaterielLourdsActivités = "Ko";

    // When
    entiteJuridiqueResult = filterEntiteJuridique(entiteJuridiqueResult, profile);

    // Then
    expect(entiteJuridiqueResult.autorisationsEtCapacites).toEqual(expectedAutorisationCapacity);
  });

  it("retire les info de capacite si il n’y a pas les droits", () => {
    // Given
    const rawAutorisationCapacity = getAutorisationCapaciteJuridique();
    const expectedAutorisationCapacity = {
      ...rawAutorisationCapacity,
      capacités: [{ dateMiseÀJourSource: "" }],
    }

    let entiteJuridiqueResult = getFullEntiteJuridique();
    const profile = getFullProfile();
    profile.autorisationsEtCapacités.capacités = "Ko";

    // When
    entiteJuridiqueResult = filterEntiteJuridique(entiteJuridiqueResult, profile);

    // Then
    expect(entiteJuridiqueResult.autorisationsEtCapacites).toEqual(expectedAutorisationCapacity);
  });

});

describe("Filtre les informations de budget et finance des etablissement juridique par rapport au profil", () => {
  it("laisse toutes les informations si il y a tous les droits", () => {
    // Given
    const rawBudgetAndFinance = getBudgetFinanceJuridique();

    let entiteJuridiqueResult = getFullEntiteJuridique();
    const profile = getFullProfile();

    // When
    entiteJuridiqueResult = filterEntiteJuridique(entiteJuridiqueResult, profile);

    // Then
    expect(entiteJuridiqueResult.budgetFinance).toEqual([rawBudgetAndFinance]);
  });

  it("retire les info de resultat de compte si il n’y a pas les droits", () => {
    // Given
    const rawBudgetAndFinance = getBudgetFinanceJuridique();
    const expectedBudgetAndFinance = {
      ...rawBudgetAndFinance,
      depensesTitreIGlobal: "",
      depensesTitreIIGlobal: "",
      depensesTitreIIIGlobal: "",
      depensesTitreIVGlobal: "",
      totalDepensesGlobal: "",
      recettesTitreIGlobal: "",
      recettesTitreIIGlobal: "",
      recettesTitreIIIGlobal: "",
      recettesTitreIVGlobal: "",
      totalRecettesGlobal: "",
      depensesTitreIPrincipales: "",
      depensesTitreIIPrincipales: "",
      depensesTitreIIIPrincipales: "",
      depensesTitreIVPrincipales: "",
      totalDepensesPrincipales: "",
      recettesTitreIPrincipales: "",
      recettesTitreIIPrincipales: "",
      recettesTitreIIIPrincipales: "",
      totalRecettesPrincipales: "",
      depensesTitreIAnnexe: "",
      depensesTitreIIAnnexe: "",
      depensesTitreIIIAnnexe: "",
      depensesTitreIVAnnexe: "",
      totalDepensesAnnexe: "",
      recettesTitreIAnnexe: "",
      recettesTitreIIAnnexe: "",
      recettesTitreIIIAnnexe: "",
      recettesTitreIVAnnexe: "",
      totalRecettesAnnexe: "",
    }

    let entiteJuridiqueResult = getFullEntiteJuridique();
    const profile = getFullProfile();
    profile.budgetEtFinance.compteRésultats = "Ko";

    // When
    entiteJuridiqueResult = filterEntiteJuridique(entiteJuridiqueResult, profile);

    // Then
    expect(entiteJuridiqueResult.budgetFinance).toEqual([expectedBudgetAndFinance]);
  })

  it("retire les info de resultat net comptable si il n’y a pas les droits", () => {
    // Given
    const rawBudgetAndFinance = getBudgetFinanceJuridique();
    const expectedBudgetAndFinance = {
      ...rawBudgetAndFinance,
      resultatNetComptable: "",
    }

    let entiteJuridiqueResult = getFullEntiteJuridique();
    const profile = getFullProfile();
    profile.budgetEtFinance.résultatNetComptable = "Ko";

    // When
    entiteJuridiqueResult = filterEntiteJuridique(entiteJuridiqueResult, profile);

    // Then
    expect(entiteJuridiqueResult.budgetFinance).toEqual([expectedBudgetAndFinance]);
  })

  it("retire les info de ratio de dependance financière si il n’y a pas les droits", () => {
    // Given
    const rawBudgetAndFinance = getBudgetFinanceJuridique();
    const expectedBudgetAndFinance = {
      ...rawBudgetAndFinance,
      ratioDependanceFinanciere: "",
    }

    let entiteJuridiqueResult = getFullEntiteJuridique();
    const profile = getFullProfile();
    profile.budgetEtFinance.ratioDépendanceFinancière = "Ko";

    // When
    entiteJuridiqueResult = filterEntiteJuridique(entiteJuridiqueResult, profile);

    // Then
    expect(entiteJuridiqueResult.budgetFinance).toEqual([expectedBudgetAndFinance]);
  })

  it("retire les info de taux de caf nette si il n’y a pas les droits", () => {
    // Given
    const rawBudgetAndFinance = getBudgetFinanceJuridique();
    const expectedBudgetAndFinance = {
      ...rawBudgetAndFinance,
      tauxDeCafNetSan: "",
    }

    let entiteJuridiqueResult = getFullEntiteJuridique();
    const profile = getFullProfile();
    profile.budgetEtFinance.tauxDeCafNette = "Ko";

    // When
    entiteJuridiqueResult = filterEntiteJuridique(entiteJuridiqueResult, profile);

    // Then
    expect(entiteJuridiqueResult.budgetFinance).toEqual([expectedBudgetAndFinance]);
  })

  it("retire les info d’allocation de ressource si il n’y a pas les droits", () => {
    // Given
    const rawAllocation = getAllocationRessource();
    const expectedAllocation = {
      ...rawAllocation,
      data: [{
        année: rawAllocation.data[0].année,
        allocationRessoure: [{
          enveloppe: "",
          sousEnveloppe: "",
          modeDeDélégation: "",
          montantNotifié: "",
        }]
      }],
    }

    let entiteJuridiqueResult = getFullEntiteJuridique();
    const profile = getFullProfile();
    profile.budgetEtFinance.allocationDeRessources = "Ko";

    // When
    entiteJuridiqueResult = filterEntiteJuridique(entiteJuridiqueResult, profile);

    // Then
    expect(entiteJuridiqueResult.allocationRessource).toEqual(expectedAllocation);
  })

})

