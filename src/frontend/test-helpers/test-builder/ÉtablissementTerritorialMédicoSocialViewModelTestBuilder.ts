import { CatégorisationEnum } from "../../../backend/métier/entities/entité-juridique/EntitéJuridique";
import { CadreBudgétaire } from "../../../backend/métier/entities/établissement-territorial-médico-social/CadreBudgétaire";
import { ÉtablissementTerritorialMédicoSocial } from "../../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocial";
import { ÉtablissementTerritorialMédicoSocialBudgetEtFinances } from "../../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialBudgetEtFinances";
import { ÉtablissementTerritorialMédicoSocialRessourcesHumaines } from "../../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialRessourcesHumaines";
import { Paths } from "../../configuration/Paths";
import { Wording } from "../../configuration/wording/Wording";
import { EtablissementTerritorialMedicoSocialViewModel } from "../../ui/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialViewModel";
import { annéeEnCours } from "../testHelper";

const autorisationsMockData = {
  budgetEtFinance: {
    tauxDeCafNette: "ok",
    compteRésultats: "ok",
    résultatNetComptable: "ok",
    ratioDépendanceFinancière: "ok",
    allocationDeRessources: "ok",
  },
  budgetEtFinances: {
    tauxDeCafNette: "ok",
    compteRésultats: "ok",
    fondsDeRoulement: "ok",
    résultatNetComptable: "ok",
    tauxDeVétustéConstruction: "ok",
    contributionAuxFraisDeSiège: "ok",
  },
};

export class ÉtablissementTerritorialMédicoSocialViewModelTestBuilder {
  public static readonly identité: ÉtablissementTerritorialMédicoSocial["identité"] = {
    adresseAcheminement: {
      dateMiseÀJourSource: "2021-07-07",
      value: "01117 OYONNAX CEDEX",
    },
    adresseNuméroVoie: {
      dateMiseÀJourSource: "2021-07-07",
      value: "1",
    },
    adresseTypeVoie: {
      dateMiseÀJourSource: "2021-07-07",
      value: "RTE",
    },
    adresseVoie: {
      dateMiseÀJourSource: "2021-07-07",
      value: "DE VEYZIAT",
    },
    catégorieÉtablissement: {
      dateMiseÀJourSource: "2021-07-07",
      value: "300",
    },
    codeModeTarification: {
      dateMiseÀJourSource: "2021-07-07",
      value: "03",
    },
    courriel: {
      dateMiseÀJourSource: "2021-07-07",
      value: "a@example.com",
    },
    dateDEntréeEnVigueurDuCpom: {
      dateMiseÀJourSource: "2021-07-08",
      value: "2021-01-01",
    },
    estMonoÉtablissement: {
      dateMiseÀJourSource: "2021-07-07",
      value: false,
    },
    libelléCatégorieÉtablissement: {
      dateMiseÀJourSource: "2021-07-07",
      value: "Ecoles Formant aux Professions Sanitaires",
    },
    libelléModeTarification: {
      dateMiseÀJourSource: "2021-07-07",
      value: "ARS établissements Publics de santé dotation globale",
    },
    numéroFinessEntitéJuridique: {
      dateMiseÀJourSource: "2021-07-07",
      value: "010008407",
    },
    numéroFinessÉtablissementPrincipal: {
      dateMiseÀJourSource: "2021-07-07",
      value: "010005239",
    },
    numéroFinessÉtablissementTerritorial: {
      dateMiseÀJourSource: "2021-07-07",
      value: "010003598",
    },
    raisonSociale: {
      dateMiseÀJourSource: "2021-07-07",
      value: "IFAS CH DU HAUT BUGEY",
    },
    raisonSocialeCourte: {
      dateMiseÀJourSource: "2021-07-07",
      value: "CH DU HAUT BUGEY",
    },
    raisonSocialeDeLEntitéDeRattachement: {
      dateMiseÀJourSource: "2021-07-07",
      value: "CH DU HAUT BUGEY",
    },
    siret: {
      dateMiseÀJourSource: "2021-07-07",
      value: "26011021800096",
    },
    statutJuridique: {
      dateMiseÀJourSource: "2021-07-07",
      value: "Etablissement Public Intercommunal d’Hospitalisation",
    },
    categorisationDeLEntitéDeRattachement: {
      dateMiseÀJourSource: "2021-07-07",
      value: CatégorisationEnum.PUBLIC,
    },
    typeÉtablissement: {
      dateMiseÀJourSource: "2021-07-07",
      value: "S",
    },
    téléphone: {
      dateMiseÀJourSource: "2021-07-07",
      value: "0123456789",
    },
    dateOuverture: {
      dateMiseÀJourSource: "2022-02-02",
      value: "2001-01-01",
    },
    codeRegion: '84',
    domaineÉtablissementPrincipal: 'Médico-social',
  };

