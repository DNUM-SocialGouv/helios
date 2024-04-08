import { CadreBudgétaire } from "../métier/entities/établissement-territorial-médico-social/CadreBudgétaire";
import { ÉtablissementTerritorialMédicoSocialActivité } from "../métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialActivité";
import { ÉtablissementTerritorialMédicoSocialAutorisationEtCapacité } from "../métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialAutorisation";
import { ÉtablissementTerritorialMédicoSocialBudgetEtFinances } from "../métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialBudgetEtFinances";
import { ÉtablissementTerritorialMédicoSocialRessourcesHumaines } from "../métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialRessourcesHumaines";
import { ÉtablissementTerritorialSanitaireActivité } from "../métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireActivité";
import { ÉtablissementTerritorialSanitaireAutorisationEtCapacité } from "../métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireAutorisation";
import { ÉtablissementTerritorialIdentité } from "../métier/entities/ÉtablissementTerritorialIdentité";
import { ÉtablissementTerritorialQualite } from "../métier/entities/ÉtablissementTerritorialQualite";

export class ÉtablissementTerritorialTestBuilder {
  private static médicoSocial: ÉtablissementTerritorialIdentité = {
    adresseAcheminement: {
      dateMiseÀJourSource: "2022-02-02",
      value: "01130 NANTUA",
    },
    adresseNuméroVoie: {
      dateMiseÀJourSource: "2022-02-02",
      value: "50",
    },
    adresseTypeVoie: {
      dateMiseÀJourSource: "2022-02-02",
      value: "R",
    },
    adresseVoie: {
      dateMiseÀJourSource: "2022-02-02",
      value: "PAUL PAINLEVE",
    },
    catégorieÉtablissement: {
      dateMiseÀJourSource: "2022-02-02",
      value: "159",
    },
    codeModeTarification: {
      dateMiseÀJourSource: "2022-02-02",
      value: "03",
    },
    courriel: {
      dateMiseÀJourSource: "2022-02-02",
      value: "a@example.com",
    },
    dateDEntréeEnVigueurDuCpom: {
      dateMiseÀJourSource: "2022-02-02",
      value: "2020-04-10",
    },
    libelléCatégorieÉtablissement: {
      dateMiseÀJourSource: "2022-02-02",
      value: "Centre Hospitalier (C.H.)",
    },
    libelléModeTarification: {
      dateMiseÀJourSource: "2022-02-02",
      value: "ARS établissements Publics de santé dotation globale",
    },
    numéroFinessEntitéJuridique: {
      dateMiseÀJourSource: "2022-02-02",
      value: "010008407",
    },
    numéroFinessÉtablissementPrincipal: {
      dateMiseÀJourSource: "2022-02-02",
      value: "010018407",
    },
    numéroFinessÉtablissementTerritorial: {
      dateMiseÀJourSource: "2022-02-02",
      value: "010000040",
    },
    raisonSociale: {
      dateMiseÀJourSource: "2022-02-02",
      value: "CENTRE HOSPITALIER NANTUA",
    },
    raisonSocialeCourte: {
      dateMiseÀJourSource: "2022-02-02",
      value: "CH NANTUA",
    },
    siret: {
      dateMiseÀJourSource: "2022-02-02",
      value: "26011021800047",
    },
    typeÉtablissement: {
      dateMiseÀJourSource: "2022-02-02",
      value: "S",
    },
    téléphone: {
      dateMiseÀJourSource: "2022-02-02",
      value: "0102030405",
    },
    codeRegion: '84'
  };

