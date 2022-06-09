import { ÉtablissementTerritorialIdentité } from '../métier/entities/ÉtablissementTerritorialIdentité'

export class ÉtablissementTerritorialTestFactory {
  private static établissementTerritorial1: ÉtablissementTerritorialIdentité = {
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

  private static établissementTerritorial2: ÉtablissementTerritorialIdentité = {
    adresseAcheminement: '59650 VILLENEUVE D ASCQ',
    adresseNuméroVoie: '20',
    adresseTypeVoie: 'AV',
    adresseVoie: 'DE LA RECONNAISSANCE',
    catégorieÉtablissement: '365',
    courriel: 'b@example.com',
    dateMiseAJourSource: '20220203',
    libelléCatégorieÉtablissement: 'Centre Hospitalier (C.H.)',
    numéroFinessEntitéJuridique: '590000741',
    numéroFinessÉtablissementPrincipal: '',
    numéroFinessÉtablissementTerritorial: '590782553',
    raisonSociale: 'HOPITAL PRIVE DE VILLENEUVE DASCQ',
    typeÉtablissement: 'P',
    téléphone: '0102030406',
  }

  public static créeÉtablissementTerritorial(champsSurchargés?: Partial<ÉtablissementTerritorialIdentité>): ÉtablissementTerritorialIdentité {
    return {
      ...ÉtablissementTerritorialTestFactory.établissementTerritorial1,
      ...champsSurchargés,
    }
  }

  public static créeAutreÉtablissementTerritorial(champsSurchargés?: Partial<ÉtablissementTerritorialIdentité>): ÉtablissementTerritorialIdentité {
    return {
      ...ÉtablissementTerritorialTestFactory.établissementTerritorial2,
      ...champsSurchargés,
    }
  }
}
