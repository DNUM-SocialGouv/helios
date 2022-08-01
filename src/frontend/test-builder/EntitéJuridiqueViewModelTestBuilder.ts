import { EntitéJuridique } from '../../backend/métier/entities/entité-juridique/EntitéJuridique'
import { Wording } from '../configuration/wording/Wording'
import { EntitéJuridiqueViewModel } from '../ui/entité-juridique/EntitéJuridiqueViewModel'

export class EntitéJuridiqueViewModelTestBuilder {
  private static entitéJurique: EntitéJuridique = {
    adresseAcheminement: {
      dateMiseAJourSource: '2021-07-07',
      value: '22023 ST BRIEUC CEDEX 1',
    },
    adresseNuméroVoie: {
      dateMiseAJourSource: '2021-07-07',
      value: '10',
    },
    adresseTypeVoie: {
      dateMiseAJourSource: '2021-07-07',
      value: 'Rue',
    },
    adresseVoie: {
      dateMiseAJourSource: '2021-07-07',
      value: 'Marcel Proust',
    },
    dateMiseAJourSource: '2021-07-07',
    libelléStatutJuridique: {
      dateMiseAJourSource: '2021-07-07',
      value: 'Public',
    },
    numéroFinessEntitéJuridique: {
      dateMiseAJourSource: '2021-07-07',
      value: '220000020',
    },
    raisonSociale: {
      dateMiseAJourSource: '2021-07-07',
      value: 'CENTRE HOSPITALIER DE SAINT BRIEUC',
    },
    téléphone: {
      dateMiseAJourSource: '2021-07-07',
      value: '0296017123',
    },
  }

  public static crée(wording: Wording, champsSurchargés?: Partial<EntitéJuridique>): EntitéJuridiqueViewModel {
    return new EntitéJuridiqueViewModel({
      ...EntitéJuridiqueViewModelTestBuilder.entitéJurique,
      ...champsSurchargés,
    }, wording)
  }
}
