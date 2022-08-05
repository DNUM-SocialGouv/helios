import { ÉtablissementTerritorialMédicoSocialActivité } from '../métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialActivité'
import { ÉtablissementTerritorialSanitaireActivité } from '../métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireActivité'
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
