import { EntitéJuridique } from '../métier/entities/entité-juridique/EntitéJuridique'

export class EntitéJuridiqueTestFactory {
  private static entitéJurique1: EntitéJuridique = {
    adresseAcheminement: '01117 OYONNAX CEDEX',
    adresseNuméroVoie: '1',
    adresseTypeVoie: 'RTE',
    adresseVoie: 'DE VEYZIAT',
    dateMiseAJourSource: '2022-05-14',
    libelléStatutJuridique: 'Etablissement Public Intercommunal dHospitalisation',
    numéroFinessEntitéJuridique: '010018407',
    raisonSociale: 'CH DU HAUT BUGEY',
    téléphone: '0102030406',
  }

  private static entitéJurique2: EntitéJuridique = {
    adresseAcheminement: '59650 VILLENEUVE D ASCQ',
    adresseNuméroVoie: '20',
    adresseTypeVoie: 'AV',
    adresseVoie: 'DE LA RECONNAISSANCE',
    dateMiseAJourSource: '2022-05-14',
    libelléStatutJuridique: 'Société Anonyme (S.A.)',
    numéroFinessEntitéJuridique: '590001741',
    raisonSociale: 'HOPITAL PRIVE DE VILLENEUVE DASCQ',
    téléphone: '0102030405',
  }

  public static créeEntitéJuridique(champsSurchargés?: Partial<EntitéJuridique>): EntitéJuridique {
    return {
      ...EntitéJuridiqueTestFactory.entitéJurique1,
      ...champsSurchargés,
    }
  }

  public static créeAutreEntitéJuridique(champsSurchargés?: Partial<EntitéJuridique>): EntitéJuridique {
    return {
      ...EntitéJuridiqueTestFactory.entitéJurique2,
      ...champsSurchargés,
    }
  }
}
