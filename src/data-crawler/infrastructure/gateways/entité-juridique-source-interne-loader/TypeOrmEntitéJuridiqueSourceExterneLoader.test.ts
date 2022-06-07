import { EntitéJuridiqueTestFactory } from '../../../../backend/test/EntitéJuridiqueTestFactory'
import { EntitéJuridiqueModelTestFactory } from '../../../../database/test/EntitéJuridiqueModelTestFactory'
import { getOrm } from '../../../testHelper'
import { TypeOrmEntitéJuridiqueHeliosLoader } from './TypeOrmEntitéJuridiqueHeliosLoader'
import {EntitéJuridiqueModel} from "../../../../database/models/EntitéJuridiqueModel";

describe('r', () => {
  it('e', () => {
    // GIVEN
    const orm = getOrm()
    const typeOrmEntitéJuridiqueHeliosLoader = new TypeOrmEntitéJuridiqueHeliosLoader(orm)
    const entitéJuridique1 = EntitéJuridiqueModelTestFactory.créeEntitéJuridiqueModel(
      { numéroFinessEntitéJuridique: '123456789' }
    )

    // WHEN
    const entitésJuridiquesHelios = typeOrmEntitéJuridiqueHeliosLoader.récupèreLeNuméroFinessDesEntitésJuridiques()

    // THEN
    expect(entitésJuridiquesHelios).toStrictEqual([])
  })

})