  public static readonly activités: ÉtablissementTerritorialMédicoSocial["activités"] = [
    {
      année: 2020,
      duréeMoyenneSéjourAccompagnementPersonnesSorties: {
        dateMiseÀJourSource: "2021-07-07",
        value: 1013,
      },
      fileActivePersonnesAccompagnées: {
        dateMiseÀJourSource: "2021-07-07",
        value: 340,
      },
      nombreMoyenJournéesAbsencePersonnesAccompagnées: {
        dateMiseÀJourSource: "2021-07-07",
        value: 87,
      },
      numéroFinessÉtablissementTerritorial: "010003598",
      tauxOccupationAccueilDeJour: {
        dateMiseÀJourSource: "2021-07-07",
        value: 0.004,
      },
      tauxOccupationHébergementPermanent: {
        dateMiseÀJourSource: "2021-07-07",
        value: 0.944,
      },
      tauxOccupationHébergementTemporaire: {
        dateMiseÀJourSource: "2021-07-07",
        value: 0.704,
      },
      tauxRéalisationActivité: {
        dateMiseÀJourSource: "2021-07-07",
        value: 1.004,
      },
      tauxOccupationExternat: {
        value: 0.725,
      },
      tauxOccupationSemiInternat: {
        value: 0.952,
      },
      tauxOccupationInternat: {
        value: 0.965,
      },
      tauxOccupationAutre: {
        value: 0.495,
      },
      tauxOccupationSeances: {
        value: 0.562,
      },
    },
    {
      année: 2021,
      duréeMoyenneSéjourAccompagnementPersonnesSorties: {
        dateMiseÀJourSource: "2021-07-07",
        value: 994,
      },
      fileActivePersonnesAccompagnées: {
        dateMiseÀJourSource: "2021-07-07",
        value: 280,
      },
      nombreMoyenJournéesAbsencePersonnesAccompagnées: {
        dateMiseÀJourSource: "2021-07-07",
        value: 90,
      },
      numéroFinessÉtablissementTerritorial: "010003598",
      tauxOccupationAccueilDeJour: {
        dateMiseÀJourSource: "2021-07-07",
        value: 0.155,
      },
      tauxOccupationHébergementPermanent: {
        dateMiseÀJourSource: "2021-07-07",
        value: 0.975,
      },
      tauxOccupationHébergementTemporaire: {
        dateMiseÀJourSource: "2021-07-07",
        value: 1.215,
      },
      tauxRéalisationActivité: {
        dateMiseÀJourSource: "2021-07-07",
        value: 0.945,
      },
      tauxOccupationExternat: {
        value: 0.526,
      },
      tauxOccupationSemiInternat: {
        value: 0.857,
      },
      tauxOccupationInternat: {
        value: 0.966,
      },
      tauxOccupationAutre: {
        value: 0.756,
      },
      tauxOccupationSeances: {
        value: 0.634,
      },
    },
    {
      année: 2022,
      duréeMoyenneSéjourAccompagnementPersonnesSorties: {
        dateMiseÀJourSource: "2021-07-07",
        value: 990,
      },
      fileActivePersonnesAccompagnées: {
        dateMiseÀJourSource: "2021-07-07",
        value: 300,
      },
      nombreMoyenJournéesAbsencePersonnesAccompagnées: {
        dateMiseÀJourSource: "2021-07-07",
        value: 22,
      },
      numéroFinessÉtablissementTerritorial: "010003598",
      tauxOccupationAccueilDeJour: {
        dateMiseÀJourSource: "2021-07-07",
        value: 0.206,
      },
      tauxOccupationHébergementPermanent: {
        dateMiseÀJourSource: "2021-07-07",
        value: 1.016,
      },
      tauxOccupationHébergementTemporaire: {
        dateMiseÀJourSource: "2021-07-07",
        value: 0.676,
      },
      tauxRéalisationActivité: {
        dateMiseÀJourSource: "2021-07-07",
        value: 0.966,
      },
      tauxOccupationExternat: {
        value: 0.526,
      },
      tauxOccupationSemiInternat: {
        value: 0.857,
      },
      tauxOccupationInternat: {
        value: 0.966,
      },
      tauxOccupationAutre: {
        value: 0.756,
      },
      tauxOccupationSeances: {
        value: 0.634,
      },
    },
  ];

