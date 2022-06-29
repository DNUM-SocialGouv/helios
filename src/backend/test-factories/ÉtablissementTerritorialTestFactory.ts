import { ÉtablissementTerritorialMédicoSocialActivité } from '../métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialActivité'
import { ÉtablissementTerritorialIdentité } from '../métier/entities/ÉtablissementTerritorialIdentité'

export class ÉtablissementTerritorialTestFactory {
  private static médicoSocial: ÉtablissementTerritorialIdentité = {
    adresseAcheminement: '01130 NANTUA',
    adresseNuméroVoie: '50',
    adresseTypeVoie: 'R',
    adresseVoie: 'PAUL PAINLEVE',
    catégorieÉtablissement: '355',
    courriel: 'a@example.com',
    dateMiseAJourSource: '2022-05-14',
    libelléCatégorieÉtablissement: 'Centre hospitalier (C.H.)',
    numéroFinessEntitéJuridique: '010008407',
    numéroFinessÉtablissementPrincipal: '010018407',
    numéroFinessÉtablissementTerritorial: '010000040',
    raisonSociale: 'CH NANTUA',
    typeÉtablissement: 'S',
    téléphone: '0102030405',
  }

  private static sanitaire: ÉtablissementTerritorialIdentité = {
    adresseAcheminement: '59650 VILLENEUVE D ASCQ',
    adresseNuméroVoie: '20',
    adresseTypeVoie: 'AV',
    adresseVoie: 'DE LA RECONNAISSANCE',
    catégorieÉtablissement: '365',
    courriel: 'b@example.com',
    dateMiseAJourSource: '2022-05-14',
    libelléCatégorieÉtablissement: 'Centre Hospitalier (C.H.)',
    numéroFinessEntitéJuridique: '590000741',
    numéroFinessÉtablissementPrincipal: '',
    numéroFinessÉtablissementTerritorial: '590782553',
    raisonSociale: 'HOPITAL PRIVE DE VILLENEUVE DASCQ',
    typeÉtablissement: 'P',
    téléphone: '0102030406',
  }

  private static activité: ÉtablissementTerritorialMédicoSocialActivité = {
    année: 2019,
    dateMiseAJourSource: '2022-05-14',
    duréeMoyenneSéjourAccompagnementPersonnesSorties: 80,
    fileActivePersonnesAccompagnées: 80,
    nombreMoyenJournéesAbsencePersonnesAccompagnées: 80,
    numéroFinessÉtablissementTerritorial: '123456789',
    tauxOccupationAccueilDeJour: 80,
    tauxOccupationHébergementPermanent: 80,
    tauxOccupationHébergementTemporaire: 80,
    tauxRéalisationActivité: 80,
  }

  public static créeUneIdentitéMédicoSocial(champsSurchargés?: Partial<ÉtablissementTerritorialIdentité>): ÉtablissementTerritorialIdentité {
    return {
      ...ÉtablissementTerritorialTestFactory.médicoSocial,
      ...champsSurchargés,
    }
  }

  public static créeUneIdentitéSanitaire(champsSurchargés?: Partial<ÉtablissementTerritorialIdentité>): ÉtablissementTerritorialIdentité {
    return {
      ...ÉtablissementTerritorialTestFactory.sanitaire,
      ...champsSurchargés,
    }
  }

  public static créeUneActivitéMédicoSocial(
    champsSurchargés?: Partial<ÉtablissementTerritorialMédicoSocialActivité>
  ): ÉtablissementTerritorialMédicoSocialActivité {
    return {
      ...ÉtablissementTerritorialTestFactory.activité,
      ...champsSurchargés,
    }
  }
}