  private static sanitaire: ÉtablissementTerritorialIdentité = {
    adresseAcheminement: {
      dateMiseÀJourSource: "2022-02-02",
      value: "59650 VILLENEUVE D ASCQ",
    },
    adresseNuméroVoie: {
      dateMiseÀJourSource: "2022-02-02",
      value: "20",
    },
    adresseTypeVoie: {
      dateMiseÀJourSource: "2022-02-02",
      value: "AV",
    },
    adresseVoie: {
      dateMiseÀJourSource: "2022-02-02",
      value: "DE LA RECONNAISSANCE",
    },
    catégorieÉtablissement: {
      dateMiseÀJourSource: "2022-02-02",
      value: "365",
    },
    codeModeTarification: {
      dateMiseÀJourSource: "2022-02-02",
      value: "07",
    },
    courriel: {
      dateMiseÀJourSource: "2022-02-02",
      value: "b@example.com",
    },
    dateDEntréeEnVigueurDuCpom: {
      dateMiseÀJourSource: "",
      value: "",
    },
    libelléCatégorieÉtablissement: {
      dateMiseÀJourSource: "2022-02-02",
      value: "Centre Hospitalier (C.H.)",
    },
    libelléModeTarification: {
      dateMiseÀJourSource: "2022-02-02",
      value: "ARS établissements de santé non financés dotation globale",
    },
    numéroFinessEntitéJuridique: {
      dateMiseÀJourSource: "2022-02-02",
      value: "590000741",
    },
    numéroFinessÉtablissementPrincipal: {
      dateMiseÀJourSource: "2022-02-02",
      value: "",
    },
    numéroFinessÉtablissementTerritorial: {
      dateMiseÀJourSource: "2022-02-02",
      value: "590782553",
    },
    raisonSociale: {
      dateMiseÀJourSource: "2022-02-02",
      value: "HOPITAL PRIVE DE VILLENEUVE DASCQ",
    },
    raisonSocialeCourte: {
      dateMiseÀJourSource: "2022-02-02",
      value: "HP VILLENEUVE DASCQ",
    },
    siret: {
      dateMiseÀJourSource: "2022-02-02",
      value: "47678033300037",
    },
    typeÉtablissement: {
      dateMiseÀJourSource: "2022-02-02",
      value: "P",
    },
    téléphone: {
      dateMiseÀJourSource: "2022-02-02",
      value: "0102030406",
    },
    codeRegion: '84'
  };

  private static activitéMédicoSocial: ÉtablissementTerritorialMédicoSocialActivité = {
    année: 2019,
    duréeMoyenneSéjourAccompagnementPersonnesSorties: {
      dateMiseÀJourSource: "2022-02-02",
      value: 80,
    },
    fileActivePersonnesAccompagnées: {
      dateMiseÀJourSource: "2022-02-02",
      value: 80,
    },
    nombreMoyenJournéesAbsencePersonnesAccompagnées: {
      dateMiseÀJourSource: "2022-02-02",
      value: 80,
    },
    numéroFinessÉtablissementTerritorial: "123456789",
    tauxOccupationAccueilDeJour: {
      dateMiseÀJourSource: "2022-02-02",
      value: 80,
    },
    tauxOccupationHébergementPermanent: {
      dateMiseÀJourSource: "2022-02-02",
      value: 80,
    },
    tauxOccupationHébergementTemporaire: {
      dateMiseÀJourSource: "2022-02-02",
      value: 80,
    },
    tauxRéalisationActivité: {
      dateMiseÀJourSource: "2022-02-02",
      value: 80,
    },
  };

  private static activitéSanitaire: ÉtablissementTerritorialSanitaireActivité = {
    année: 2016,
    nombreDePassagesAuxUrgences: {
      dateMiseÀJourSource: "2022-02-02",
      value: 60_000,
    },
    nombreJournéesCompletePsy: {
      dateMiseÀJourSource: "2022-02-02",
      value: 60,
    },
    nombreJournéesCompletesSsr: {
      dateMiseÀJourSource: "2022-02-02",
      value: 60,
    },
    nombreJournéesPartiellesPsy: {
      dateMiseÀJourSource: "2022-02-02",
      value: 60,
    },
    nombreJournéesPartielsSsr: {
      dateMiseÀJourSource: "2022-02-02",
      value: 60,
    },
    nombreSéjoursCompletsChirurgie: {
      dateMiseÀJourSource: "2022-02-02",
      value: 60,
    },
    nombreSéjoursCompletsMédecine: {
      dateMiseÀJourSource: "2022-02-02",
      value: 60,
    },
    nombreSéjoursCompletsObstétrique: {
      dateMiseÀJourSource: "2022-02-02",
      value: 60,
    },
    nombreSéjoursPartielsChirurgie: {
      dateMiseÀJourSource: "2022-02-02",
      value: 60,
    },
    nombreSéjoursPartielsMédecine: {
      dateMiseÀJourSource: "2022-02-02",
      value: 60,
    },
    nombreSéjoursPartielsObstétrique: {
      dateMiseÀJourSource: "2022-02-02",
      value: 60,
    },
    numéroFinessÉtablissementTerritorial: "123456789",
  };

