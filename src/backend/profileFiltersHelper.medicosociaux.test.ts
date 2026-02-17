import { EntiteJuridiqueDeRattachement } from "./métier/entities/entité-juridique/EntiteJuridiqueDeRattachement";
import { CatégorisationEnum } from "./métier/entities/entité-juridique/EntitéJuridique";
import { MonoÉtablissement } from "./métier/entities/établissement-territorial-médico-social/MonoÉtablissement";
import { ÉtablissementTerritorialMédicoSocialActivité } from "./métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialActivité";
import { ÉtablissementTerritorialMédicoSocialAutorisationEtCapacité } from "./métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialAutorisation";
import { ÉtablissementTerritorialMédicoSocialBudgetEtFinances } from "./métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialBudgetEtFinances";
import { ÉtablissementTerritorialMédicoSocialRessourcesHumaines } from "./métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialRessourcesHumaines";
import { ÉtablissementTerritorialIdentité } from "./métier/entities/ÉtablissementTerritorialIdentité";
import { ÉtablissementTerritorialQualite } from "./métier/entities/ÉtablissementTerritorialQualite";
import { filterEtablissementMedicoSocial } from "./profileFiltersHelper";

function getIdentiteMedicoSocial(): ÉtablissementTerritorialIdentité & MonoÉtablissement & EntiteJuridiqueDeRattachement {
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
    estMonoÉtablissement: { 'dateMiseÀJourSource': 'dateMajMonoEtab', value: true },
    codeRegion: "region",
    domaineÉtablissementPrincipal: "domaineEtabPrinc",
    dateOuverture: { 'dateMiseÀJourSource': 'dateMajOuverture', value: 'dateOuverture' },
  };
};

function getActiviteMedicoSocial(): ÉtablissementTerritorialMédicoSocialActivité {
  return {
    année: 2025,
    duréeMoyenneSéjourAccompagnementPersonnesSorties: {
      dateMiseÀJourSource: "dateMajDurrMoySejAccPerSor",
      value: 1,
    },
    fileActivePersonnesAccompagnées: {
      dateMiseÀJourSource: "dateMajFileActiPersAcc",
      value: 2,
    },
    nombreMoyenJournéesAbsencePersonnesAccompagnées: {
      dateMiseÀJourSource: "dateMajNbMoyJourAbsPersAcc",
      value: 3,
    },
    numéroFinessÉtablissementTerritorial: "finess",
    tauxOccupationAccueilDeJour: {
      dateMiseÀJourSource: "dateMajOccuAccJour",
      value: 4,
    },
    tauxOccupationHébergementPermanent: {
      dateMiseÀJourSource: "dateMajOccuHeberPerm",
      value: 5,
    },
    tauxOccupationHébergementTemporaire: {
      dateMiseÀJourSource: "dateMajOccuHeberTemp",
      value: 6,
    },
    tauxRéalisationActivité: {
      dateMiseÀJourSource: "dateRealActiv",
      value: 7,
    },
    tauxOccupationExternat: {
      value: 8,
    },
    tauxOccupationSemiInternat: {
      value: 9,
    },
    tauxOccupationInternat: {
      value: 10,
    },
    tauxOccupationAutre: {
      value: 11,
    },
    tauxOccupationSeances: {
      value: 12,
    },
    tauxOccupationGlobal: {
      dateMiseÀJourSource: "dateMajOccuGlobal",
      value: 13,
    }
  };
}

function getAutorisationCapaciteMedicoSocial(): ÉtablissementTerritorialMédicoSocialAutorisationEtCapacité {
  return {
    autorisations: { dateMiseÀJourSource: "dateMajAutorisation", disciplines: [{ libellé: "autorisations", code: "codeAutorisation", activités: [] }] },
    capacités: { dateMiseÀJourSource: "dateMajCapacite", capacitéParActivité: [{ libellé: "capacité", capacité: 2 }] },
    numéroFinessÉtablissementTerritorial: "finesAutorisation",

  }
}

function getBudgetFinanceMedicoSocial(): ÉtablissementTerritorialMédicoSocialBudgetEtFinances {
  return {
    année: 2025,
    cadreBudgétaire: "cadreBudgétaire",
    chargesEtProduits: { dateMiseÀJourSource: "dateMajChangeProd", charges: 1, produits: 1 },
    recettesEtDépenses: { dateMiseÀJourSource: "dateMajRecetteDep", dépensesGroupe1: 2, dépensesGroupe2: 2, dépensesGroupe3: 2, recettesGroupe1: 2, recettesGroupe2: 2, recettesGroupe3: 2 },
    contributionAuxFraisDeSiège: { dateMiseÀJourSource: "dateMajContribFraiSiege", valeur: 3 },
    fondsDeRoulement: { dateMiseÀJourSource: "dateMajFondRoule", valeur: 4 },
    résultatNetComptable: { dateMiseÀJourSource: "dateMajResultNetComp", valeur: 5 },
    tauxDeCafNette: { dateMiseÀJourSource: "dateMajTauxCafNet", valeur: 6 },
    tauxDeVétustéConstruction: { dateMiseÀJourSource: "dateMajTauxVetusConstr", valeur: 7 },

  }
}

