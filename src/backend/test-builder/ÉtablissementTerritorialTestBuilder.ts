import { ÉtablissementTerritorialMédicoSocialActivité } from '../métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialActivité'
import { ÉtablissementTerritorialSanitaireActivité } from '../métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireActivité'
import { ÉtablissementTerritorialIdentité } from '../métier/entities/ÉtablissementTerritorialIdentité'

export class ÉtablissementTerritorialTestBuilder {
  private static médicoSocial: ÉtablissementTerritorialIdentité = {
    adresseAcheminement: {
      dateMiseAJourSource: '2022-05-14',
      value: '01130 NANTUA',
    },
    adresseNuméroVoie: {
      dateMiseAJourSource: '2022-05-14',
      value: '50',
    },
    adresseTypeVoie: {
      dateMiseAJourSource: '2022-05-14',
      value: 'R',
    },
    adresseVoie: {
      dateMiseAJourSource: '2022-05-14',
      value: 'PAUL PAINLEVE',
    },
    catégorieÉtablissement: {
      dateMiseAJourSource: '2022-05-14',
      value: '159',
    },
    courriel: {
      dateMiseAJourSource: '2022-05-14',
      value: 'a@example.com',
    },
    dateMiseAJourSource: '2022-05-14',
    libelléCatégorieÉtablissement: {
      dateMiseAJourSource: '2022-05-14',
      value: 'Centre Hospitalier (C.H.)',
    },
    numéroFinessEntitéJuridique: {
      dateMiseAJourSource: '2022-05-14',
      value: '010008407',
    },
    numéroFinessÉtablissementPrincipal: {
      dateMiseAJourSource: '2022-05-14',
      value: '010018407',
    },
    numéroFinessÉtablissementTerritorial: {
      dateMiseAJourSource: '2022-05-14',
      value: '010000040',
    },
    raisonSociale: {
      dateMiseAJourSource: '2022-05-14',
      value: 'CENTRE HOSPITALIER NANTUA',
    },
    typeÉtablissement: {
      dateMiseAJourSource: '2022-05-14',
      value: 'S',
    },
    téléphone: {
      dateMiseAJourSource: '2022-05-14',
      value: '0102030405',
    },
  }

  private static sanitaire: ÉtablissementTerritorialIdentité = {
    adresseAcheminement: {
      dateMiseAJourSource: '2022-05-14',
      value: '59650 VILLENEUVE D ASCQ',
    },
    adresseNuméroVoie: {
      dateMiseAJourSource: '2022-05-14',
      value: '20',
    },
    adresseTypeVoie: {
      dateMiseAJourSource: '2022-05-14',
      value: 'AV',
    },
    adresseVoie: {
      dateMiseAJourSource: '2022-05-14',
      value: 'DE LA RECONNAISSANCE',
    },
    catégorieÉtablissement: {
      dateMiseAJourSource: '2022-05-14',
      value: '365',
    },
    courriel: {
      dateMiseAJourSource: '2022-05-14',
      value: 'b@example.com',
    },
    dateMiseAJourSource: '2022-05-14',
    libelléCatégorieÉtablissement: {
      dateMiseAJourSource: '2022-05-14',
      value: 'Centre Hospitalier (C.H.)',
    },
    numéroFinessEntitéJuridique: {
      dateMiseAJourSource: '2022-05-14',
      value: '590000741',
    },
    numéroFinessÉtablissementPrincipal: {
      dateMiseAJourSource: '2022-05-14',
      value: '',
    },
    numéroFinessÉtablissementTerritorial: {
      dateMiseAJourSource: '2022-05-14',
      value: '590782553',
    },
    raisonSociale: {
      dateMiseAJourSource: '2022-05-14',
      value: 'HOPITAL PRIVE DE VILLENEUVE DASCQ',
    },
    typeÉtablissement: {
      dateMiseAJourSource: '2022-05-14',
      value: 'P',
    },
    téléphone: {
      dateMiseAJourSource: '2022-05-14',
      value: '0102030406',
    },
  }

  private static activitéMédicoSocial: ÉtablissementTerritorialMédicoSocialActivité = {
    année: 2019,
    dateMiseAJourSource: '2022-05-14',
    duréeMoyenneSéjourAccompagnementPersonnesSorties: {
      dateMiseAJourSource: '2022-05-14',
      value: 80,
    },
    fileActivePersonnesAccompagnées: {
      dateMiseAJourSource: '2022-05-14',
      value: 80,
    },
    nombreMoyenJournéesAbsencePersonnesAccompagnées: {
      dateMiseAJourSource: '2022-05-14',
      value: 80,
    },
    numéroFinessÉtablissementTerritorial: '123456789',
    tauxOccupationAccueilDeJour: {
      dateMiseAJourSource: '2022-05-15',
      value: 80,
    },
    tauxOccupationHébergementPermanent: {
      dateMiseAJourSource: '2022-05-15',
      value: 80,
    },
    tauxOccupationHébergementTemporaire: {
      dateMiseAJourSource: '2022-05-15',
      value: 80,
    },
    tauxRéalisationActivité: {
      dateMiseAJourSource: '2022-05-14',
      value: 80,
    },
  }

  private static activitéSanitaire: ÉtablissementTerritorialSanitaireActivité = {
    année: 2016,
    dateMiseAJourSource: '2022-05-14',
    nombreDePassagesAuxUrgences: {
      dateMiseAJourSource: '2022-05-15',
      value: 60_000,
    },
    nombreJournéesCompletePsy: {
      dateMiseAJourSource: '2022-05-14',
      value: 60,
    },
    nombreJournéesCompletesSsr: {
      dateMiseAJourSource: '2022-05-14',
      value: 60,
    },
    nombreJournéesPartiellesPsy: {
      dateMiseAJourSource: '2022-05-14',
      value: 60,
    },
    nombreJournéesPartielsSsr: {
      dateMiseAJourSource: '2022-05-14',
      value: 60,
    },
    nombreSéjoursCompletsChirurgie: {
      dateMiseAJourSource: '2022-05-14',
      value: 60,
    },
    nombreSéjoursCompletsMédecine: {
      dateMiseAJourSource: '2022-05-14',
      value: 60,
    },
    nombreSéjoursCompletsObstétrique: {
      dateMiseAJourSource: '2022-05-14',
      value: 60,
    },
    nombreSéjoursPartielsChirurgie: {
      dateMiseAJourSource: '2022-05-14',
      value: 60,
    },
    nombreSéjoursPartielsMédecine: {
      dateMiseAJourSource: '2022-05-14',
      value: 60,
    },
    nombreSéjoursPartielsObstétrique: {
      dateMiseAJourSource: '2022-05-14',
      value: 60,
    },
    numéroFinessÉtablissementTerritorial: '123456789',
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
}