  private static autorisationMédicoSocial: ÉtablissementTerritorialMédicoSocialAutorisationEtCapacité = {
    autorisations: {
      dateMiseÀJourSource: "2022-02-02",
      disciplines: [
        {
          activités: [
            {
              clientèles: [
                {
                  code: "010",
                  datesEtCapacités: {
                    capacitéAutoriséeTotale: 10,
                    capacitéInstalléeTotale: 10,
                    dateDAutorisation: "2020-01-01",
                    dateDeDernièreInstallation: "2020-01-01",
                    dateDeMiseÀJourDAutorisation: "2020-01-01",
                    estInstallée: true,
                  },
                  libellé: "Tous Types de Déficiences Pers.Handicap.(sans autre indic.)",
                },
              ],
              code: "21",
              libellé: "Accueil de Jour",
            },
          ],
          code: "658",
          libellé: "Accueil temporaire pour adultes handicapés",
        },
      ],
    },
    capacités: {
      capacitéParActivité: [
        {
          capacité: 10,
          libellé: "Accueil de Jour",
        },
      ],
      dateMiseÀJourSource: "2022-08-18",
    },
    numéroFinessÉtablissementTerritorial: "123456789",
  };

  private static autorisationSanitaire: ÉtablissementTerritorialSanitaireAutorisationEtCapacité = {
    autorisations: {
      activités: [
        {
          code: "16",
          libellé: "Traitement de l'insuffisance rénale chronique par épuration extrarénale",
          modalités: [
            {
              code: "42",
              formes: [
                {
                  autorisationSanitaire: {
                    dateDAutorisation: "2005-10-11",
                    dateDeFin: "2026-05-03",
                    dateDeMiseEnOeuvre: "2008-01-04",
                    numéroArhgos: "01-00-000",
                  },
                  code: "00",
                  libellé: "Pas de forme",
                },
              ],
              libellé: "Hémodialyse en unité médicalisée",
            },
          ],
        },
      ],
      dateMiseÀJourSource: "2022-08-29",
    },
    autresActivités: {
      activités: [
        {
          code: "A1",
          libellé: "Dépôt de sang",
          modalités: [
            {
              code: "M0",
              formes: [
                {
                  autreActivitéSanitaire: {
                    dateDAutorisation: "2019-06-03",
                    dateDeFin: "2024-08-31",
                    dateDeMiseEnOeuvre: "2019-06-03",
                  },
                  code: "00",
                  libellé: "Pas de forme",
                },
              ],
              libellé: "Dépôt d'urgence",
            },
          ],
        },
      ],
      dateMiseÀJourSource: "2022-08-29",
    },
    capacités: [
      {
        année: 2022,
        dateMiseÀJourSource: "2022-09-02",
        nombreDeLitsEnChirurgie: 10,
        nombreDeLitsEnMédecine: 20,
        nombreDeLitsEnObstétrique: 5,
        nombreDeLitsEnSsr: 2,
        nombreDeLitsEnUsld: 15,
        nombreDeLitsOuPlacesEnPsyHospitalisationComplète: 5,
        nombreDePlacesEnChirurgie: 20,
        nombreDePlacesEnMédecine: 50,
        nombreDePlacesEnObstétrique: 5,
        nombreDePlacesEnPsyHospitalisationPartielle: 13,
        nombreDePlacesEnSsr: 5,
      },
    ],
    numéroFinessÉtablissementTerritorial: "123456789",
    reconnaissancesContractuelles: {
      activités: [
        {
          code: "R7",
          libellé: "Surveillance continue",
          modalités: [
            {
              code: "N8",
              formes: [
                {
                  code: "01",
                  libellé: "Hospitalisation complète (24 heures consécutives ou plus)",
                  reconnaissanceContractuelleSanitaire: {
                    capacitéAutorisée: 4,
                    dateDEffetAsr: "2013-11-30",
                    dateDEffetCpom: "2013-11-01",
                    dateDeFinCpom: "2018-11-30",
                    numéroArhgos: "18-00-RC00000",
                    numéroCpom: "18-00-C00000",
                  },
                },
              ],
              libellé: "USC polyvalente - adulte (non adossée à une unité de réanimation)",
            },
          ],
        },
      ],
      dateMiseÀJourSource: "2022-08-29",
    },
    équipementsMatérielsLourds: {
      dateMiseÀJourSource: "2022-08-29",
      équipements: [
        {
          autorisations: [
            {
              dateDAutorisation: "2006-05-02",
              dateDeFin: "2027-02-16",
              dateDeMiseEnOeuvre: "2009-01-20",
              numéroArhgos: "01-00-0000",
            },
          ],
          code: "06201",
          libellé: "Appareil d'IRM à utilisation clinique",
        },
      ],
    },
  };

