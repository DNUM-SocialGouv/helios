import { ActivitesSanitaireMensuel } from "./métier/entities/ActivitesSanitaireMensuel";
import { AllocationRessource } from "./métier/entities/AllocationRessource";
import { EntiteJuridiqueDeRattachement } from "./métier/entities/entité-juridique/EntiteJuridiqueDeRattachement";
import { CatégorisationEnum } from "./métier/entities/entité-juridique/EntitéJuridique";
import { EntitéJuridiqueBudgetFinance } from "./métier/entities/entité-juridique/EntitéJuridiqueBudgetFinance";
import { EtablissementTerritorialSanitaireRH } from "./métier/entities/établissement-territorial-sanitaire/EtablissementTerritorialSanitaireRH";
import { ÉtablissementTerritorialSanitaire } from "./métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaire";
import { ÉtablissementTerritorialSanitaireActivité } from "./métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireActivité";
import { ÉtablissementTerritorialSanitaireAutorisationEtCapacité } from "./métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireAutorisation";
import { ÉtablissementTerritorialIdentité } from "./métier/entities/ÉtablissementTerritorialIdentité";
import { ÉtablissementTerritorialQualite } from "./métier/entities/ÉtablissementTerritorialQualite";
import { filterEtablissementSanitaire } from "./profileFiltersHelper";

function getIdentiteSanitaire(): ÉtablissementTerritorialIdentité & EntiteJuridiqueDeRattachement {
  return {
    adresseAcheminement: { 'dateMiseÀJourSource': 'dateMajAddressAcheminement', value: 'addresseAcheminement' },
    adresseNuméroVoie: { 'dateMiseÀJourSource': 'dateMajNumVoi', value: 'addresseNumVoie' },
    adresseTypeVoie: { 'dateMiseÀJourSource': 'dateMajTypeVoie', value: 'addresseTypeVoie' },
    adresseVoie: { 'dateMiseÀJourSource': 'dateMajAddrVoie', value: 'addressVoie' },
    catégorieÉtablissement: { 'dateMiseÀJourSource': 'dateMajCateg', value: 'catéEtab' },
    codeModeTarification: { 'dateMiseÀJourSource': 'dateMajCodeModeTarif', value: 'codeModeTarif' },
    courriel: { 'dateMiseÀJourSource': 'dateMajCourriel', value: 'courriel' },
    dateDEntréeEnVigueurDuCpom: { 'dateMiseÀJourSource': 'dateMajVigeurCpom', value: 'dateVigeurCpom' },
    libelléCatégorieÉtablissement: { 'dateMiseÀJourSource': 'dateMajLibCatégoEtab', value: 'LibCatégoEtab' },
    libelléModeTarification: { 'dateMiseÀJourSource': 'dateMajLibModeTarif', value: 'libModeTarif' },
    numéroFinessEntitéJuridique: { 'dateMiseÀJourSource': 'dateMajNumFinEntiJuri', value: 'numFinessEntitJurid' },
    numéroFinessÉtablissementPrincipal: { 'dateMiseÀJourSource': 'dateMajNumFinEtabPrinc', value: 'numFinessPrincipal' },
    numéroFinessÉtablissementTerritorial: { 'dateMiseÀJourSource': 'dateMajNumFinEtabTerr', value: 'numFinessTerrit' },
    raisonSociale: { 'dateMiseÀJourSource': 'dateMajRaisonSociale', value: 'raisonSociale' },
    raisonSocialeCourte: { 'dateMiseÀJourSource': 'dateMajRaisonSocialeCourte', value: 'raisonSocialeCourte' },
    siret: { 'dateMiseÀJourSource': 'dateMajSiret', value: 'siret' },
    typeÉtablissement: { 'dateMiseÀJourSource': 'dateMajTypeEtab', value: 'typeEtab' },
    téléphone: { 'dateMiseÀJourSource': 'dateMajTel', value: 'tel' },
    raisonSocialeDeLEntitéDeRattachement: { 'dateMiseÀJourSource': 'dateMajRaisonSocialeNetiRattach', value: 'raisonSocialeEntiRattach' },
    statutJuridique: { 'dateMiseÀJourSource': 'dateMajStatutJuri', value: 'statusJurid' },
    categorisationDeLEntitéDeRattachement: { 'dateMiseÀJourSource': 'dateMajCategoEntRattach', value: CatégorisationEnum.PUBLIC },
    codeRegion: "region",
    domaineÉtablissementPrincipal: "domaineEtabPrinc",
    dateOuverture: { 'dateMiseÀJourSource': 'dateMajOuverture', value: 'dateOuverture' },
  };
};

