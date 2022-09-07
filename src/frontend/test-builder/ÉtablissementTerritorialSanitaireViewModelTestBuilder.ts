import { ÉtablissementTerritorialSanitaire } from '../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaire'
import { Paths } from '../configuration/Paths'
import { Wording } from '../configuration/wording/Wording'
import { ÉtablissementTerritorialSanitaireViewModel } from '../ui/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireViewModel'

export class ÉtablissementTerritorialSanitaireViewModelTestBuilder {
  public static identité: ÉtablissementTerritorialSanitaire['identité'] = {
    adresseAcheminement: {
      dateMiseÀJourSource: '2021-07-07',
      value: '01130 NANTUA',
    },
    adresseNuméroVoie: {
      dateMiseÀJourSource: '2021-07-07',
      value: '50',
    },
    adresseTypeVoie: {
      dateMiseÀJourSource: '2021-07-07',
      value: 'R',
    },
    adresseVoie: {
      dateMiseÀJourSource: '2021-07-07',
      value: 'PAUL PAINLEVE',
    },
    catégorieÉtablissement: {
      dateMiseÀJourSource: '2021-07-07',
      value: '355',
    },
    courriel: {
      dateMiseÀJourSource: '2021-07-07',
      value: 'a@example.com',
    },
    libelléCatégorieÉtablissement: {
      dateMiseÀJourSource: '2021-07-07',
      value: 'Centre Hospitalier (C.H.)',
    },
    numéroFinessEntitéJuridique: {
      dateMiseÀJourSource: '2021-07-07',
      value: '010008407',
    },
    numéroFinessÉtablissementPrincipal: {
      dateMiseÀJourSource: '2021-07-07',
      value: '010045057',
    },
    numéroFinessÉtablissementTerritorial: {
      dateMiseÀJourSource: '2021-07-07',
      value: '010000040',
    },
    raisonSociale: {
      dateMiseÀJourSource: '2021-07-07',
      value: 'CH NANTUA',
    },
    raisonSocialeDeLEntitéDeRattachement: {
      dateMiseÀJourSource: '2021-07-07',
      value: 'HOPITAL PRIVE DE VILLENEUVE DASCQ',
    },
    statutJuridique: {
      dateMiseÀJourSource: '2021-07-07',
      value: 'Société Anonyme (S.A.)',
    },
    typeÉtablissement: {
      dateMiseÀJourSource: '2021-07-07',
      value: 'S',
    },
    téléphone: {
      dateMiseÀJourSource: '2021-07-07',
      value: '0474754800',
    },
  }
  public static activités: ÉtablissementTerritorialSanitaire['activités'] = [
    {
      année: 2017,
      nombreDePassagesAuxUrgences: {
        dateMiseÀJourSource: '2021-07-07',
        value: 10,
      },
      nombreJournéesCompletePsy: {
        dateMiseÀJourSource: '2021-07-07',
        value: 10,
      },
      nombreJournéesCompletesSsr: {
        dateMiseÀJourSource: '2021-07-07',
        value: 10,
      },
      nombreJournéesPartiellesPsy: {
        dateMiseÀJourSource: '2021-07-07',
        value: 10,
      },
      nombreJournéesPartielsSsr: {
        dateMiseÀJourSource: '2021-07-07',
        value: 10,
      },
      nombreSéjoursCompletsChirurgie: {
        dateMiseÀJourSource: '2021-07-07',
        value: 10,
      },
      nombreSéjoursCompletsMédecine: {
        dateMiseÀJourSource: '2021-07-07',
        value: 10,
      },
      nombreSéjoursCompletsObstétrique: {
        dateMiseÀJourSource: '2021-07-07',
        value: 10,
      },
      nombreSéjoursPartielsChirurgie: {
        dateMiseÀJourSource: '2021-07-07',
        value: 10,
      },
      nombreSéjoursPartielsMédecine: {
        dateMiseÀJourSource: '2021-07-07',
        value: 10,
      },
      nombreSéjoursPartielsObstétrique: {
        dateMiseÀJourSource: '2021-07-07',
        value: 10,
      },
      numéroFinessÉtablissementTerritorial: '010000040',
    },
    {
      année: 2018,
      nombreDePassagesAuxUrgences: {
        dateMiseÀJourSource: '2021-07-07',
        value: 20,
      },
      nombreJournéesCompletePsy: {
        dateMiseÀJourSource: '2021-07-07',
        value: 20,
      },
      nombreJournéesCompletesSsr: {
        dateMiseÀJourSource: '2021-07-07',
        value: 20,
      },
      nombreJournéesPartiellesPsy: {
        dateMiseÀJourSource: '2021-07-07',
        value: 20,
      },
      nombreJournéesPartielsSsr: {
        dateMiseÀJourSource: '2021-07-07',
        value: 20,
      },
      nombreSéjoursCompletsChirurgie: {
        dateMiseÀJourSource: '2021-07-07',
        value: 20,
      },
      nombreSéjoursCompletsMédecine: {
        dateMiseÀJourSource: '2021-07-07',
        value: 20,
      },
      nombreSéjoursCompletsObstétrique: {
        dateMiseÀJourSource: '2021-07-07',
        value: 20,
      },
      nombreSéjoursPartielsChirurgie: {
        dateMiseÀJourSource: '2021-07-07',
        value: 20,
      },
      nombreSéjoursPartielsMédecine: {
        dateMiseÀJourSource: '2021-07-07',
        value: 20,
      },
      nombreSéjoursPartielsObstétrique: {
        dateMiseÀJourSource: '2021-07-07',
        value: 20,
      },
      numéroFinessÉtablissementTerritorial: '010000040',
    },
    {
      année: 2019,
      nombreDePassagesAuxUrgences: {
        dateMiseÀJourSource: '2021-07-07',
        value: 30,
      },
      nombreJournéesCompletePsy: {
        dateMiseÀJourSource: '2021-07-07',
        value: 30,
      },
      nombreJournéesCompletesSsr: {
        dateMiseÀJourSource: '2021-07-07',
        value: 30,
      },
      nombreJournéesPartiellesPsy: {
        dateMiseÀJourSource: '2021-07-07',
        value: 30,
      },
      nombreJournéesPartielsSsr: {
        dateMiseÀJourSource: '2021-07-07',
        value: 30,
      },
      nombreSéjoursCompletsChirurgie: {
        dateMiseÀJourSource: '2021-07-07',
        value: 30,
      },
      nombreSéjoursCompletsMédecine: {
        dateMiseÀJourSource: '2021-07-07',
        value: 30,
      },
      nombreSéjoursCompletsObstétrique: {
        dateMiseÀJourSource: '2021-07-07',
        value: 30,
      },
      nombreSéjoursPartielsChirurgie: {
        dateMiseÀJourSource: '2021-07-07',
        value: 30,
      },
      nombreSéjoursPartielsMédecine: {
        dateMiseÀJourSource: '2021-07-07',
        value: 30,
      },
      nombreSéjoursPartielsObstétrique: {
        dateMiseÀJourSource: '2021-07-07',
        value: 30,
      },
      numéroFinessÉtablissementTerritorial: '010000040',
    },
    {
      année: 2020,
      nombreDePassagesAuxUrgences: {
        dateMiseÀJourSource: '2021-07-07',
        value: 40,
      },
      nombreJournéesCompletePsy: {
        dateMiseÀJourSource: '2021-07-07',
        value: 40,
      },
      nombreJournéesCompletesSsr: {
        dateMiseÀJourSource: '2021-07-07',
        value: 40,
      },
      nombreJournéesPartiellesPsy: {
        dateMiseÀJourSource: '2021-07-07',
        value: 40,
      },
      nombreJournéesPartielsSsr: {
        dateMiseÀJourSource: '2021-07-07',
        value: 40,
      },
      nombreSéjoursCompletsChirurgie: {
        dateMiseÀJourSource: '2021-07-07',
        value: 40,
      },
      nombreSéjoursCompletsMédecine: {
        dateMiseÀJourSource: '2021-07-07',
        value: 40,
      },
      nombreSéjoursCompletsObstétrique: {
        dateMiseÀJourSource: '2021-07-07',
        value: 40,
      },
      nombreSéjoursPartielsChirurgie: {
        dateMiseÀJourSource: '2021-07-07',
        value: 40,
      },
      nombreSéjoursPartielsMédecine: {
        dateMiseÀJourSource: '2021-07-07',
        value: 40,
      },
      nombreSéjoursPartielsObstétrique: {
        dateMiseÀJourSource: '2021-07-07',
        value: 40,
      },
      numéroFinessÉtablissementTerritorial: '010000040',
    },
    {
      année: 2021,
      nombreDePassagesAuxUrgences: {
        dateMiseÀJourSource: '2021-07-07',
        value: 5000,
      },
      nombreJournéesCompletePsy: {
        dateMiseÀJourSource: '2021-07-07',
        value: 5000,
      },
      nombreJournéesCompletesSsr: {
        dateMiseÀJourSource: '2021-07-07',
        value: 5000,
      },
      nombreJournéesPartiellesPsy: {
        dateMiseÀJourSource: '2021-07-07',
        value: 5000,
      },
      nombreJournéesPartielsSsr: {
        dateMiseÀJourSource: '2021-07-07',
        value: 5000,
      },
      nombreSéjoursCompletsChirurgie: {
        dateMiseÀJourSource: '2021-07-07',
        value: 5000,
      },
      nombreSéjoursCompletsMédecine: {
        dateMiseÀJourSource: '2021-07-07',
        value: 5000,
      },
      nombreSéjoursCompletsObstétrique: {
        dateMiseÀJourSource: '2021-07-07',
        value: 5000,
      },
      nombreSéjoursPartielsChirurgie: {
        dateMiseÀJourSource: '2021-07-07',
        value: 5000,
      },
      nombreSéjoursPartielsMédecine: {
        dateMiseÀJourSource: '2021-07-07',
        value: 5000,
      },
      nombreSéjoursPartielsObstétrique: {
        dateMiseÀJourSource: '2021-07-07',
        value: 5000,
      },
      numéroFinessÉtablissementTerritorial: '010000040',
    },
  ]
  public static autorisationsEtCapacités: ÉtablissementTerritorialSanitaire['autorisationsEtCapacités'] = {
    autorisations: {
      activités: [
        {
          code:'16',
          libellé: "Traitement de l'insuffisance rénale chronique par épuration extrarénale",
          modalités : [
            {
              code: '42',
              formes: [
                {
                  autorisationSanitaire: {
                    dateDAutorisation: '2005-10-11',
                    dateDeFin: '2026-05-03',
                    dateDeMiseEnOeuvre: null,
                    numéroArhgos: '01-00-000',
                  },
                  code: '00',
                  libellé: 'Pas de forme',
                },
              ],
              libellé: 'Hémodialyse en unité médicalisée',
            },
          ],
        },
      ],
      dateMiseÀJourSource: '2022-08-29',
    },
    autresActivités: {
      activités: [
        {
          code:'A0',
          libellé: 'Installation de chirurgie esthétique',
          modalités : [
            {
              code: 'M2',
              formes: [
                {
                  autreActivitéSanitaire: {
                    dateDAutorisation: '2019-06-03',
                    dateDeFin: null,
                    dateDeMiseEnOeuvre: '2019-06-03',
                  },
                  code: '00',
                  libellé: 'Pas de forme',
                },
              ],
              libellé: 'Dépôt relais',
            },
          ],
        },
        {
          code:'A1',
          libellé: 'Dépôt de sang',
          modalités : [
            {
              code: 'M0',
              formes: [
                {
                  autreActivitéSanitaire: {
                    dateDAutorisation: '2019-06-03',
                    dateDeFin: '2024-08-31',
                    dateDeMiseEnOeuvre: '2019-06-03',
                  },
                  code: '00',
                  libellé: 'Pas de forme',
                },
                {
                  autreActivitéSanitaire: {
                    dateDAutorisation: '2019-06-03',
                    dateDeFin: '2024-08-31',
                    dateDeMiseEnOeuvre: '2019-06-03',
                  },
                  code: '15',
                  libellé: 'Forme non précisée',
                },
              ],
              libellé: "Dépôt d'urgence",
            },
            {
              code: '31',
              formes: [
                {
                  autreActivitéSanitaire: {
                    dateDAutorisation: '2019-06-03',
                    dateDeFin: '2024-08-31',
                    dateDeMiseEnOeuvre: '2019-06-03',
                  },
                  code: '00',
                  libellé: 'Pas de forme',
                },
              ],
              libellé: 'Multi-Organes',
            },
          ],
        },
      ],
      dateMiseÀJourSource: '2022-08-29',
    },
    capacités: {
      dateMiseÀJourSource: '2022-09-02',
      nombreDeLitsEnChirurgie: 10,
      nombreDeLitsEnMédecine: 20,
      nombreDeLitsEnObstétrique: 5,
      nombreDeLitsEnSsr: 2,
      nombreDeLitsEnUsld: 15,
      nombreDeLitsOuPlacesEnPsyHospitalisationComplète: 5,
      nombreDePlacesEnChirurgie: 20,
      nombreDePlacesEnMédecine: 50,
      nombreDePlacesEnObstétrique: 6,
      nombreDePlacesEnPsyHospitalisationPartielle: 13,
      nombreDePlacesEnSsr: 7,
    },
    numéroFinessÉtablissementTerritorial: '123456789',
    reconnaissancesContractuelles: {
      activités: [
        {
          code:'R7',
          libellé: 'Surveillance continue',
          modalités : [
            {
              code: 'N8',
              formes: [
                {
                  code: '01',
                  libellé: 'Hospitalisation complète (24 heures consécutives ou plus)',
                  reconnaissanceContractuelleSanitaire: {
                    capacitéAutorisée: 4,
                    dateDEffetAsr: '2013-11-30',
                    dateDEffetCpom: '2013-11-01',
                    dateDeFinCpom: '2018-11-30',
                    numéroArhgos: '18-00-RC00000',
                    numéroCpom: '18-00-C00000',
                  },
                },
              ],
              libellé: 'USC polyvalente - adulte (non adossée à une unité de réanimation)',
            },
          ],
        },
      ],
      dateMiseÀJourSource: '2022-08-29',
    },
    équipementsMatérielsLourds: {
      dateMiseÀJourSource: '2022-08-29',
      équipements: [
        {
          autorisations : [
            {
              dateDAutorisation: '2006-05-02',
              dateDeFin: '2027-02-16',
              dateDeMiseEnOeuvre: '2009-01-20',
              numéroArhgos: '01-00-0000',
            },
          ],
          code:'06201',
          libellé: "Appareil d'IRM à utilisation clinique",
        },
      ],
    },
  }

  public static crée(
    wording: Wording, paths: Paths, champsSurchargés?: Partial<ÉtablissementTerritorialSanitaire['identité']>
  ): ÉtablissementTerritorialSanitaireViewModel {
    return new ÉtablissementTerritorialSanitaireViewModel({
      activités: ÉtablissementTerritorialSanitaireViewModelTestBuilder.activités,
      autorisationsEtCapacités: ÉtablissementTerritorialSanitaireViewModelTestBuilder.autorisationsEtCapacités,
      identité: {
        ...ÉtablissementTerritorialSanitaireViewModelTestBuilder.identité,
        ...champsSurchargés,
      },
    }, wording, paths)
  }
}
