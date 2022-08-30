import { ÉtablissementTerritorialMédicoSocialActivité } from '../métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialActivité'
import { ÉtablissementTerritorialMédicoSocialAutorisationEtCapacité } from '../métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialAutorisation'
import { ÉtablissementTerritorialSanitaireActivité } from '../métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireActivité'
import { ÉtablissementTerritorialSanitaireAutorisationEtCapacité } from '../métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireAutorisation'
import { ÉtablissementTerritorialIdentité } from '../métier/entities/ÉtablissementTerritorialIdentité'

export class ÉtablissementTerritorialTestBuilder {
  private static médicoSocial: ÉtablissementTerritorialIdentité = {
    adresseAcheminement: {
      dateMiseÀJourSource: '2022-05-14',
      value: '01130 NANTUA',
    },
    adresseNuméroVoie: {
      dateMiseÀJourSource: '2022-05-14',
      value: '50',
    },
    adresseTypeVoie: {
      dateMiseÀJourSource: '2022-05-14',
      value: 'R',
    },
    adresseVoie: {
      dateMiseÀJourSource: '2022-05-14',
      value: 'PAUL PAINLEVE',
    },
    catégorieÉtablissement: {
      dateMiseÀJourSource: '2022-05-14',
      value: '159',
    },
    courriel: {
      dateMiseÀJourSource: '2022-05-14',
      value: 'a@example.com',
    },
    libelléCatégorieÉtablissement: {
      dateMiseÀJourSource: '2022-05-14',
      value: 'Centre Hospitalier (C.H.)',
    },
    numéroFinessEntitéJuridique: {
      dateMiseÀJourSource: '2022-05-14',
      value: '010008407',
    },
    numéroFinessÉtablissementPrincipal: {
      dateMiseÀJourSource: '2022-05-14',
      value: '010018407',
    },
    numéroFinessÉtablissementTerritorial: {
      dateMiseÀJourSource: '2022-05-14',
      value: '010000040',
    },
    raisonSociale: {
      dateMiseÀJourSource: '2022-05-14',
      value: 'CENTRE HOSPITALIER NANTUA',
    },
    typeÉtablissement: {
      dateMiseÀJourSource: '2022-05-14',
      value: 'S',
    },
    téléphone: {
      dateMiseÀJourSource: '2022-05-14',
      value: '0102030405',
    },
  }

  private static sanitaire: ÉtablissementTerritorialIdentité = {
    adresseAcheminement: {
      dateMiseÀJourSource: '2022-05-14',
      value: '59650 VILLENEUVE D ASCQ',
    },
    adresseNuméroVoie: {
      dateMiseÀJourSource: '2022-05-14',
      value: '20',
    },
    adresseTypeVoie: {
      dateMiseÀJourSource: '2022-05-14',
      value: 'AV',
    },
    adresseVoie: {
      dateMiseÀJourSource: '2022-05-14',
      value: 'DE LA RECONNAISSANCE',
    },
    catégorieÉtablissement: {
      dateMiseÀJourSource: '2022-05-14',
      value: '365',
    },
    courriel: {
      dateMiseÀJourSource: '2022-05-14',
      value: 'b@example.com',
    },
    libelléCatégorieÉtablissement: {
      dateMiseÀJourSource: '2022-05-14',
      value: 'Centre Hospitalier (C.H.)',
    },
    numéroFinessEntitéJuridique: {
      dateMiseÀJourSource: '2022-05-14',
      value: '590000741',
    },
    numéroFinessÉtablissementPrincipal: {
      dateMiseÀJourSource: '2022-05-14',
      value: '',
    },
    numéroFinessÉtablissementTerritorial: {
      dateMiseÀJourSource: '2022-05-14',
      value: '590782553',
    },
    raisonSociale: {
      dateMiseÀJourSource: '2022-05-14',
      value: 'HOPITAL PRIVE DE VILLENEUVE DASCQ',
    },
    typeÉtablissement: {
      dateMiseÀJourSource: '2022-05-14',
      value: 'P',
    },
    téléphone: {
      dateMiseÀJourSource: '2022-05-14',
      value: '0102030406',
    },
  }

  private static activitéMédicoSocial: ÉtablissementTerritorialMédicoSocialActivité = {
    année: 2019,
    duréeMoyenneSéjourAccompagnementPersonnesSorties: {
      dateMiseÀJourSource: '2022-05-14',
      value: 80,
    },
    fileActivePersonnesAccompagnées: {
      dateMiseÀJourSource: '2022-05-14',
      value: 80,
    },
    nombreMoyenJournéesAbsencePersonnesAccompagnées: {
      dateMiseÀJourSource: '2022-05-14',
      value: 80,
    },
    numéroFinessÉtablissementTerritorial: '123456789',
    tauxOccupationAccueilDeJour: {
      dateMiseÀJourSource: '2022-05-15',
      value: 80,
    },
    tauxOccupationHébergementPermanent: {
      dateMiseÀJourSource: '2022-05-15',
      value: 80,
    },
    tauxOccupationHébergementTemporaire: {
      dateMiseÀJourSource: '2022-05-15',
      value: 80,
    },
    tauxRéalisationActivité: {
      dateMiseÀJourSource: '2022-05-14',
      value: 80,
    },
  }