function getActiviteSanitaire(): ÉtablissementTerritorialSanitaireActivité {
  return {
    année: 2025,
    nombreDePassagesAuxUrgences: { dateMiseÀJourSource: "dateMajNbPassUrg", value: 1 },
    nombreJournéesCompletePsy: { dateMiseÀJourSource: "dateMajNbJourCompPsy", value: 2 },
    nombreJournéesCompletesSsr: { dateMiseÀJourSource: "dateMajNbJourCompSsr", value: 3 },
    nombreJournéesPartiellesPsy: { dateMiseÀJourSource: "dateMajNbJourPartPsy", value: 4 },
    nombreJournéesPartielsSsr: { dateMiseÀJourSource: "dateMajNbJourPartSsr", value: 5 },
    nombreSéjoursCompletsChirurgie: { dateMiseÀJourSource: "dateMajNbSejCompChir", value: 6 },
    nombreSéjoursCompletsMédecine: { dateMiseÀJourSource: "dateMajNbSejCompMed", value: 7 },
    nombreSéjoursCompletsObstétrique: { dateMiseÀJourSource: "dateMajNbSejCompObs", value: 8 },
    nombreSéjoursPartielsChirurgie: { dateMiseÀJourSource: "dateMajNbSejPartChir", value: 9 },
    nombreSéjoursPartielsMédecine: { dateMiseÀJourSource: "dateMajNbJourPartMed", value: 10 },
    nombreSéjoursPartielsObstétrique: { dateMiseÀJourSource: "dateMajNbSejPartObs", value: 11 },
    nombreJourneesUsld: { dateMiseÀJourSource: "dateMajNbJourUsld", value: 11 },
    numéroFinessÉtablissementTerritorial: "numFinessActiv",
  };
}

function getActiviteSanitaireMensuel(): ActivitesSanitaireMensuel {
  return {
    dateDeMiseAJour: "2025",
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
      nombreJournéesPartiellesPsy: 9,
      nombreJournéesComplètesPsy: 10,
      dmsChirurgie: 11,
      dmsMedecine: 12,
      dmsObstetrique: 13,

    }],
  };
}

function getAutorisationCapaciteSanitaire(): ÉtablissementTerritorialSanitaireAutorisationEtCapacité {
  return {
    numéroFinessÉtablissementTerritorial: "numFinAutCapSani",
    autorisations: { dateMiseÀJourSource: "dateMajAutor", activités: [{ libellé: "libAuto", code: "codeAuto", modalités: [] }] },
    autorisationsAmm: { dateMiseAJourSource: "dateMajAutor", activites: [] },
    autresActivités: { dateMiseÀJourSource: "dateMajAutreAct", activités: [{ libellé: "libAutreAct", code: "codeAutreAct", modalités: [] }] },
    capacités: [{ année: 2025, dateMiseÀJourSource: "dateMajCap", nombreDeLitsEnChirurgie: 1, nombreDeLitsEnMédecine: 2, nombreDeLitsEnObstétrique: 3, nombreDeLitsEnSsr: 4, nombreDeLitsEnUsld: 5, nombreDeLitsOuPlacesEnPsyHospitalisationComplète: 6, nombreDePlacesEnChirurgie: 7, nombreDePlacesEnMédecine: 8, nombreDePlacesEnObstétrique: 9, nombreDePlacesEnPsyHospitalisationPartielle: 10, nombreDePlacesEnSsr: 11 }],
    équipementsMatérielsLourds: { dateMiseÀJourSource: "dateMajEquipMatLour", équipements: [{ libellé: "libEquipLourd", code: "codeEquipLourd", autorisations: [] }] },
    reconnaissancesContractuelles: { dateMiseÀJourSource: "dateMajRecoContr", activités: [{ libellé: "libRecoContr", code: "codeRecoContr", modalités: [] }] },
  };
}