  public static readonly autorisations: ÉtablissementTerritorialMédicoSocial["autorisationsEtCapacités"] = {
    autorisations: {
      dateMiseÀJourSource: "2022-08-18",
      disciplines: [
        {
          activités: [
            {
              clientèles: [
                {
                  code: "702",
                  datesEtCapacités: {
                    capacitéAutoriséeTotale: 10,
                    capacitéInstalléeTotale: 0,
                    dateDAutorisation: "2020-01-01",
                    dateDeDernièreInstallation: null,
                    dateDeMiseÀJourDAutorisation: "2020-01-01",
                    estInstallée: true,
                  },
                  libellé: "PH vieillissantes",
                },
                {
                  code: "711",
                  datesEtCapacités: {
                    capacitéAutoriséeTotale: 10,
                    capacitéInstalléeTotale: 10,
                    dateDAutorisation: "2020-01-01",
                    dateDeDernièreInstallation: "2020-01-01",
                    dateDeMiseÀJourDAutorisation: "2020-01-01",
                    estInstallée: true,
                  },
                  libellé: "P.A. dépendantes",
                },
              ],
              code: "11",
              libellé: "Hébergement Complet Internat",
            },
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
              code: "16",
              libellé: "Prestation en milieu ordinaire",
            },
          ],
          code: "657",
          libellé: "Accueil temporaire pour Personnes Âgées",
        },
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
        {
          capacité: 10,
          libellé: "Hébergement Complet Internat",
        },
        {
          capacité: 10,
          libellé: "Prestation en milieu ordinaire",
        },
      ],
      dateMiseÀJourSource: "2022-08-19",
    },
    numéroFinessÉtablissementTerritorial: "010003598",
  };

  public static readonly budgetEtFinances: ÉtablissementTerritorialMédicoSocial["budgetEtFinances"] = [
    {
      année: 2020,
      cadreBudgétaire: CadreBudgétaire.ERRD,
      chargesEtProduits: {
        charges: null,
        dateMiseÀJourSource: "2022-01-01",
        produits: null,
      },
      contributionAuxFraisDeSiège: {
        dateMiseÀJourSource: "2022-01-01",
        valeur: -30000,
      },
      fondsDeRoulement: {
        dateMiseÀJourSource: "2022-01-01",
        valeur: 2206969.2599999998,
      },
      recettesEtDépenses: {
        dateMiseÀJourSource: "2022-01-01",
        dépensesGroupe1: -129491.19,
        dépensesGroupe2: -2718457.1600000001,
        dépensesGroupe3: -406469.14999999997,
        recettesGroupe1: 3388394.2000000002,
        recettesGroupe2: 22231.200000000001,
        recettesGroupe3: 129491.19,
      },
      résultatNetComptable: {
        dateMiseÀJourSource: "2022-01-01",
        valeur: -38330.669999999503,
      },
      tauxDeCafNette: {
        dateMiseÀJourSource: "2022-01-01",
        valeur: 0.3833016699999,
      },
      tauxDeVétustéConstruction: {
        dateMiseÀJourSource: "2022-01-01",
        valeur: 0.31154835988672847,
      },
    },
    {
      année: 2021,
      cadreBudgétaire: CadreBudgétaire.ERRD,
      chargesEtProduits: {
        charges: null,
        dateMiseÀJourSource: "2022-01-01",
        produits: null,
      },
      contributionAuxFraisDeSiège: {
        dateMiseÀJourSource: "2022-01-01",
        valeur: -20000,
      },
      fondsDeRoulement: {
        dateMiseÀJourSource: "2022-01-01",
        valeur: 3988284.4100000001,
      },
      recettesEtDépenses: {
        dateMiseÀJourSource: "2022-01-01",
        dépensesGroupe1: -105389.53,
        dépensesGroupe2: -506251.12999999995,
        dépensesGroupe3: -88214.989999999991,
        recettesGroupe1: 628872.06999999995,
        recettesGroupe2: 46843.479999999996,
        recettesGroupe3: 27174.48,
      },
      résultatNetComptable: {
        dateMiseÀJourSource: "2022-01-01",
        valeur: 3034.3799999998928,
      },
      tauxDeCafNette: {
        dateMiseÀJourSource: "2022-01-01",
        valeur: 0.16460754444264256,
      },
      tauxDeVétustéConstruction: {
        dateMiseÀJourSource: "2022-01-01",
        valeur: 0.5319629026790017,
      },
    },
    {
      année: 2022,
      cadreBudgétaire: CadreBudgétaire.ERRD,
      chargesEtProduits: {
        charges: null,
        dateMiseÀJourSource: "2022-01-01",
        produits: null,
      },
      contributionAuxFraisDeSiège: {
        dateMiseÀJourSource: "2022-01-01",
        valeur: -10000,
      },
      fondsDeRoulement: {
        dateMiseÀJourSource: "2022-01-01",
        valeur: 1057217.9299999999,
      },
      recettesEtDépenses: {
        dateMiseÀJourSource: "2022-01-01",
        dépensesGroupe1: -161786,
        dépensesGroupe2: -1222576.5799999998,
        dépensesGroupe3: -8432.5499999999993,
        recettesGroupe1: 1376744.76,
        recettesGroupe2: 23340.290000000001,
        recettesGroupe3: 0,
      },
      résultatNetComptable: {
        dateMiseÀJourSource: "2022-01-01",
        valeur: 7289.9200000003912,
      },
      tauxDeCafNette: {
        dateMiseÀJourSource: "2022-01-01",
        valeur: 0.13548734436644624,
      },
      tauxDeVétustéConstruction: {
        dateMiseÀJourSource: "2022-01-01",
        valeur: 0.38845089702004892,
      },
    }

  ];

  public static readonly ressourcesHumaines: ÉtablissementTerritorialMédicoSocial["ressourcesHumaines"] = [
    {
      année: 2019,
      nombreDEtpRéalisés: {
        dateMiseÀJourSource: "2022-06-06",
        valeur: 47.42,
      },
      nombreDeCddDeRemplacement: {
        dateMiseÀJourSource: "2022-10-10",
        valeur: 45,
      },
      tauxDAbsentéisme: {
        dateMiseÀJourSource: "2022-10-10",
        horsFormation: 0.0767,
        pourAccidentMaladieProfessionnelle: 0.0042,
        pourCongésSpéciaux: 0.022,
        pourMaladieCourteDurée: 0.0003,
        pourMaladieLongueDurée: 0.0381,
        pourMaladieMoyenneDurée: 0.0057,
        pourMaternitéPaternité: 0.0064,
      },
      tauxDEtpVacants: {
        dateMiseÀJourSource: "2022-10-10",
        valeur: 0.652,
      },
      tauxDePrestationsExternes: {
        dateMiseÀJourSource: "2022-10-10",
        valeur: 0.659,
      },
      tauxDeRotationDuPersonnel: {
        dateMiseÀJourSource: "2022-10-10",
        valeur: 0.667,
      },
    },
    {
      année: 2020,
      nombreDEtpRéalisés: {
        dateMiseÀJourSource: "2022-06-06",
        valeur: 9.71,
      },
      nombreDeCddDeRemplacement: {
        dateMiseÀJourSource: "2022-10-10",
        valeur: 4,
      },
      tauxDAbsentéisme: {
        dateMiseÀJourSource: "2022-10-10",
        horsFormation: 0.1329,
        pourAccidentMaladieProfessionnelle: 0.0038,
        pourCongésSpéciaux: 0.006,
        pourMaladieCourteDurée: 0.0068,
        pourMaladieLongueDurée: 0.078,
        pourMaladieMoyenneDurée: 0.0109,
        pourMaternitéPaternité: 0.0273,
      },
      tauxDEtpVacants: {
        dateMiseÀJourSource: "2022-10-10",
        valeur: 0.1642,
      },
      tauxDePrestationsExternes: {
        dateMiseÀJourSource: "2022-10-10",
        valeur: 0.2322,
      },
      tauxDeRotationDuPersonnel: {
        dateMiseÀJourSource: "2022-10-10",
        valeur: 0.3438,
      },
    },
    {
      année: 2021,
      nombreDEtpRéalisés: {
        dateMiseÀJourSource: "2022-06-06",
        valeur: 10.44,
      },
      nombreDeCddDeRemplacement: {
        dateMiseÀJourSource: "2022-10-10",
        valeur: 3,
      },
      tauxDAbsentéisme: {
        dateMiseÀJourSource: "2022-10-10",
        horsFormation: 0.2734,
        pourAccidentMaladieProfessionnelle: 0.0,
        pourCongésSpéciaux: 0.1156,
        pourMaladieCourteDurée: 0.0054,
        pourMaladieLongueDurée: 0.043,
        pourMaladieMoyenneDurée: 0.0182,
        pourMaternitéPaternité: 0.0911,
      },
      tauxDEtpVacants: {
        dateMiseÀJourSource: "2022-10-10",
        valeur: 0.1334,
      },
      tauxDePrestationsExternes: {
        dateMiseÀJourSource: "2022-10-10",
        valeur: 0.0931,
      },
      tauxDeRotationDuPersonnel: {
        dateMiseÀJourSource: "2022-10-10",
        valeur: 0.1471,
      },
    },
  ];

  public static readonly qualite: ÉtablissementTerritorialMédicoSocial["qualite"] = {
    reclamations: [
      {
        numéroFinessÉtablissementTerritorial: '010005239',
        année: 2021,
        totalClotures: 2,
        totalEncours: 1,
        dateMiseÀJourSource: '2024-03-15',
        details: [{
          motif: 'Hôtellerie-locaux-restauration',
          clot: 2,
          encours: 1,
        }]
      }
    ],
    evenementsIndesirables: [{
      libelle: 'Evènements indésirables/graves associés aux soins',
      evenementsEncours: [],
      evenementsClotures: [{
        famille: 'Evènements indésirables/graves associés aux soins',
        nature: 'Maltraitance',
        numeroSIVSS: 123456,
        annee: 2021,
        etat: 'CLOTURE',
        clotDate: 2019,
        clotMotif: 'motif de test',
        est_EIGS: true
      }],
      dateMiseAJourSource: '2024-03-15'
    }, {
      libelle: 'Evénements/incidents dans un établissement ou organisme',
      evenementsEncours: [],
      evenementsClotures: [],
      dateMiseAJourSource: '2024-03-15'
    }],
    inspectionsEtControles: { dateMiseAJourSource: '2023-02-02', inspectionsEtControles: [] }
  };

  public static vigierh: ÉtablissementTerritorialMédicoSocial["vigieRh"] = {
    pyramideAges: [
      {
        annee: 2024,
        trancheLibelle: "15-20",
        effectifHomme: 20,
        effectifFemme: 23,
        effectifHommeRef: 11,
        effectifFemmeRef: 18
      }
    ],
    tranchesAgesLibelles: [],
    professionFiliere:
    {
      dateDeMiseAJour: "10-10-2020",
      data: [
        {
          categorie: "test",
          dataCategorie: [{
            annee: 2020,
            mois: 2,
            effectifFiliere: 20,
            effectifEtab: 25,
          }]
        }
      ]
    },
    departsEmbauches: [{
      annee: 2025,
      depart: 12,
      departRef: 12,
      embauche: 12,
      embaucheRef: 12,
    }],
    departsEmbauchesTrimestriels: [
      {
        annee: 2025,
        trimestre: 1,
        depart: 12,
        departRef: 12,
        embauche: 12,
        embaucheRef: 12,
      }
    ]
  };

  public static crée(
    wording: Wording,
    paths: Paths,
    champsSurchargés?: Partial<ÉtablissementTerritorialMédicoSocial["identité"]>
  ): EtablissementTerritorialMedicoSocialViewModel {
    return new EtablissementTerritorialMedicoSocialViewModel(
      {
        activités: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.activités,
        autorisationsEtCapacités: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.autorisations,
        budgetEtFinances: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.budgetEtFinances,
        qualite: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.qualite,
        vigieRh: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.vigierh,
        identité: {
          ...ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.identité,
          ...champsSurchargés,
        },
        ressourcesHumaines: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.ressourcesHumaines,
        autorisations: autorisationsMockData,
      },
      wording,
      paths,
      autorisationsMockData
    );
  }

  public static créeUneAnnéeBudgetEtFinancesErrd(
    champsSurchargés?: Partial<ÉtablissementTerritorialMédicoSocialBudgetEtFinances>
  ): ÉtablissementTerritorialMédicoSocialBudgetEtFinances {
    return {
      année: 2019,
      cadreBudgétaire: CadreBudgétaire.ERRD,
      chargesEtProduits: {
        charges: null,
        dateMiseÀJourSource: "2022-01-01",
        produits: null,
      },
      contributionAuxFraisDeSiège: {
        dateMiseÀJourSource: "2022-01-01",
        valeur: -20000,
      },
      fondsDeRoulement: {
        dateMiseÀJourSource: "2022-03-03",
        valeur: 2206969.2599999998,
      },
      recettesEtDépenses: {
        dateMiseÀJourSource: "2022-01-01",
        dépensesGroupe1: -129491.19,
        dépensesGroupe2: -2718457.1600000001,
        dépensesGroupe3: -406469.14999999997,
        recettesGroupe1: 3388394.2000000002,
        recettesGroupe2: 22231.200000000001,
        recettesGroupe3: 129491.19,
      },
      résultatNetComptable: {
        dateMiseÀJourSource: "2022-01-01",
        valeur: -38330.669999999503,
      },
      tauxDeCafNette: {
        dateMiseÀJourSource: "2022-03-03",
        valeur: 0.13548734436644624,
      },
      tauxDeVétustéConstruction: {
        dateMiseÀJourSource: "2022-03-03",
        valeur: 0.38845089702004892,
      },
      ...champsSurchargés,
    };
  }

  public static créeUneAnnéeBudgetEtFinancesCaPh(
    champsSurchargés?: Partial<ÉtablissementTerritorialMédicoSocialBudgetEtFinances>
  ): ÉtablissementTerritorialMédicoSocialBudgetEtFinances {
    return {
      année: 2019,
      cadreBudgétaire: CadreBudgétaire.CA_PH,
      chargesEtProduits: {
        charges: null,
        dateMiseÀJourSource: "2022-02-02",
        produits: null,
      },
      contributionAuxFraisDeSiège: {
        dateMiseÀJourSource: "2022-01-01",
        valeur: null,
      },
      fondsDeRoulement: {
        dateMiseÀJourSource: "2022-03-03",
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
      ...champsSurchargés,
    };
  }

  public static créeUneAnnéeBudgetEtFinancesCaPa(
    champsSurchargés?: Partial<ÉtablissementTerritorialMédicoSocialBudgetEtFinances>
  ): ÉtablissementTerritorialMédicoSocialBudgetEtFinances {
    return {
      année: annéeEnCours - 3,
      cadreBudgétaire: CadreBudgétaire.CA_PA,
      chargesEtProduits: {
        charges: -1613142.1299999997,
        dateMiseÀJourSource: "2022-01-01",
        produits: 1633422.2000000002,
      },
      contributionAuxFraisDeSiège: {
        dateMiseÀJourSource: "2022-01-01",
        valeur: -20000,
      },
      fondsDeRoulement: {
        dateMiseÀJourSource: "2022-03-03",
        valeur: 2206969.2599999998,
      },
      recettesEtDépenses: {
        dateMiseÀJourSource: "2022-01-01",
        dépensesGroupe1: null,
        dépensesGroupe2: null,
        dépensesGroupe3: null,
        recettesGroupe1: null,
        recettesGroupe2: null,
        recettesGroupe3: null,
      },
      résultatNetComptable: {
        dateMiseÀJourSource: "2022-01-01",
        valeur: -38330.669999999503,
      },
      tauxDeCafNette: {
        dateMiseÀJourSource: "2022-03-03",
        valeur: 0.13548734436644624,
      },
      tauxDeVétustéConstruction: {
        dateMiseÀJourSource: "2022-03-03",
        valeur: 0.38845089702004892,
      },
      ...champsSurchargés,
    };
  }

  public static créeUneAnnéeRessourcesHumaines(
    champsSurchargés?: Partial<ÉtablissementTerritorialMédicoSocialRessourcesHumaines>
  ): ÉtablissementTerritorialMédicoSocialRessourcesHumaines {
    return {
      ...ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.ressourcesHumaines[1],
      ...champsSurchargés,
    };
  }
}