  private static budgetEtFinancesErrdMédicoSocial: ÉtablissementTerritorialMédicoSocialBudgetEtFinances = {
    année: 2019,
    cadreBudgétaire: CadreBudgétaire.ERRD,
    chargesEtProduits: {
      charges: null,
      dateMiseÀJourSource: "2022-02-02",
      produits: null,
    },
    contributionAuxFraisDeSiège: {
      dateMiseÀJourSource: "2022-02-02",
      valeur: -20000,
    },
    fondsDeRoulement: {
      dateMiseÀJourSource: "2022-02-02",
      valeur: 2206969.2599999998,
    },
    recettesEtDépenses: {
      dateMiseÀJourSource: "2022-02-02",
      dépensesGroupe1: -129491.19,
      dépensesGroupe2: -2718457.1600000001,
      dépensesGroupe3: -406469.14999999997,
      recettesGroupe1: 3388394.2000000002,
      recettesGroupe2: 22231.200000000001,
      recettesGroupe3: 129491.19,
    },
    résultatNetComptable: {
      dateMiseÀJourSource: "2022-02-02",
      valeur: -38330.669999999503,
    },
    tauxDeCafNette: {
      dateMiseÀJourSource: "2022-02-02",
      valeur: 0.13548734436644624,
    },
    tauxDeVétustéConstruction: {
      dateMiseÀJourSource: "2022-02-02",
      valeur: 0.38845089702004892,
    },
  };

  private static budgetEtFinancesCaPhMédicoSocial: ÉtablissementTerritorialMédicoSocialBudgetEtFinances = {
    année: 2019,
    cadreBudgétaire: CadreBudgétaire.CA_PH,
    chargesEtProduits: {
      charges: null,
      dateMiseÀJourSource: "2022-02-02",
      produits: null,
    },
    contributionAuxFraisDeSiège: {
      dateMiseÀJourSource: "2022-02-02",
      valeur: null,
    },
    fondsDeRoulement: {
      dateMiseÀJourSource: "2022-02-02",
      valeur: null,
    },
    recettesEtDépenses: {
      dateMiseÀJourSource: "2022-02-02",
      dépensesGroupe1: -16901.360000000001,
      dépensesGroupe2: -464929.67000000004,
      dépensesGroupe3: -51421.190000000002,
      recettesGroupe1: 595042.94999999995,
      recettesGroupe2: 17724.380000000001,
      recettesGroupe3: 16484.099999999999,
    },
    résultatNetComptable: {
      dateMiseÀJourSource: "2022-02-02",
      valeur: 95999.209999999963,
    },
    tauxDeCafNette: {
      dateMiseÀJourSource: "2022-02-02",
      valeur: 0.16460754444264256,
    },
    tauxDeVétustéConstruction: {
      dateMiseÀJourSource: "2022-02-02",
      valeur: 0.5319629026790017,
    },
  };

