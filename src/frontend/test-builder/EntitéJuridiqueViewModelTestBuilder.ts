import { EntitéJuridique } from '../../backend/métier/entities/entité-juridique/EntitéJuridique'
import { Wording } from '../configuration/wording/Wording'
import { EntitéJuridiqueViewModel } from '../ui/entité-juridique/EntitéJuridiqueViewModel'

export class EntitéJuridiqueViewModelTestBuilder {
  private static entitéJurique: EntitéJuridique = {
    adresseAcheminement: {
      dateMiseÀJourSource: '2021-07-07',
      value: '22023 ST BRIEUC CEDEX 1',
    },
    adresseNuméroVoie: {
      dateMiseÀJourSource: '2021-07-07',
      value: '10',
    },
    adresseTypeVoie: {
      dateMiseÀJourSource: '2021-07-07',
      value: 'Rue',
    },
    adresseVoie: {
      dateMiseÀJourSource: '2021-07-07',
      value: 'Marcel Proust',
    },
    dateMiseÀJourSource: '2021-07-07',
    libelléStatutJuridique: {
      dateMiseÀJourSource: '2021-07-07',
      value: 'Public',
    },
    numéroFinessEntitéJuridique: {
      dateMiseÀJourSource: '2021-07-07',
      value: '220000020',
    },
    raisonSociale: {
      dateMiseÀJourSource: '2021-07-07',
      value: 'CENTRE HOSPITALIER DE SAINT BRIEUC',
    },
    téléphone: {
      dateMiseÀJourSource: '2021-07-07',
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