function getBudgetFinanceSanitaire(): EntitéJuridiqueBudgetFinance {
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

function getQualitéSanitaire(): ÉtablissementTerritorialQualite {
  return {
    reclamations: [
      {
        numéroFinessÉtablissementTerritorial: "finessReclamation",
        année: 2025,
        totalClotures: 1,
        totalEncours: 2,
        dateMiseÀJourSource: "dateMajeReclam",
        details: [{ motif: "motif", clot: 1, encours: 2 }]
      }
    ],
    evenementsIndesirables: [{ libelle: "libEvIndesi", evenementsEncours: ["envCours"], evenementsClotures: ["evClot"], dateMiseAJourSource: "dateMajDetail" }],
    inspectionsEtControles: { dateMiseAJourSource: "dateMajInspection", inspectionsEtControles: [] },
  }
}

function getRessourcesHumaines(): EtablissementTerritorialSanitaireRH[] {
  const ressourcesHumainesEtSan: EtablissementTerritorialSanitaireRH[] = [{
    annee: 2025,
    nombreEtpPm: { dateMiseAJourSource: "22/01/2025", valeur: 100 },
    nombreEtpPnm: { dateMiseAJourSource: "22/01/2025", valeur: 120 },
    depensesInterimPm: { dateMiseAJourSource: "22/01/2025", valeur: 230 },
    joursAbsenteismePm: { dateMiseAJourSource: "22/01/2025", valeur: 41 },
    joursAbsenteismePnm: { dateMiseAJourSource: "23/01/2025", valeur: 3900 },
  }];
  return ressourcesHumainesEtSan;
}

function getFullSanitaire(): ÉtablissementTerritorialSanitaire {
  return {
    activités: [getActiviteSanitaire()],
    activitésMensuels: getActiviteSanitaireMensuel(),
    autorisationsEtCapacités: getAutorisationCapaciteSanitaire(),
    qualite: getQualitéSanitaire(),
    identité: getIdentiteSanitaire(),
    budgetFinance: [getBudgetFinanceSanitaire()],
    allocationRessource: getAllocationRessource(),
    appartientAEtablissementsSantePrivesIntérêtsCollectif: true,
    autorisations: "autorisations",
    ressourcesHumaines: getRessourcesHumaines()
  }
}

function getIdentityProfile() {
  return {
    adresse: 'ok',
    catégorieÉtablissement: 'ok',
    modeTarification: 'ok',
    télEtEmail: 'ok',
    dateDEntréeEnVigueurDuCpom: 'ok',
    EJ_rattachement: 'ok',
    ET_principal_secondaire: 'ok',
    numéroFiness: 'ok',
    nom: 'ok',
    siret: 'ok',
    statut_EJ: 'ok',
  };
};

function getActiviteProfile() {
  return {
    nombrePassage: "ok",
    nombreJournées: "ok",
    nombreSéjours: "ok",
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

function getRessourcesHumainesProfile() {
  return {
    nombreEtpPm: "ok",
    nombreEtpPnm: "ok",
    depensesInterimPm: "ok",
    joursAbsenteismePm: "ok",
    joursAbsenteismePnm: "ok"
  }
}

function getQualiteProfile() {
  return {
    DonnéesSirec: "ok",
    DonnéesSivss: "ok",
    DonnéesSiicea: "ok",
  }
}

function getFullProfile() {
  return {
    identité: getIdentityProfile(),
    activités: getActiviteProfile(),
    autorisationsEtCapacités: getAutorisationCapaciteProfile(),
    budgetEtFinance: getBudgetFinanceProfile(),
    ressourcesHumaines: getRessourcesHumainesProfile(),
    Qualité: getQualiteProfile(),
  }
}

describe("Filtre des informations d’identité des etablissement medico-sociaux par rapport au profil", () => {
  it("laisse toutes les informations si il y a les droits", () => {
    // Given
    const rawIdentity = getIdentiteSanitaire();
    let etabSanitaireResult = getFullSanitaire();
    const profile = getFullProfile();

    // When
    etabSanitaireResult = filterEtablissementSanitaire(etabSanitaireResult, profile);

    // Then
    expect(etabSanitaireResult.identité).toEqual(rawIdentity);
  });

  it("retire l’adresse si il n’y a pas les droits", () => {
    // Given
    const rawIdentity = getIdentiteSanitaire();
    const expectedIdentity = {
      ...rawIdentity,
      adresseAcheminement: { 'dateMiseÀJourSource': '', value: '' },
      adresseNuméroVoie: { 'dateMiseÀJourSource': '', value: '' },
      adresseTypeVoie: { 'dateMiseÀJourSource': '', value: '' },
      adresseVoie: { 'dateMiseÀJourSource': '', value: '' },
    }

    let etabSanitaireResult = getFullSanitaire();
    const profile = getFullProfile();
    profile.identité.adresse = "Ko";

    // When
    etabSanitaireResult = filterEtablissementSanitaire(etabSanitaireResult, profile);

    // Then
    expect(etabSanitaireResult.identité).toEqual(expectedIdentity);
  });

  it("retire les info de catégorie si il n’y a pas les droits", () => {
    // Given
    const rawIdentity = getIdentiteSanitaire();
    const expectedIdentity = {
      ...rawIdentity,
      catégorieÉtablissement: { 'dateMiseÀJourSource': '', value: '' },
      libelléCatégorieÉtablissement: { 'dateMiseÀJourSource': '', value: '' },
    }

    let etabSanitaireResult = getFullSanitaire();
    const profile = getFullProfile();
    profile.identité.catégorieÉtablissement = "Ko";

    // When
    etabSanitaireResult = filterEtablissementSanitaire(etabSanitaireResult, profile);

    // Then
    expect(etabSanitaireResult.identité).toEqual(expectedIdentity);
  });

  it("retire les info de mode de tarification si il n’y a pas les droits", () => {
    // Given
    const rawIdentity = getIdentiteSanitaire();
    const expectedIdentity = {
      ...rawIdentity,
      codeModeTarification: "",
      libelléModeTarification: { 'dateMiseÀJourSource': '', value: '' },
    }

    let etabSanitaireResult = getFullSanitaire();
    const profile = getFullProfile();
    profile.identité.modeTarification = "Ko";

    // When
    etabSanitaireResult = filterEtablissementSanitaire(etabSanitaireResult, profile);

    // Then
    expect(etabSanitaireResult.identité).toEqual(expectedIdentity);
  });

  it("retire les info de contact si il n’y a pas les droits", () => {
    // Given
    const rawIdentity = getIdentiteSanitaire();
    const expectedIdentity = {
      ...rawIdentity,
      courriel: { 'dateMiseÀJourSource': '', value: '' },
      téléphone: { 'dateMiseÀJourSource': '', value: '' },
      dateOuverture: { 'dateMiseÀJourSource': '', value: '' },
    }

    let etabSanitaireResult = getFullSanitaire();
    const profile = getFullProfile();
    profile.identité.télEtEmail = "Ko";

    // When
    etabSanitaireResult = filterEtablissementSanitaire(etabSanitaireResult, profile);

    // Then
    expect(etabSanitaireResult.identité).toEqual(expectedIdentity);
  });

  it("retire les info d’entree en vigueur du CPOM si il n’y a pas les droits", () => {
    // Given
    const rawIdentity = getIdentiteSanitaire();
    const expectedIdentity = {
      ...rawIdentity,
      dateDEntréeEnVigueurDuCpom: { 'dateMiseÀJourSource': '', value: '' },
    }

    let etabSanitaireResult = getFullSanitaire();
    const profile = getFullProfile();
    profile.identité.dateDEntréeEnVigueurDuCpom = "Ko";

    // When
    etabSanitaireResult = filterEtablissementSanitaire(etabSanitaireResult, profile);

    // Then
    expect(etabSanitaireResult.identité).toEqual(expectedIdentity);
  });

  it("retire les info de l’etablissement de rattachement si il n’y a pas les droits", () => {
    // Given
    const rawIdentity = getIdentiteSanitaire();
    const expectedIdentity = {
      ...rawIdentity,
      numéroFinessEntitéJuridique: { 'dateMiseÀJourSource': '', value: '' },
      raisonSocialeDeLEntitéDeRattachement: { 'dateMiseÀJourSource': '', value: '' },
    }

    let etabSanitaireResult = getFullSanitaire();
    const profile = getFullProfile();
    profile.identité.EJ_rattachement = "Ko";

    // When
    etabSanitaireResult = filterEtablissementSanitaire(etabSanitaireResult, profile);

    // Then
    expect(etabSanitaireResult.identité).toEqual(expectedIdentity);
  });

  it("retire les info de l’etablissement principale secondaire si il n’y a pas les droits", () => {
    // Given
    const rawIdentity = getIdentiteSanitaire();
    const expectedIdentity = {
      ...rawIdentity,
      numéroFinessÉtablissementPrincipal: { 'dateMiseÀJourSource': '', value: '' },
      typeÉtablissement: { 'dateMiseÀJourSource': '', value: '' },
    }

    let etabSanitaireResult = getFullSanitaire();
    const profile = getFullProfile();
    profile.identité.ET_principal_secondaire = "Ko";

    // When
    etabSanitaireResult = filterEtablissementSanitaire(etabSanitaireResult, profile);

    // Then
    expect(etabSanitaireResult.identité).toEqual(expectedIdentity);
  });

  it("retire les info du numéro finess si il n’y a pas les droits", () => {
    // Given
    const rawIdentity = getIdentiteSanitaire();
    const expectedIdentity = {
      ...rawIdentity,
      numéroFinessÉtablissementTerritorial: { 'dateMiseÀJourSource': '', value: '' },
    }

    let etabSanitaireResult = getFullSanitaire();
    const profile = getFullProfile();
    profile.identité.numéroFiness = "Ko";

    // When
    etabSanitaireResult = filterEtablissementSanitaire(etabSanitaireResult, profile);

    // Then
    expect(etabSanitaireResult.identité).toEqual(expectedIdentity);
  });

  it("retire les info de raison sociale si il n’y a pas les droits", () => {
    // Given
    const rawIdentity = getIdentiteSanitaire();
    const expectedIdentity = {
      ...rawIdentity,
      raisonSociale: { 'dateMiseÀJourSource': '', value: '' },
      raisonSocialeCourte: { 'dateMiseÀJourSource': '', value: '' },

    }

    let etabSanitaireResult = getFullSanitaire();
    const profile = getFullProfile();
    profile.identité.nom = "Ko";

    // When
    etabSanitaireResult = filterEtablissementSanitaire(etabSanitaireResult, profile);

    // Then
    expect(etabSanitaireResult.identité).toEqual(expectedIdentity);
  });

  it("retire les info de siret si il n’y a pas les droits", () => {
    // Given
    const rawIdentity = getIdentiteSanitaire();
    const expectedIdentity = {
      ...rawIdentity,
      siret: { 'dateMiseÀJourSource': '', value: '' },
    }

    let etabSanitaireResult = getFullSanitaire();
    const profile = getFullProfile();
    profile.identité.siret = "Ko";

    // When
    etabSanitaireResult = filterEtablissementSanitaire(etabSanitaireResult, profile);

    // Then
    expect(etabSanitaireResult.identité).toEqual(expectedIdentity);
  });

  it("retire les info de statut de l’etablissement juridique de rattachement si il n’y a pas les droits", () => {
    // Given
    const rawIdentity = getIdentiteSanitaire();
    const expectedIdentity = {
      ...rawIdentity,
      statutJuridique: { 'dateMiseÀJourSource': '', value: '' },
      categorisationDeLEntitéDeRattachement: { 'dateMiseÀJourSource': '', value: '' },

    }

    let etabSanitaireResult = getFullSanitaire();
    const profile = getFullProfile();
    profile.identité.statut_EJ = "Ko";

    // When
    etabSanitaireResult = filterEtablissementSanitaire(etabSanitaireResult, profile);

    // Then
    expect(etabSanitaireResult.identité).toEqual(expectedIdentity);
  });

});

describe("Filtre des informations d’activité des etablissement medico-sociaux par rapport au profil", () => {
  it("laisse toutes les informations si il y a tous les droits", () => {
    // Given
    const rawActivity = getActiviteSanitaire();

    let etabSanitaireResult = getFullSanitaire();
    const profile = getFullProfile();

    // When
    etabSanitaireResult = filterEtablissementSanitaire(etabSanitaireResult, profile);

    // Then
    expect(etabSanitaireResult.activités).toEqual([rawActivity]);
  });

  it("retire les info du nombre de passage aux urgence si il n’y a pas les droits", () => {
    // Given
    const rawActivity = getActiviteSanitaire();
    const expectedActivity = {
      ...rawActivity,
      nombreDePassagesAuxUrgences: { dateMiseÀJourSource: "", value: "" },
    }

    let etabSanitaireResult = getFullSanitaire();
    const profile = getFullProfile();
    profile.activités.nombrePassage = "Ko";

    // When
    etabSanitaireResult = filterEtablissementSanitaire(etabSanitaireResult, profile);

    // Then
    expect(etabSanitaireResult.activités).toEqual([expectedActivity]);
  });

  it("retire les info sur le nombre de journées si il n’y a pas les droits", () => {
    // Given
    const rawActivity = getActiviteSanitaire();
    const expectedActivity = {
      ...rawActivity,
      nombreJournéesCompletePsy: { dateMiseÀJourSource: "", value: "" },
      nombreJournéesCompletesSsr: { dateMiseÀJourSource: "", value: "" },
      nombreJournéesPartiellesPsy: { dateMiseÀJourSource: "", value: "" },
      nombreJournéesPartielsSsr: { dateMiseÀJourSource: "", value: "" },
    }

    let etabMedicoSocialResult = getFullSanitaire();
    const profile = getFullProfile();
    profile.activités.nombreJournées = "Ko";

    // When
    etabMedicoSocialResult = filterEtablissementSanitaire(etabMedicoSocialResult, profile);

    // Then
    expect(etabMedicoSocialResult.activités).toEqual([expectedActivity]);
  });

  it("retire les info sur le nombre de sejour si il n’y a pas les droits", () => {
    // Given
    const rawActivity = getActiviteSanitaire();
    const expectedActivity = {
      ...rawActivity,
      nombreSéjoursCompletsChirurgie: { dateMiseÀJourSource: "", value: "" },
      nombreSéjoursCompletsMédecine: { dateMiseÀJourSource: "", value: "" },
      nombreSéjoursCompletsObstétrique: { dateMiseÀJourSource: "", value: "" },
      nombreSéjoursPartielsChirurgie: { dateMiseÀJourSource: "", value: "" },
      nombreSéjoursPartielsMédecine: { dateMiseÀJourSource: "", value: "" },
      nombreSéjoursPartielsObstétrique: { dateMiseÀJourSource: "", value: "" },
    }

    let etabMedicoSocialResult = getFullSanitaire();
    const profile = getFullProfile();
    profile.activités.nombreSéjours = "Ko";

    // When
    etabMedicoSocialResult = filterEtablissementSanitaire(etabMedicoSocialResult, profile);

    // Then
    expect(etabMedicoSocialResult.activités).toEqual([expectedActivity]);
  });

  it("retire les info sur le nombre de sejour USLD s’il n’y a pas les droits", () => {
    // Given
    const rawActivity = getActiviteSanitaire();
    const expectedActivity = {
      ...rawActivity,
      nombreJourneesUsld: { dateMiseÀJourSource: "", value: "" },
    }

    let etabMedicoSocialResult = getFullSanitaire();
    const profile = getFullProfile();
    profile.activités.nombreJourneesUsld = "Ko";

    // When
    etabMedicoSocialResult = filterEtablissementSanitaire(etabMedicoSocialResult, profile);

    // Then
    expect(etabMedicoSocialResult.activités).toEqual([expectedActivity]);
  });

})

describe("Filtre des informations d’autorisation des etablissement medico-sociaux par rapport au profil", () => {
  it("laisse toutes les informations si il y a tous les droits", () => {
    // Given
    const rawAutorisationCapacity = getAutorisationCapaciteSanitaire();

    let etabSanitaireResult = getFullSanitaire();
    const profile = getFullProfile();

    // When
    etabSanitaireResult = filterEtablissementSanitaire(etabSanitaireResult, profile);

    // Then
    expect(etabSanitaireResult.autorisationsEtCapacités).toEqual(rawAutorisationCapacity);
  });

  it("retire les info d’autorisation si il n’y a pas les droits", () => {
    // Given
    const rawAutorisationCapacity = getAutorisationCapaciteSanitaire();
    const expectedAutorisationCapacity = {
      ...rawAutorisationCapacity,
      autorisations: { dateMiseÀJourSource: "", activités: [] },
      autorisationsAmm: { dateMiseÀJourSource: "", activités: [] },
    }

    let etabSanitaireResult = getFullSanitaire();
    const profile = getFullProfile();
    profile.autorisationsEtCapacités.autorisationsActivités = "Ko";

    // When
    etabSanitaireResult = filterEtablissementSanitaire(etabSanitaireResult, profile);

    // Then
    expect(etabSanitaireResult.autorisationsEtCapacités).toEqual(expectedAutorisationCapacity);
  });

  it("retire les info sur les autres activités si il n’y a pas les droits", () => {
    // Given
    const rawAutorisationCapacity = getAutorisationCapaciteSanitaire();
    const expectedAutorisationCapacity = {
      ...rawAutorisationCapacity,
      autresActivités: { dateMiseÀJourSource: "", activités: [] },
    }

    let etabSanitaireResult = getFullSanitaire();
    const profile = getFullProfile();
    profile.autorisationsEtCapacités.autresActivités = "Ko";

    // When
    etabSanitaireResult = filterEtablissementSanitaire(etabSanitaireResult, profile);

    // Then
    expect(etabSanitaireResult.autorisationsEtCapacités).toEqual(expectedAutorisationCapacity);
  });

  it("retire les info sur reconnaissance contractuelle si il n’y a pas les droits", () => {
    // Given
    const rawAutorisationCapacity = getAutorisationCapaciteSanitaire();
    const expectedAutorisationCapacity = {
      ...rawAutorisationCapacity,
      reconnaissancesContractuelles: { dateMiseÀJourSource: "", activités: [] },
    }

    let etabSanitaireResult = getFullSanitaire();
    const profile = getFullProfile();
    profile.autorisationsEtCapacités.reconnaissanceContractuelleActivités = "Ko";

    // When
    etabSanitaireResult = filterEtablissementSanitaire(etabSanitaireResult, profile);

    // Then
    expect(etabSanitaireResult.autorisationsEtCapacités).toEqual(expectedAutorisationCapacity);
  });

  it("retire les info sur les equipement materiel lourd si il n’y a pas les droits", () => {
    // Given
    const rawAutorisationCapacity = getAutorisationCapaciteSanitaire();
    const expectedAutorisationCapacity = {
      ...rawAutorisationCapacity,
      équipementsMatérielsLourds: { dateMiseÀJourSource: "", équipements: [] },
    }

    let etabSanitaireResult = getFullSanitaire();
    const profile = getFullProfile();
    profile.autorisationsEtCapacités.equipementMaterielLourdsActivités = "Ko";

    // When
    etabSanitaireResult = filterEtablissementSanitaire(etabSanitaireResult, profile);

    // Then
    expect(etabSanitaireResult.autorisationsEtCapacités).toEqual(expectedAutorisationCapacity);
  });

  it("retire les info sur les capacités si il n’y a pas les droits", () => {
    // Given
    const rawAutorisationCapacity = getAutorisationCapaciteSanitaire();
    const expectedAutorisationCapacity = {
      ...rawAutorisationCapacity,
      capacités: [{ dateMiseÀJourSource: "" }],
    }

    let etabSanitaireResult = getFullSanitaire();
    const profile = getFullProfile();
    profile.autorisationsEtCapacités.capacités = "Ko";

    // When
    etabSanitaireResult = filterEtablissementSanitaire(etabSanitaireResult, profile);

    // Then
    expect(etabSanitaireResult.autorisationsEtCapacités).toEqual(expectedAutorisationCapacity);
  });
});

describe("Filtre les informations de budget et finance des etablissement juridique par rapport au profil", () => {
  it("laisse toutes les informations si il y a tous les droits", () => {
    // Given
    const rawBudgetAndFinance = getBudgetFinanceSanitaire();

    let etabSanitaireResult = getFullSanitaire();
    const profile = getFullProfile();

    // When
    etabSanitaireResult = filterEtablissementSanitaire(etabSanitaireResult, profile);

    // Then
    expect(etabSanitaireResult.budgetFinance).toEqual([rawBudgetAndFinance]);
  });

  it("retire les info de resultat de compte si il n’y a pas les droits", () => {
    // Given
    const rawBudgetAndFinance = getBudgetFinanceSanitaire();
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

    let etabSanitaireResult = getFullSanitaire();
    const profile = getFullProfile();
    profile.budgetEtFinance.compteRésultats = "Ko";

    // When
    etabSanitaireResult = filterEtablissementSanitaire(etabSanitaireResult, profile);

    // Then
    expect(etabSanitaireResult.budgetFinance).toEqual([expectedBudgetAndFinance]);
  })

  it("retire les info de resultat net comptable si il n’y a pas les droits", () => {
    // Given
    const rawBudgetAndFinance = getBudgetFinanceSanitaire();
    const expectedBudgetAndFinance = {
      ...rawBudgetAndFinance,
      resultatNetComptable: "",
    }

    let etabSanitaireResult = getFullSanitaire();
    const profile = getFullProfile();
    profile.budgetEtFinance.résultatNetComptable = "Ko";

    // When
    etabSanitaireResult = filterEtablissementSanitaire(etabSanitaireResult, profile);

    // Then
    expect(etabSanitaireResult.budgetFinance).toEqual([expectedBudgetAndFinance]);
  })

  it("retire les info de ratio de dependance financière si il n’y a pas les droits", () => {
    // Given
    const rawBudgetAndFinance = getBudgetFinanceSanitaire();
    const expectedBudgetAndFinance = {
      ...rawBudgetAndFinance,
      ratioDependanceFinanciere: "",
    }

    let etabSanitaireResult = getFullSanitaire();
    const profile = getFullProfile();
    profile.budgetEtFinance.ratioDépendanceFinancière = "Ko";

    // When
    etabSanitaireResult = filterEtablissementSanitaire(etabSanitaireResult, profile);

    // Then
    expect(etabSanitaireResult.budgetFinance).toEqual([expectedBudgetAndFinance]);
  })

  it("retire les info de taux de caf nette si il n’y a pas les droits", () => {
    // Given
    const rawBudgetAndFinance = getBudgetFinanceSanitaire();
    const expectedBudgetAndFinance = {
      ...rawBudgetAndFinance,
      tauxDeCafNetSan: "",
    }

    let etabSanitaireResult = getFullSanitaire();
    const profile = getFullProfile();
    profile.budgetEtFinance.tauxDeCafNette = "Ko";

    // When
    etabSanitaireResult = filterEtablissementSanitaire(etabSanitaireResult, profile);

    // Then
    expect(etabSanitaireResult.budgetFinance).toEqual([expectedBudgetAndFinance]);
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

    let etabSanitaireResult = getFullSanitaire();
    const profile = getFullProfile();
    profile.budgetEtFinance.allocationDeRessources = "Ko";

    // When
    etabSanitaireResult = filterEtablissementSanitaire(etabSanitaireResult, profile);

    // Then
    expect(etabSanitaireResult.allocationRessource).toEqual(expectedAllocation);
  })

})

describe("Filtre les informations qualite des etablissement medico-sociaux par rapport au profil", () => {
  it("laisse toutes les informations si il y a tous les droits", () => {
    // Given
    const rawQuality = getQualitéSanitaire();

    let etabMedicoSocialResult = getFullSanitaire();
    const profile = getFullProfile();

    // When
    etabMedicoSocialResult = filterEtablissementSanitaire(etabMedicoSocialResult, profile);

    // Then
    expect(etabMedicoSocialResult.qualite).toEqual(rawQuality);
  });

  it("retire les info des donnee de reclamation si n’y a pas les droits", () => {
    // Given
    const rawQuality = getQualitéSanitaire();
    const expectedQuality = {
      ...rawQuality,
      reclamations: [{ details: [] }],
    }

    let etabMedicoSocialResult = getFullSanitaire();
    const profile = getFullProfile();
    profile.Qualité.DonnéesSirec = "Ko";

    // When
    etabMedicoSocialResult = filterEtablissementSanitaire(etabMedicoSocialResult, profile);

    // Then
    expect(etabMedicoSocialResult.qualite).toEqual(expectedQuality);
  })

  it("retire les info d’evenement indesirable si n’y a pas les droits", () => {
    // Given
    const rawQuality = getQualitéSanitaire();
    const expectedQuality = {
      ...rawQuality,
      evenementsIndesirables: [],
    }

    let etabMedicoSocialResult = getFullSanitaire();
    const profile = getFullProfile();
    profile.Qualité.DonnéesSivss = "Ko";

    // When
    etabMedicoSocialResult = filterEtablissementSanitaire(etabMedicoSocialResult, profile);

    // Then
    expect(etabMedicoSocialResult.qualite).toEqual(expectedQuality);
  })

  it("retire les info d’inspection et controle si n’y a pas les droits", () => {
    // Given
    const rawQuality = getQualitéSanitaire();
    const expectedQuality = {
      ...rawQuality,
      inspectionsEtControles: { dateMiseAJourSource: "", inspectionsEtControles: [] },
    }

    let etabMedicoSocialResult = getFullSanitaire();
    const profile = getFullProfile();
    profile.Qualité.DonnéesSiicea = "Ko";

    // When
    etabMedicoSocialResult = filterEtablissementSanitaire(etabMedicoSocialResult, profile);

    // Then
    expect(etabMedicoSocialResult.qualite).toEqual(expectedQuality);
  })
})

describe("Filtre des informations de ressources humaines des établissements sanitaires selon le profil", () => {
  it("retire les informations de nombre d'ETP PM si il n’y a pas les droits", () => {
    // Given
    const rawEntity = getFullSanitaire();
    const expectedIdentity = { ...rawEntity };
    expectedIdentity.ressourcesHumaines[0].nombreEtpPm.valeur = "";

    let etablissementSanitaire = getFullSanitaire();
    const profile = getFullProfile();
    profile.ressourcesHumaines.nombreEtpPm = "Ko";

    // When
    etablissementSanitaire = filterEtablissementSanitaire(etablissementSanitaire, profile);

    // Then
    expect(etablissementSanitaire.ressourcesHumaines).toEqual(expectedIdentity.ressourcesHumaines);
  });

  it("retire les informations de nombre d'ETP PNM si il n’y a pas les droits", () => {
    // Given
    const rawEntity = getFullSanitaire();
    const expectedIdentity = { ...rawEntity };
    expectedIdentity.ressourcesHumaines[0].nombreEtpPnm.valeur = "";

    let etablissementSanitaire = getFullSanitaire();
    const profile = getFullProfile();
    profile.ressourcesHumaines.nombreEtpPnm = "Ko";

    // When
    etablissementSanitaire = filterEtablissementSanitaire(etablissementSanitaire, profile);

    // Then
    expect(etablissementSanitaire.ressourcesHumaines).toEqual(expectedIdentity.ressourcesHumaines);
  });

  it("retire les informations de jours d'absenteisme PM si il n’y a pas les droits", () => {
    // Given
    const rawEntity = getFullSanitaire();
    const expectedIdentity = { ...rawEntity };
    expectedIdentity.ressourcesHumaines[0].joursAbsenteismePm.valeur = "";

    let etablissementSanitaire = getFullSanitaire();
    const profile = getFullProfile();
    profile.ressourcesHumaines.joursAbsenteismePm = "Ko";

    // When
    etablissementSanitaire = filterEtablissementSanitaire(etablissementSanitaire, profile);

    // Then
    expect(etablissementSanitaire.ressourcesHumaines).toEqual(expectedIdentity.ressourcesHumaines);
  });

  it("retire les informations de jours d'absenteisme PNM si il n’y a pas les droits", () => {
    // Given
    const rawEntity = getFullSanitaire();
    const expectedIdentity = { ...rawEntity };
    expectedIdentity.ressourcesHumaines[0].joursAbsenteismePnm.valeur = "";

    let etablissementSanitaire = getFullSanitaire();
    const profile = getFullProfile();
    profile.ressourcesHumaines.joursAbsenteismePnm = "Ko";

    // When
    etablissementSanitaire = filterEtablissementSanitaire(etablissementSanitaire, profile);

    // Then
    expect(etablissementSanitaire.ressourcesHumaines).toEqual(expectedIdentity.ressourcesHumaines);
  });


  it("retire les informations de depenses interim si il n’y a pas les droits", () => {
    // Given
    const rawEntity = getFullSanitaire();
    const expectedIdentity = { ...rawEntity };
    expectedIdentity.ressourcesHumaines[0].depensesInterimPm.valeur = "";

    let etablissementSanitaire = getFullSanitaire();
    const profile = getFullProfile();
    profile.ressourcesHumaines.depensesInterimPm = "Ko";

    // When
    etablissementSanitaire = filterEtablissementSanitaire(etablissementSanitaire, profile);

    // Then
    expect(etablissementSanitaire.ressourcesHumaines).toEqual(expectedIdentity.ressourcesHumaines);
  });

})
