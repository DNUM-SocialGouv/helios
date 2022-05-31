import { EntitéJuridique } from '../../backend/métier/entities/EntitéJuridique'
import { Wording } from '../configuration/wording/Wording'
import { EntitéJuridiqueViewModel } from '../ui/entité-juridique/EntitéJuridiqueViewModel'

export class EntitéJuridiqueViewModelTestFactory {
  private static entitéJurique1: EntitéJuridique = {
    adresseAcheminement: '22023 ST BRIEUC CEDEX 1',
    adresseNuméroVoie: '10',
    adresseTypeVoie: 'Rue',
    adresseVoie: 'Marcel Proust',
    dateMiseAJourSource: '2021-07-07',
    libelléStatutJuridique: 'Public',
    numéroFinessEntitéJuridique: '220000020',
    raisonSociale: 'CENTRE HOSPITALIER DE SAINT BRIEUC',
    téléphone: '0296017123',
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

  public static créeEntitéJuridiqueViewModel(wording: Wording, champsSurchargés?: Partial<EntitéJuridique>): EntitéJuridiqueViewModel {
    return new EntitéJuridiqueViewModel({
      ...EntitéJuridiqueViewModelTestFactory.entitéJurique1,
      ...champsSurchargés,
    }, wording)
  }

  public static créeAutreEntitéJuridiqueViewModel(wording: Wording, champsSurchargés?: Partial<EntitéJuridique>): EntitéJuridiqueViewModel {
    return new EntitéJuridiqueViewModel({
      ...EntitéJuridiqueViewModelTestFactory.entitéJurique2,
      ...champsSurchargés,
    }, wording)
  }
}