  private static budgetEtFinancesCaPaMédicoSocial: ÉtablissementTerritorialMédicoSocialBudgetEtFinances = {
    année: 2019,
    cadreBudgétaire: CadreBudgétaire.CA_PA,
    chargesEtProduits: {
      charges: -177631.38999999998,
      dateMiseÀJourSource: "2022-02-02",
      produits: 196518.51999999999,
    },
    contributionAuxFraisDeSiège: {
      dateMiseÀJourSource: "2022-02-02",
      valeur: null,
    },

    fondsDeRoulement: {
      dateMiseÀJourSource: "2022-02-02",
      valeur: null,
    },
    recettesEtDépenses: {
      dateMiseÀJourSource: "2022-02-02",
      dépensesGroupe1: null,
      dépensesGroupe2: null,
      dépensesGroupe3: null,
      recettesGroupe1: null,
      recettesGroupe2: null,
      recettesGroupe3: null,
    },
    résultatNetComptable: {
      dateMiseÀJourSource: "2022-02-02",
      valeur: 18887.12999999999,
    },
    tauxDeCafNette: {
      dateMiseÀJourSource: "2022-02-02",
      valeur: null,
    },
    tauxDeVétustéConstruction: {
      dateMiseÀJourSource: "2022-02-02",
      valeur: 0.31154835988672847,
    },
  };

  private static ressourcesHumainesMédicoSocial: ÉtablissementTerritorialMédicoSocialRessourcesHumaines = {
    année: 2019,
    nombreDEtpRéalisés: {
      dateMiseÀJourSource: "2022-02-02",
      valeur: 47.42,
    },
    nombreDeCddDeRemplacement: {
      dateMiseÀJourSource: "2022-02-02",
      valeur: 45,
    },
    tauxDAbsentéisme: {
      dateMiseÀJourSource: "2022-02-02",
      horsFormation: 0.0767,
      pourAccidentMaladieProfessionnelle: 0.0042,
      pourCongésSpéciaux: 0.022,
      pourMaladieCourteDurée: 0.0003,
      pourMaladieLongueDurée: 0.0381,
      pourMaladieMoyenneDurée: 0.0057,
      pourMaternitéPaternité: 0.0064,
    },
    tauxDEtpVacants: {
      dateMiseÀJourSource: "2022-02-02",
      valeur: 0.652,
    },
    tauxDePrestationsExternes: {
      dateMiseÀJourSource: "2022-02-02",
      valeur: 0.659,
    },
    tauxDeRotationDuPersonnel: {
      dateMiseÀJourSource: "2022-02-02",
      valeur: 0.667,
    },
  };

  private static qualite: ÉtablissementTerritorialQualite = {
    reclamations: [
      {
        "année": 2023,
        "dateMiseÀJourSource": "2022-02-02",
        "details": [
          {
            "clot": 1,
            "encours": 1,
            "motif": "MOTIF_10",
          },
          {
            "clot": 1,
            "encours": 1,
            "motif": "MOTIF_11",
          },
          {
            "clot": 1,
            "encours": 1,
            "motif": "MOTIF_12",
          },
          {
            "clot": 1,
            "encours": 1,
            "motif": "MOTIF_13",
          },
          {
            "clot": 1,
            "encours": 1,
            "motif": "MOTIF_14",
          },
          {
            "clot": 1,
            "encours": 1,
            "motif": "MOTIF_15",
          },
          {
            "clot": 1,
            "encours": 1,
            "motif": "MOTIF_16",
          },
          {
            "clot": 1,
            "encours": 1,
            "motif": "MOTIF_17",
          },
          {
            "clot": 1,
            "encours": 1,
            "motif": "MOTIF_18",
          },
          {
            "clot": 1,
            "encours": 1,
            "motif": "MOTIF_19",
          },
          {
            "clot": 1,
            "encours": 1,
            "motif": "MOTIF_155",
          },
          {
            "clot": 1,
            "encours": 1,
            "motif": "MOTIF_156",
          },
        ],
        "numéroFinessÉtablissementTerritorial": "010000040",
        "totalClotures": 12,
        "totalEncours": 12,
      },
    ],
    evenementsIndesirables: [
      {
        "dateMiseAJourSource": "2022-02-02",
        "evenementsClotures": [
          {
            "annee": 2023,
            "clotDate": null,
            "clotMotif": null,
            "est_EIGS": false,
            "etat": "CLOTURE",
            "famille": "Evènements indésirables/graves associés aux soins",
            "nature": "Maltraitance",
            "numeroSIVSS": "123456",
          }
        ],
        "evenementsEncours": [],
        "libelle": "Evènements indésirables/graves associés aux soins",
      }, {
        "dateMiseAJourSource": "2022-02-02",
        "evenementsEncours": [],
        "evenementsClotures": [],
        "libelle": "Evénements/incidents dans un établissement ou organisme",
      }
    ]
  }