  private static activitéSanitaire: ÉtablissementTerritorialSanitaireActivité = {
    année: 2016,
    nombreDePassagesAuxUrgences: {
      dateMiseÀJourSource: '2022-05-15',
      value: 60_000,
    },
    nombreJournéesCompletePsy: {
      dateMiseÀJourSource: '2022-05-14',
      value: 60,
    },
    nombreJournéesCompletesSsr: {
      dateMiseÀJourSource: '2022-05-14',
      value: 60,
    },
    nombreJournéesPartiellesPsy: {
      dateMiseÀJourSource: '2022-05-14',
      value: 60,
    },
    nombreJournéesPartielsSsr: {
      dateMiseÀJourSource: '2022-05-14',
      value: 60,
    },
    nombreSéjoursCompletsChirurgie: {
      dateMiseÀJourSource: '2022-05-14',
      value: 60,
    },
    nombreSéjoursCompletsMédecine: {
      dateMiseÀJourSource: '2022-05-14',
      value: 60,
    },
    nombreSéjoursCompletsObstétrique: {
      dateMiseÀJourSource: '2022-05-14',
      value: 60,
    },
    nombreSéjoursPartielsChirurgie: {
      dateMiseÀJourSource: '2022-05-14',
      value: 60,
    },
    nombreSéjoursPartielsMédecine: {
      dateMiseÀJourSource: '2022-05-14',
      value: 60,
    },
    nombreSéjoursPartielsObstétrique: {
      dateMiseÀJourSource: '2022-05-14',
      value: 60,
    },
    numéroFinessÉtablissementTerritorial: '123456789',
  }

  private static autorisationMédicoSocial: ÉtablissementTerritorialMédicoSocialAutorisationEtCapacité = {
    autorisations: {
      dateMiseÀJourSource: '2022-05-14',
      disciplines: [
        {
          activités: [
            {
              clientèles: [
                {
                  code: '010',
                  datesEtCapacités: {
                    capacitéAutoriséeTotale: 10,
                    capacitéInstalléeTotale: 10,
                    dateDAutorisation: '2020-01-01',
                    dateDeDernièreInstallation: '2020-01-01',
                    dateDeMiseÀJourDAutorisation: '2020-01-01',
                    estInstallée: true,
                  },
                  libellé: 'Tous Types de Déficiences Pers.Handicap.(sans autre indic.)',
                },
              ],
              code: '21',
              libellé: 'Accueil de Jour',
            },
          ],
          code: '658',
          libellé: 'Accueil temporaire pour adultes handicapés',
        },
      ],
    },
    capacités: {
      capacitéParActivité: [
        {
          capacité: 10,
          libellé: 'Accueil de Jour',
        },
      ],
      dateMiseÀJourSource: '2022-08-18',
    },
    numéroFinessÉtablissementTerritorial: '123456789',
  }

  private static autorisationSanitaire: ÉtablissementTerritorialSanitaireAutorisationEtCapacité = {
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
                  code: '00',
                  dates: {
                    dateDAutorisation: '2005-10-11',
                    dateDeFin: '2026-05-03',
                    dateDeMiseEnOeuvre: '2008-01-04',
                    numéroArhgos: '01-00-000',
                  },
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
          code:'A1',
          libellé: 'Dépôt de sang',
          modalités : [
            {
              code: 'M0',
              formes: [
                {
                  code: '00',
                  dates: {
                    dateDAutorisation: '2019-06-03',
                    dateDeFin: '2024-08-31',
                    dateDeMiseEnOeuvre: '2019-06-03',
                  },
                  libellé: 'Pas de forme',
                },
              ],
              libellé: "Dépôt d'urgence",
            },
          ],
        },
      ],
      dateMiseÀJourSource: '2022-08-29',
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
                  dates: {
                    capacitéAutorisée: 4,
                    dateDEffetAsr: '2013-11-30',
                    dateDEffetCpom: '2013-11-01',
                    dateDeFinCpom: '2018-11-30',
                    numéroArhgos: '18-00-RC00000',
                    numéroCpom: '18-00-C00000',
                  },
                  libellé: 'Hospitalisation complète (24 heures consécutives ou plus)',
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

  public static créeUneIdentitéMédicoSocial(champsSurchargés?: Partial<ÉtablissementTerritorialIdentité>): ÉtablissementTerritorialIdentité {
    return {
      ...ÉtablissementTerritorialTestBuilder.médicoSocial,
      ...champsSurchargés,
    }
  }

  public static créeUneIdentitéSanitaire(champsSurchargés?: Partial<ÉtablissementTerritorialIdentité>): ÉtablissementTerritorialIdentité {
    return {
      ...ÉtablissementTerritorialTestBuilder.sanitaire,
      ...champsSurchargés,
    }
  }

  public static créeUneActivitéMédicoSocial(
    champsSurchargés?: Partial<ÉtablissementTerritorialMédicoSocialActivité>
  ): ÉtablissementTerritorialMédicoSocialActivité {
    return {
      ...ÉtablissementTerritorialTestBuilder.activitéMédicoSocial,
      ...champsSurchargés,
    }
  }

  public static créeUneActivitéSanitaire(
    champsSurchargés?: Partial<ÉtablissementTerritorialSanitaireActivité>
  ): ÉtablissementTerritorialSanitaireActivité {
    return {
      ...ÉtablissementTerritorialTestBuilder.activitéSanitaire,
      ...champsSurchargés,
    }
  }

  public static créeUneAutorisationMédicoSocial(
    champsSurchargés?: Partial<ÉtablissementTerritorialMédicoSocialAutorisationEtCapacité>
  ): ÉtablissementTerritorialMédicoSocialAutorisationEtCapacité {
    return {
      ...ÉtablissementTerritorialTestBuilder.autorisationMédicoSocial,
      ...champsSurchargés,
    }
  }

  public static créeUneAutorisationSanitaire(
    champsSurchargés?: Partial<ÉtablissementTerritorialSanitaireAutorisationEtCapacité>
  ): ÉtablissementTerritorialSanitaireAutorisationEtCapacité {
    return {
      ...ÉtablissementTerritorialTestBuilder.autorisationSanitaire,
      ...champsSurchargés,
    }
  }
}