function getRessourcesHumainesMedicoSocial(): ÉtablissementTerritorialMédicoSocialRessourcesHumaines {
  return {
    année: 2025,
    nombreDEtpRéalisés: { dateMiseÀJourSource: "dateMajNbEtpReal", valeur: 1 },
    nombreDeCddDeRemplacement: { dateMiseÀJourSource: "dateMajNbCddRemp", valeur: 2 },
    tauxDAbsentéisme: { dateMiseÀJourSource: "dateMajAbs", horsFormation: 1, pourAccidentMaladieProfessionnelle: 1, pourCongésSpéciaux: 1, pourMaladieCourteDurée: 1, pourMaladieMoyenneDurée: 1, pourMaladieLongueDurée: 1, pourMaternitéPaternité: 1 },
    tauxDEtpVacants: { dateMiseÀJourSource: "dateMajEtpVacan", valeur: 3 },
    tauxDePrestationsExternes: { dateMiseÀJourSource: "dateMajPrestaExt", valeur: 4 },
    tauxDeRotationDuPersonnel: { dateMiseÀJourSource: "dateMajRotaPerso", valeur: 5 },
  }
}

function getQualitéMedicoSocial(): ÉtablissementTerritorialQualite {
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

function getFullMedicoSocial() {
  return {
    identité: getIdentiteMedicoSocial(),
    activités: [getActiviteMedicoSocial()],
    autorisationsEtCapacités: getAutorisationCapaciteMedicoSocial(),
    budgetEtFinances: [getBudgetFinanceMedicoSocial()],
    ressourcesHumaines: [getRessourcesHumainesMedicoSocial()],
    qualite: getQualitéMedicoSocial(),
  }
}

function getIdentityProfile() {
  return {
    adresse: 'ok',
    dateDEntréeEnVigueurDuCpom: 'ok',
    catégorieÉtablissement: 'ok',
    modeTarification: 'ok',
    numéroFiness: 'ok',
    nom: 'ok',
    siret: 'ok',
    ET_principal_secondaire: 'ok',
    EJ_rattachement: 'ok',
    statut_EJ: 'ok',
    mono_établissement: 'ok',
    télEtEmail: 'ok',
  };
};

function getActiviteProfile() {
  return {
    duréeMoyenneSéjourAccompagnementPersonnesSorties: "ok",
    fileActivePersonnesAccompagnées: "ok",
    nombreMoyenJournéesAbsencePersonnesAccompagnées: "ok",
    tauxOccupationAccueilDeJour: "ok",
    tauxOccupationHébergementPermanent: "ok",
    tauxOccupationHébergementTemporaire: "ok",
    tauxRéalisationActivité: "ok",
    tauxOccupationExternat: "ok",
    tauxOccupationSemiInternat: "ok",
    tauxOccupationInternat: "ok",
    tauxOccupationAutre: "ok",
    tauxOccupationSeances: "ok",
    tauxOccupationGlobal: "ok",
  }
}

function getAutorisationCapaciteProfile() {
  return {
    autorisations: "ok",
    capacités: "ok",
  }
}

function getBudgetFinanceProfile() {
  return {
    compteRésultats: "ok",
    contributionAuxFraisDeSiège: "ok",
    fondsDeRoulement: "ok",
    résultatNetComptable: "ok",
    tauxDeCafNette: "ok",
    tauxDeVétustéConstruction: "ok",
  }
}

function getRessourcesHumainesProfile() {
  return {
    nombreDEtpRéalisés: "ok",
    nombreDeCddDeRemplacement: "ok",
    tauxDAbsentéisme: "ok",
    tauxDEtpVacants: "ok",
    tauxDePrestationsExternes: "ok",
    tauxDeRotationDuPersonnel: "ok",
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
    budgetEtFinances: getBudgetFinanceProfile(),
    ressourcesHumaines: getRessourcesHumainesProfile(),
    Qualité: getQualiteProfile(),
  }
}

describe("Filtre des informations d’identité des etablissement medico-sociaux par rapport au profil", () => {
  it("laisse toutes les informations si il y a les droits", () => {
    // Given
    const rawIdentity = getIdentiteMedicoSocial();
    let etabMedicoSocialResult = getFullMedicoSocial();
    const profile = getFullProfile();

    // When
    etabMedicoSocialResult = filterEtablissementMedicoSocial(etabMedicoSocialResult, profile);

    // Then
    expect(etabMedicoSocialResult.identité).toEqual(rawIdentity);
  });

  it("retire l’adresse si il n’y a pas les droits", () => {
    // Given
    const rawIdentity = getIdentiteMedicoSocial();
    const expectedIdentity = {
      ...rawIdentity,
      adresseAcheminement: { 'dateMiseÀJourSource': '', value: '' },
      adresseNuméroVoie: { 'dateMiseÀJourSource': '', value: '' },
      adresseTypeVoie: { 'dateMiseÀJourSource': '', value: '' },
      adresseVoie: { 'dateMiseÀJourSource': '', value: '' },
    }

    let etabMedicoSocialResult = getFullMedicoSocial();
    const profile = getFullProfile();
    profile.identité.adresse = "Ko";

    // When
    etabMedicoSocialResult = filterEtablissementMedicoSocial(etabMedicoSocialResult, profile);

    // Then
    expect(etabMedicoSocialResult.identité).toEqual(expectedIdentity);
  });

  it("retire les info de catégorie si il n’y a pas les droits", () => {
    // Given
    const rawIdentity = getIdentiteMedicoSocial();
    const expectedIdentity = {
      ...rawIdentity,
      catégorieÉtablissement: { 'dateMiseÀJourSource': '', value: '' },
      libelléCatégorieÉtablissement: { 'dateMiseÀJourSource': '', value: '' },
    }

    let etabMedicoSocialResult = getFullMedicoSocial();
    const profile = getFullProfile();
    profile.identité.catégorieÉtablissement = "Ko";

    // When
    etabMedicoSocialResult = filterEtablissementMedicoSocial(etabMedicoSocialResult, profile);

    // Then
    expect(etabMedicoSocialResult.identité).toEqual(expectedIdentity);
  });

  it("retire les info de mode de tarification si il n’y a pas les droits", () => {
    // Given
    const rawIdentity = getIdentiteMedicoSocial();
    const expectedIdentity = {
      ...rawIdentity,
      codeModeTarification: { 'dateMiseÀJourSource': '', value: '' },
      libelléModeTarification: { 'dateMiseÀJourSource': '', value: '' },
    }

    let etabMedicoSocialResult = getFullMedicoSocial();
    const profile = getFullProfile();
    profile.identité.modeTarification = "Ko";

    // When
    etabMedicoSocialResult = filterEtablissementMedicoSocial(etabMedicoSocialResult, profile);

    // Then
    expect(etabMedicoSocialResult.identité).toEqual(expectedIdentity);
  });

  it("retire les info de contact si il n’y a pas les droits", () => {
    // Given
    const rawIdentity = getIdentiteMedicoSocial();
    const expectedIdentity = {
      ...rawIdentity,
      courriel: { 'dateMiseÀJourSource': '', value: '' },
      téléphone: { 'dateMiseÀJourSource': '', value: '' },
      dateOuverture: { 'dateMiseÀJourSource': '', value: '' },
    }

    let etabMedicoSocialResult = getFullMedicoSocial();
    const profile = getFullProfile();
    profile.identité.télEtEmail = "Ko";

    // When
    etabMedicoSocialResult = filterEtablissementMedicoSocial(etabMedicoSocialResult, profile);

    // Then
    expect(etabMedicoSocialResult.identité).toEqual(expectedIdentity);
  });

  it("retire les info d’entree en vigueur du CPOM si il n’y a pas les droits", () => {
    // Given
    const rawIdentity = getIdentiteMedicoSocial();
    const expectedIdentity = {
      ...rawIdentity,
      dateDEntréeEnVigueurDuCpom: { 'dateMiseÀJourSource': '', value: '' },
    }

    let etabMedicoSocialResult = getFullMedicoSocial();
    const profile = getFullProfile();
    profile.identité.dateDEntréeEnVigueurDuCpom = "Ko";

    // When
    etabMedicoSocialResult = filterEtablissementMedicoSocial(etabMedicoSocialResult, profile);

    // Then
    expect(etabMedicoSocialResult.identité).toEqual(expectedIdentity);
  });

  it("retire les info de l’etablissement de rattachement si il n’y a pas les droits", () => {
    // Given
    const rawIdentity = getIdentiteMedicoSocial();
    const expectedIdentity = {
      ...rawIdentity,
      numéroFinessEntitéJuridique: { 'dateMiseÀJourSource': '', value: '' },
      raisonSocialeDeLEntitéDeRattachement: { 'dateMiseÀJourSource': '', value: '' },
    }

    let etabMedicoSocialResult = getFullMedicoSocial();
    const profile = getFullProfile();
    profile.identité.EJ_rattachement = "Ko";

    // When
    etabMedicoSocialResult = filterEtablissementMedicoSocial(etabMedicoSocialResult, profile);

    // Then
    expect(etabMedicoSocialResult.identité).toEqual(expectedIdentity);
  });

  it("retire les info de l’etablissement principale secondaire si il n’y a pas les droits", () => {
    // Given
    const rawIdentity = getIdentiteMedicoSocial();
    const expectedIdentity = {
      ...rawIdentity,
      numéroFinessÉtablissementPrincipal: { 'dateMiseÀJourSource': '', value: '' },
      typeÉtablissement: { 'dateMiseÀJourSource': '', value: '' },
    }

    let etabMedicoSocialResult = getFullMedicoSocial();
    const profile = getFullProfile();
    profile.identité.ET_principal_secondaire = "Ko";

    // When
    etabMedicoSocialResult = filterEtablissementMedicoSocial(etabMedicoSocialResult, profile);

    // Then
    expect(etabMedicoSocialResult.identité).toEqual(expectedIdentity);
  });

  it("retire les info du numéro finess si il n’y a pas les droits", () => {
    // Given
    const rawIdentity = getIdentiteMedicoSocial();
    const expectedIdentity = {
      ...rawIdentity,
      numéroFinessÉtablissementTerritorial: '',
    }

    let etabMedicoSocialResult = getFullMedicoSocial();
    const profile = getFullProfile();
    profile.identité.numéroFiness = "Ko";

    // When
    etabMedicoSocialResult = filterEtablissementMedicoSocial(etabMedicoSocialResult, profile);

    // Then
    expect(etabMedicoSocialResult.identité).toEqual(expectedIdentity);
  });

  it("retire les info de raison sociale si il n’y a pas les droits", () => {
    // Given
    const rawIdentity = getIdentiteMedicoSocial();
    const expectedIdentity = {
      ...rawIdentity,
      raisonSociale: { 'dateMiseÀJourSource': '', value: '' },
      raisonSocialeCourte: { 'dateMiseÀJourSource': '', value: '' },

    }

    let etabMedicoSocialResult = getFullMedicoSocial();
    const profile = getFullProfile();
    profile.identité.nom = "Ko";

    // When
    etabMedicoSocialResult = filterEtablissementMedicoSocial(etabMedicoSocialResult, profile);

    // Then
    expect(etabMedicoSocialResult.identité).toEqual(expectedIdentity);
  });

  it("retire les info de siret si il n’y a pas les droits", () => {
    // Given
    const rawIdentity = getIdentiteMedicoSocial();
    const expectedIdentity = {
      ...rawIdentity,
      siret: { 'dateMiseÀJourSource': '', value: '' },
    }

    let etabMedicoSocialResult = getFullMedicoSocial();
    const profile = getFullProfile();
    profile.identité.siret = "Ko";

    // When
    etabMedicoSocialResult = filterEtablissementMedicoSocial(etabMedicoSocialResult, profile);

    // Then
    expect(etabMedicoSocialResult.identité).toEqual(expectedIdentity);
  });

  it("retire les info de statut de l’etablissement juridique de rattachement si il n’y a pas les droits", () => {
    // Given
    const rawIdentity = getIdentiteMedicoSocial();
    const expectedIdentity = {
      ...rawIdentity,
      statutJuridique: { 'dateMiseÀJourSource': '', value: '' },
      categorisationDeLEntitéDeRattachement: { 'dateMiseÀJourSource': '', value: '' },

    }

    let etabMedicoSocialResult = getFullMedicoSocial();
    const profile = getFullProfile();
    profile.identité.statut_EJ = "Ko";

    // When
    etabMedicoSocialResult = filterEtablissementMedicoSocial(etabMedicoSocialResult, profile);

    // Then
    expect(etabMedicoSocialResult.identité).toEqual(expectedIdentity);
  });

  it("retire les info mono etablissement si il n’y a pas les droits", () => {
    // Given
    const rawIdentity = getIdentiteMedicoSocial();
    const expectedIdentity = {
      ...rawIdentity,
      estMonoÉtablissement: { 'dateMiseÀJourSource': '', value: '' },
    }

    let etabMedicoSocialResult = getFullMedicoSocial();
    const profile = getFullProfile();
    profile.identité.mono_établissement = "Ko";

    // When
    etabMedicoSocialResult = filterEtablissementMedicoSocial(etabMedicoSocialResult, profile);

    // Then
    expect(etabMedicoSocialResult.identité).toEqual(expectedIdentity);
  });

});

describe("Filtre des informations d’activité des etablissement medico-sociaux par rapport au profil", () => {
  it("laisse toutes les informations si il y a tous les droits", () => {
    // Given
    const rawActivity = getActiviteMedicoSocial();

    let etabMedicoSocialResult = getFullMedicoSocial();
    const profile = getFullProfile();

    // When
    etabMedicoSocialResult = filterEtablissementMedicoSocial(etabMedicoSocialResult, profile);

    // Then
    expect(etabMedicoSocialResult.activités).toEqual([rawActivity]);
  });

  it("retire les info de duree moyenne de sejour accompagnement de personne si il n’y a pas les droits", () => {
    // Given
    const rawActivity = getActiviteMedicoSocial();
    const expectedActivity = {
      ...rawActivity,
      duréeMoyenneSéjourAccompagnementPersonnesSorties: { dateMiseÀJourSource: "", value: "" },
    }

    let etabMedicoSocialResult = getFullMedicoSocial();
    const profile = getFullProfile();
    profile.activités.duréeMoyenneSéjourAccompagnementPersonnesSorties = "Ko";

    // When
    etabMedicoSocialResult = filterEtablissementMedicoSocial(etabMedicoSocialResult, profile);

    // Then
    expect(etabMedicoSocialResult.activités).toEqual([expectedActivity]);
  });

  it("retire les info sur la file active de personnes accompagnés si il n’y a pas les droits", () => {
    // Given
    const rawActivity = getActiviteMedicoSocial();
    const expectedActivity = {
      ...rawActivity,
      fileActivePersonnesAccompagnées: { dateMiseÀJourSource: "", value: "" },
    }

    let etabMedicoSocialResult = getFullMedicoSocial();
    const profile = getFullProfile();
    profile.activités.fileActivePersonnesAccompagnées = "Ko";

    // When
    etabMedicoSocialResult = filterEtablissementMedicoSocial(etabMedicoSocialResult, profile);

    // Then
    expect(etabMedicoSocialResult.activités).toEqual([expectedActivity]);
  });

  it("retire les info sur le nombre moyen d’absence de personne accompagnés si il n’y a pas les droits", () => {
    // Given
    const rawActivity = getActiviteMedicoSocial();
    const expectedActivity = {
      ...rawActivity,
      nombreMoyenJournéesAbsencePersonnesAccompagnées: { dateMiseÀJourSource: "", value: "" },
    }

    let etabMedicoSocialResult = getFullMedicoSocial();
    const profile = getFullProfile();
    profile.activités.nombreMoyenJournéesAbsencePersonnesAccompagnées = "Ko";

    // When
    etabMedicoSocialResult = filterEtablissementMedicoSocial(etabMedicoSocialResult, profile);

    // Then
    expect(etabMedicoSocialResult.activités).toEqual([expectedActivity]);
  });

  it("retire les info sur le taux d’occupation de l’accueil de jour si il n’y a pas les droits", () => {
    // Given
    const rawActivity = getActiviteMedicoSocial();
    const expectedActivity = {
      ...rawActivity,
      tauxOccupationAccueilDeJour: { dateMiseÀJourSource: "", value: "" },
    }

    let etabMedicoSocialResult = getFullMedicoSocial();
    const profile = getFullProfile();
    profile.activités.tauxOccupationAccueilDeJour = "Ko";

    // When
    etabMedicoSocialResult = filterEtablissementMedicoSocial(etabMedicoSocialResult, profile);

    // Then
    expect(etabMedicoSocialResult.activités).toEqual([expectedActivity]);
  });

  it("retire les info sur le taux d’occupation de l’hebergement permanent si il n’y a pas les droits", () => {
    // Given
    const rawActivity = getActiviteMedicoSocial();
    const expectedActivity = {
      ...rawActivity,
      tauxOccupationHébergementPermanent: { dateMiseÀJourSource: "", value: "" },
    }

    let etabMedicoSocialResult = getFullMedicoSocial();
    const profile = getFullProfile();
    profile.activités.tauxOccupationHébergementPermanent = "Ko";

    // When
    etabMedicoSocialResult = filterEtablissementMedicoSocial(etabMedicoSocialResult, profile);

    // Then
    expect(etabMedicoSocialResult.activités).toEqual([expectedActivity]);
  });

  it("retire les info sur le taux d’occupation de l’hebergement temporaire si il n’y a pas les droits", () => {
    // Given
    const rawActivity = getActiviteMedicoSocial();
    const expectedActivity = {
      ...rawActivity,
      tauxOccupationHébergementTemporaire: { dateMiseÀJourSource: "", value: "" },
    }

    let etabMedicoSocialResult = getFullMedicoSocial();
    const profile = getFullProfile();
    profile.activités.tauxOccupationHébergementTemporaire = "Ko";

    // When
    etabMedicoSocialResult = filterEtablissementMedicoSocial(etabMedicoSocialResult, profile);

    // Then
    expect(etabMedicoSocialResult.activités).toEqual([expectedActivity]);
  });

  it("retire les info sur le taux de realisation de l’activité si il n’y a pas les droits", () => {
    // Given
    const rawActivity = getActiviteMedicoSocial();
    const expectedActivity = {
      ...rawActivity,
      tauxRéalisationActivité: { dateMiseÀJourSource: "", value: "" },
    }

    let etabMedicoSocialResult = getFullMedicoSocial();
    const profile = getFullProfile();
    profile.activités.tauxRéalisationActivité = "Ko";

    // When
    etabMedicoSocialResult = filterEtablissementMedicoSocial(etabMedicoSocialResult, profile);

    // Then
    expect(etabMedicoSocialResult.activités).toEqual([expectedActivity]);
  });

  it("retire les info sur le taux d’occupation de l’externat si il n’y a pas les droits", () => {
    // Given
    const rawActivity = getActiviteMedicoSocial();
    const expectedActivity = {
      ...rawActivity,
      tauxOccupationExternat: { value: "" },
    }

    let etabMedicoSocialResult = getFullMedicoSocial();
    const profile = getFullProfile();
    profile.activités.tauxOccupationExternat = "Ko";

    // When
    etabMedicoSocialResult = filterEtablissementMedicoSocial(etabMedicoSocialResult, profile);

    // Then
    expect(etabMedicoSocialResult.activités).toEqual([expectedActivity]);
  });

  it("retire les info sur le taux d’occupation du semi internat si il n’y a pas les droits", () => {
    // Given
    const rawActivity = getActiviteMedicoSocial();
    const expectedActivity = {
      ...rawActivity,
      tauxOccupationSemiInternat: { value: "" },
    }

    let etabMedicoSocialResult = getFullMedicoSocial();
    const profile = getFullProfile();
    profile.activités.tauxOccupationSemiInternat = "Ko";

    // When
    etabMedicoSocialResult = filterEtablissementMedicoSocial(etabMedicoSocialResult, profile);

    // Then
    expect(etabMedicoSocialResult.activités).toEqual([expectedActivity]);
  });

  it("retire les info sur le taux d’occupation de l’internat si il n’y a pas les droits", () => {
    // Given
    const rawActivity = getActiviteMedicoSocial();
    const expectedActivity = {
      ...rawActivity,
      tauxOccupationInternat: { value: "" },
    }

    let etabMedicoSocialResult = getFullMedicoSocial();
    const profile = getFullProfile();
    profile.activités.tauxOccupationInternat = "Ko";

    // When
    etabMedicoSocialResult = filterEtablissementMedicoSocial(etabMedicoSocialResult, profile);

    // Then
    expect(etabMedicoSocialResult.activités).toEqual([expectedActivity]);
  });

  it("retire les info sur le taux d’occupation autre si il n’y a pas les droits", () => {
    // Given
    const rawActivity = getActiviteMedicoSocial();
    const expectedActivity = {
      ...rawActivity,
      tauxOccupationAutre: { value: "" },
    }

    let etabMedicoSocialResult = getFullMedicoSocial();
    const profile = getFullProfile();
    profile.activités.tauxOccupationAutre = "Ko";

    // When
    etabMedicoSocialResult = filterEtablissementMedicoSocial(etabMedicoSocialResult, profile);

    // Then
    expect(etabMedicoSocialResult.activités).toEqual([expectedActivity]);
  });

  it("retire les info sur le taux d’occupation en seance si il n’y a pas les droits", () => {
    // Given
    const rawActivity = getActiviteMedicoSocial();
    const expectedActivity = {
      ...rawActivity,
      tauxOccupationSeances: { value: "" },
    }

    let etabMedicoSocialResult = getFullMedicoSocial();
    const profile = getFullProfile();
    profile.activités.tauxOccupationSeances = "Ko";

    // When
    etabMedicoSocialResult = filterEtablissementMedicoSocial(etabMedicoSocialResult, profile);

    // Then
    expect(etabMedicoSocialResult.activités).toEqual([expectedActivity]);
  });

  it("retire les info sur le taux d’occupation global si il n’y a pas les droits", () => {
    // Given
    const rawActivity = getActiviteMedicoSocial();
    const expectedActivity = {
      ...rawActivity,
      tauxOccupationGlobal: { dateMiseÀJourSource: "", value: "" },
    }

    let etabMedicoSocialResult = getFullMedicoSocial();
    const profile = getFullProfile();
    profile.activités.tauxOccupationGlobal = "Ko";

    // When
    etabMedicoSocialResult = filterEtablissementMedicoSocial(etabMedicoSocialResult, profile);

    // Then
    expect(etabMedicoSocialResult.activités).toEqual([expectedActivity]);
  });

})

describe("Filtre des informations d’autorisation des etablissement medico-sociaux par rapport au profil", () => {
  it("laisse toutes les informations si il y a tous les droits", () => {
    // Given
    const rawAutorisationCapacity = getAutorisationCapaciteMedicoSocial();

    let etabMedicoSocialResult = getFullMedicoSocial();
    const profile = getFullProfile();

    // When
    etabMedicoSocialResult = filterEtablissementMedicoSocial(etabMedicoSocialResult, profile);

    // Then
    expect(etabMedicoSocialResult.autorisationsEtCapacités).toEqual(rawAutorisationCapacity);
  });

  it("retire les info d’autorisation si il n’y a pas les droits", () => {
    // Given
    const rawAutorisationCapacity = getAutorisationCapaciteMedicoSocial();
    const expectedAutorisationCapacity = {
      ...rawAutorisationCapacity,
      autorisations: { dateMiseÀJourSource: "", disciplines: [] },
    }

    let etabMedicoSocialResult = getFullMedicoSocial();
    const profile = getFullProfile();
    profile.autorisationsEtCapacités.autorisations = "Ko";

    // When
    etabMedicoSocialResult = filterEtablissementMedicoSocial(etabMedicoSocialResult, profile);

    // Then
    expect(etabMedicoSocialResult.autorisationsEtCapacités).toEqual(expectedAutorisationCapacity);
  });

  it("retire les info de capacite si il n’y a pas les droits", () => {
    // Given
    const rawAutorisationCapacity = getAutorisationCapaciteMedicoSocial();
    const expectedAutorisationCapacity = {
      ...rawAutorisationCapacity,
      capacités: { dateMiseÀJourSource: "", capacitéParActivité: [] },
    }

    let etabMedicoSocialResult = getFullMedicoSocial();
    const profile = getFullProfile();
    profile.autorisationsEtCapacités.capacités = "Ko";

    // When
    etabMedicoSocialResult = filterEtablissementMedicoSocial(etabMedicoSocialResult, profile);

    // Then
    expect(etabMedicoSocialResult.autorisationsEtCapacités).toEqual(expectedAutorisationCapacity);
  });
});

describe("Filtre les informations de budget et finance des etablissement medico-sociaux par rapport au profil", () => {
  it("laisse toutes les informations si il y a tous les droits", () => {
    // Given
    const rawBudgetAndFinance = getBudgetFinanceMedicoSocial();

    let etabMedicoSocialResult = getFullMedicoSocial();
    const profile = getFullProfile();

    // When
    etabMedicoSocialResult = filterEtablissementMedicoSocial(etabMedicoSocialResult, profile);

    // Then
    expect(etabMedicoSocialResult.budgetEtFinances).toEqual([rawBudgetAndFinance]);
  });

  it("retire les info de compte de resultat si il n’y a pas les droits", () => {
    // Given
    const rawBudgetAndFinance = getBudgetFinanceMedicoSocial();
    const expectedBudgetAndFinance = {
      ...rawBudgetAndFinance,
      cadreBudgétaire: "",
      chargesEtProduits: { dateMiseÀJourSource: "" },
      recettesEtDépenses: { dateMiseÀJourSource: "" },
    }

    let etabMedicoSocialResult = getFullMedicoSocial();
    const profile = getFullProfile();
    profile.budgetEtFinances.compteRésultats = "Ko";

    // When
    etabMedicoSocialResult = filterEtablissementMedicoSocial(etabMedicoSocialResult, profile);

    // Then
    expect(etabMedicoSocialResult.budgetEtFinances).toEqual([expectedBudgetAndFinance]);
  })

  it("retire les info de contribution au frais de siege si il n’y a pas les droits", () => {
    // Given
    const rawBudgetAndFinance = getBudgetFinanceMedicoSocial();
    const expectedBudgetAndFinance = {
      ...rawBudgetAndFinance,
      contributionAuxFraisDeSiège: { dateMiseÀJourSource: "", valeur: "" },
    }

    let etabMedicoSocialResult = getFullMedicoSocial();
    const profile = getFullProfile();
    profile.budgetEtFinances.contributionAuxFraisDeSiège = "Ko";

    // When
    etabMedicoSocialResult = filterEtablissementMedicoSocial(etabMedicoSocialResult, profile);

    // Then
    expect(etabMedicoSocialResult.budgetEtFinances).toEqual([expectedBudgetAndFinance]);
  })

  it("retire les info sur le fond de roulement si il n’y a pas les droits", () => {
    // Given
    const rawBudgetAndFinance = getBudgetFinanceMedicoSocial();
    const expectedBudgetAndFinance = {
      ...rawBudgetAndFinance,
      fondsDeRoulement: { dateMiseÀJourSource: "", valeur: "" },
    }

    let etabMedicoSocialResult = getFullMedicoSocial();
    const profile = getFullProfile();
    profile.budgetEtFinances.fondsDeRoulement = "Ko";

    // When
    etabMedicoSocialResult = filterEtablissementMedicoSocial(etabMedicoSocialResult, profile);

    // Then
    expect(etabMedicoSocialResult.budgetEtFinances).toEqual([expectedBudgetAndFinance]);
  })

  it("retire les info sur le resultat net comptable si il n’y a pas les droits", () => {
    // Given
    const rawBudgetAndFinance = getBudgetFinanceMedicoSocial();
    const expectedBudgetAndFinance = {
      ...rawBudgetAndFinance,
      résultatNetComptable: { dateMiseÀJourSource: "", valeur: "" },
    }

    let etabMedicoSocialResult = getFullMedicoSocial();
    const profile = getFullProfile();
    profile.budgetEtFinances.résultatNetComptable = "Ko";

    // When
    etabMedicoSocialResult = filterEtablissementMedicoSocial(etabMedicoSocialResult, profile);

    // Then
    expect(etabMedicoSocialResult.budgetEtFinances).toEqual([expectedBudgetAndFinance]);
  })

  it("retire les info de taux de caf net si il n’y a pas les droits", () => {
    // Given
    const rawBudgetAndFinance = getBudgetFinanceMedicoSocial();
    const expectedBudgetAndFinance = {
      ...rawBudgetAndFinance,
      tauxDeCafNette: { dateMiseÀJourSource: "", valeur: "" },
    }

    let etabMedicoSocialResult = getFullMedicoSocial();
    const profile = getFullProfile();
    profile.budgetEtFinances.tauxDeCafNette = "Ko";

    // When
    etabMedicoSocialResult = filterEtablissementMedicoSocial(etabMedicoSocialResult, profile);

    // Then
    expect(etabMedicoSocialResult.budgetEtFinances).toEqual([expectedBudgetAndFinance]);
  })

  it("retire les info sur le taux de vetuste si il n’y a pas les droits", () => {
    // Given
    const rawBudgetAndFinance = getBudgetFinanceMedicoSocial();
    const expectedBudgetAndFinance = {
      ...rawBudgetAndFinance,
      tauxDeVétustéConstruction: { dateMiseÀJourSource: "", valeur: "" },

    }

    let etabMedicoSocialResult = getFullMedicoSocial();
    const profile = getFullProfile();
    profile.budgetEtFinances.tauxDeVétustéConstruction = "Ko";

    // When
    etabMedicoSocialResult = filterEtablissementMedicoSocial(etabMedicoSocialResult, profile);

    // Then
    expect(etabMedicoSocialResult.budgetEtFinances).toEqual([expectedBudgetAndFinance]);
  })
})

describe("Filtre les informations RH des etablissement medico-sociaux par rapport au profil", () => {
  it("laisse toutes les informations si il y a tous les droits", () => {
    // Given
    const rawRH = getRessourcesHumainesMedicoSocial();

    let etabMedicoSocialResult = getFullMedicoSocial();
    const profile = getFullProfile();

    // When
    etabMedicoSocialResult = filterEtablissementMedicoSocial(etabMedicoSocialResult, profile);

    // Then
    expect(etabMedicoSocialResult.ressourcesHumaines).toEqual([rawRH]);
  });

  it("retire les info sur le nombre d’ETP realise si n’y a pas les droits", () => {
    // Given
    const rawRH = getRessourcesHumainesMedicoSocial();
    const expectedRH = {
      ...rawRH,
      nombreDEtpRéalisés: { dateMiseÀJourSource: "", valeur: "" },

    }

    let etabMedicoSocialResult = getFullMedicoSocial();
    const profile = getFullProfile();
    profile.ressourcesHumaines.nombreDEtpRéalisés = "Ko";

    // When
    etabMedicoSocialResult = filterEtablissementMedicoSocial(etabMedicoSocialResult, profile);

    // Then
    expect(etabMedicoSocialResult.ressourcesHumaines).toEqual([expectedRH]);
  })

  it("retire les info sur le nombre de CDD de remplacement si il n’y a pas les droits", () => {
    // Given
    const rawRH = getRessourcesHumainesMedicoSocial();
    const expectedRH = {
      ...rawRH,
      nombreDeCddDeRemplacement: { dateMiseÀJourSource: "", valeur: "" },

    }

    let etabMedicoSocialResult = getFullMedicoSocial();
    const profile = getFullProfile();
    profile.ressourcesHumaines.nombreDeCddDeRemplacement = "Ko";

    // When
    etabMedicoSocialResult = filterEtablissementMedicoSocial(etabMedicoSocialResult, profile);

    // Then
    expect(etabMedicoSocialResult.ressourcesHumaines).toEqual([expectedRH]);
  })

  it("retire les info sur le taux d’absenteisme si il n’y a pas les droits", () => {
    // Given
    const rawRH = getRessourcesHumainesMedicoSocial();
    const expectedRH = {
      ...rawRH,
      tauxDAbsentéisme: { dateMiseÀJourSource: "" },

    }

    let etabMedicoSocialResult = getFullMedicoSocial();
    const profile = getFullProfile();
    profile.ressourcesHumaines.tauxDAbsentéisme = "Ko";

    // When
    etabMedicoSocialResult = filterEtablissementMedicoSocial(etabMedicoSocialResult, profile);

    // Then
    expect(etabMedicoSocialResult.ressourcesHumaines).toEqual([expectedRH]);
  })

  it("retire les info sur le taux d’ETP vacant si il n’y a pas les droits", () => {
    // Given
    const rawRH = getRessourcesHumainesMedicoSocial();
    const expectedRH = {
      ...rawRH,
      tauxDEtpVacants: { dateMiseÀJourSource: "", valeur: "" },

    }

    let etabMedicoSocialResult = getFullMedicoSocial();
    const profile = getFullProfile();
    profile.ressourcesHumaines.tauxDEtpVacants = "Ko";

    // When
    etabMedicoSocialResult = filterEtablissementMedicoSocial(etabMedicoSocialResult, profile);

    // Then
    expect(etabMedicoSocialResult.ressourcesHumaines).toEqual([expectedRH]);
  })

  it("retire les info sur le taux de prestation externe si il n’y a pas les droits", () => {
    // Given
    const rawRH = getRessourcesHumainesMedicoSocial();
    const expectedRH = {
      ...rawRH,
      tauxDePrestationsExternes: { dateMiseÀJourSource: "", valeur: "" },

    }

    let etabMedicoSocialResult = getFullMedicoSocial();
    const profile = getFullProfile();
    profile.ressourcesHumaines.tauxDePrestationsExternes = "Ko";

    // When
    etabMedicoSocialResult = filterEtablissementMedicoSocial(etabMedicoSocialResult, profile);

    // Then
    expect(etabMedicoSocialResult.ressourcesHumaines).toEqual([expectedRH]);
  })

  it("retire les info sur le taux de rotation du personnel si il n’y a pas les droits", () => {
    // Given
    const rawRH = getRessourcesHumainesMedicoSocial();
    const expectedRH = {
      ...rawRH,
      tauxDeRotationDuPersonnel: { dateMiseÀJourSource: "", valeur: "" },

    }

    let etabMedicoSocialResult = getFullMedicoSocial();
    const profile = getFullProfile();
    profile.ressourcesHumaines.tauxDeRotationDuPersonnel = "Ko";

    // When
    etabMedicoSocialResult = filterEtablissementMedicoSocial(etabMedicoSocialResult, profile);

    // Then
    expect(etabMedicoSocialResult.ressourcesHumaines).toEqual([expectedRH]);
  })
})

describe("Filtre les informations qualite des etablissement medico-sociaux par rapport au profil", () => {
  it("laisse toutes les informations si il y a tous les droits", () => {
    // Given
    const rawQuality = getQualitéMedicoSocial();

    let etabMedicoSocialResult = getFullMedicoSocial();
    const profile = getFullProfile();

    // When
    etabMedicoSocialResult = filterEtablissementMedicoSocial(etabMedicoSocialResult, profile);

    // Then
    expect(etabMedicoSocialResult.qualite).toEqual(rawQuality);
  });

  it("retire les info des donnee de reclamation si n’y a pas les droits", () => {
    // Given
    const rawQuality = getQualitéMedicoSocial();
    const expectedQuality = {
      ...rawQuality,
      reclamations: [{ details: [] }],
    }

    let etabMedicoSocialResult = getFullMedicoSocial();
    const profile = getFullProfile();
    profile.Qualité.DonnéesSirec = "Ko";

    // When
    etabMedicoSocialResult = filterEtablissementMedicoSocial(etabMedicoSocialResult, profile);

    // Then
    expect(etabMedicoSocialResult.qualite).toEqual(expectedQuality);
  })

  it("retire les info d’evenement indesirable si n’y a pas les droits", () => {
    // Given
    const rawQuality = getQualitéMedicoSocial();
    const expectedQuality = {
      ...rawQuality,
      evenementsIndesirables: [],
    }

    let etabMedicoSocialResult = getFullMedicoSocial();
    const profile = getFullProfile();
    profile.Qualité.DonnéesSivss = "Ko";

    // When
    etabMedicoSocialResult = filterEtablissementMedicoSocial(etabMedicoSocialResult, profile);

    // Then
    expect(etabMedicoSocialResult.qualite).toEqual(expectedQuality);
  })

  it("retire les info d’inspection et controle si n’y a pas les droits", () => {
    // Given
    const rawQuality = getQualitéMedicoSocial();
    const expectedQuality = {
      ...rawQuality,
      inspectionsEtControles: { dateMiseAJourSource: "", inspectionsEtControles: [] },
    }

    let etabMedicoSocialResult = getFullMedicoSocial();
    const profile = getFullProfile();
    profile.Qualité.DonnéesSiicea = "Ko";

    // When
    etabMedicoSocialResult = filterEtablissementMedicoSocial(etabMedicoSocialResult, profile);

    // Then
    expect(etabMedicoSocialResult.qualite).toEqual(expectedQuality);
  })
})