  public static créeUneIdentitéMédicoSocial(champsSurchargés?: Partial<ÉtablissementTerritorialIdentité>): ÉtablissementTerritorialIdentité {
    return {
      ...ÉtablissementTerritorialTestBuilder.médicoSocial,
      ...champsSurchargés,
    };
  }

  public static créeUneIdentitéSanitaire(champsSurchargés?: Partial<ÉtablissementTerritorialIdentité>): ÉtablissementTerritorialIdentité {
    return {
      ...ÉtablissementTerritorialTestBuilder.sanitaire,
      ...champsSurchargés,
    };
  }

  public static créeUneActivitéMédicoSocial(
    champsSurchargés?: Partial<ÉtablissementTerritorialMédicoSocialActivité>
  ): ÉtablissementTerritorialMédicoSocialActivité {
    return {
      ...ÉtablissementTerritorialTestBuilder.activitéMédicoSocial,
      ...champsSurchargés,
    };
  }

  public static créeUneActivitéSanitaire(champsSurchargés?: Partial<ÉtablissementTerritorialSanitaireActivité>): ÉtablissementTerritorialSanitaireActivité {
    return {
      ...ÉtablissementTerritorialTestBuilder.activitéSanitaire,
      ...champsSurchargés,
    };
  }

  public static créeUneAutorisationMédicoSocial(
    champsSurchargés?: Partial<ÉtablissementTerritorialMédicoSocialAutorisationEtCapacité>
  ): ÉtablissementTerritorialMédicoSocialAutorisationEtCapacité {
    return {
      ...ÉtablissementTerritorialTestBuilder.autorisationMédicoSocial,
      ...champsSurchargés,
    };
  }

  public static créeUneAutorisationSanitaire(
    champsSurchargés?: Partial<ÉtablissementTerritorialSanitaireAutorisationEtCapacité>
  ): ÉtablissementTerritorialSanitaireAutorisationEtCapacité {
    return {
      ...ÉtablissementTerritorialTestBuilder.autorisationSanitaire,
      ...champsSurchargés,
    };
  }

  public static créeUnBlocBudgetEtFinancesErrdMédicoSocial(champsSurchargés?: Partial<ÉtablissementTerritorialMédicoSocialBudgetEtFinances>) {
    return {
      ...ÉtablissementTerritorialTestBuilder.budgetEtFinancesErrdMédicoSocial,
      ...champsSurchargés,
    };
  }

  public static créeUnBlocBudgetEtFinancesCaPhMédicoSocial(champsSurchargés?: Partial<ÉtablissementTerritorialMédicoSocialBudgetEtFinances>) {
    return {
      ...ÉtablissementTerritorialTestBuilder.budgetEtFinancesCaPhMédicoSocial,
      ...champsSurchargés,
    };
  }

  public static créeUnBlocBudgetEtFinancesCaPaMédicoSocial(champsSurchargés?: Partial<ÉtablissementTerritorialMédicoSocialBudgetEtFinances>) {
    return {
      ...ÉtablissementTerritorialTestBuilder.budgetEtFinancesCaPaMédicoSocial,
      ...champsSurchargés,
    };
  }

  public static créeUnBlocRessourcesHumainesMédicoSocial(champsSurchargés?: Partial<ÉtablissementTerritorialMédicoSocialRessourcesHumaines>) {
    return {
      ...ÉtablissementTerritorialTestBuilder.ressourcesHumainesMédicoSocial,
      ...champsSurchargés,
    };
  }

  public static créeUnBlocQualité(champsSurchargés?: Partial<ÉtablissementTerritorialQualite>) {
    return {
      ...ÉtablissementTerritorialTestBuilder.qualite,
      ...champsSurchargés,
    };
  }
}
