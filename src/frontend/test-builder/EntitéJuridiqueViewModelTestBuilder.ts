import { EntitéJuridique } from '../../backend/métier/entities/entité-juridique/EntitéJuridique'
import { Wording } from '../configuration/wording/Wording'
import { EntitéJuridiqueViewModel } from '../ui/entité-juridique/EntitéJuridiqueViewModel'

export class EntitéJuridiqueViewModelTestBuilder {
  private static entitéJurique: EntitéJuridique = {
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

  public static crée(wording: Wording, champsSurchargés?: Partial<EntitéJuridique>): EntitéJuridiqueViewModel {
    return new EntitéJuridiqueViewModel({
      ...EntitéJuridiqueViewModelTestBuilder.entitéJurique,
      ...champsSurchargés,
    }, wording)
  }
}
