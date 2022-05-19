import { EntitéJuridiqueModel } from '../../../database/models/EntitéJuridiqueModel'
import { EntitéJuridique } from '../../métier/entities/EntitéJuridique'
import { getOrm } from '../../testHelper'
import { TypeORMEntitéJuridiqueLoader } from './TypeORMEntitéJuridiqueLoader'

describe('Entité juridique loader', () => {
  const orm = getOrm()

  afterAll(async () => {
    await (await orm).destroy()
  })

  it('charge par numéro FINESS', () => {
    // GIVEN
    const entitéJuridique = new EntitéJuridiqueModel()
    entitéJuridique.adresseAcheminement = '75000 Paris'
    entitéJuridique.adresseNuméroVoie = '6'
    entitéJuridique.adresseTypeVoie = 'AV'
    entitéJuridique.adresseVoie = 'rue de la Paix'
    entitéJuridique.libelléStatutJuridique = 'statut'
    entitéJuridique.numéroFinessEntitéJuridique = '012345678'
    entitéJuridique.raisonSociale = 'Nom de l’entité juridique'
    entitéJuridique.téléphone = '0123456789'
    await entitéJuridiqueRepository.insert(entitéJuridique)

    const numéroFINESS = '012345678'
    const typeORMEntitéJuridiqueLoader = new TypeORMEntitéJuridiqueLoader(orm)
    const entitéJuridiqueAttendue: EntitéJuridique = {
      adresseAcheminement: '75000 Paris',
      adresseNuméroVoie: '6',
      adresseTypeVoie: 'AV',
      adresseVoie: 'rue de la Paix',
      dateMiseAJourSource: '20220514',
      libelléStatutJuridique: 'statut',
      numéroFinessEntitéJuridique: numéroFINESS,
      raisonSociale: 'Nom de l’entité juridique',
      téléphone: '0123456789',
    }
    // WHEN
    const entitéJuridiqueChargée = typeORMEntitéJuridiqueLoader.chargeParNuméroFINESS(numéroFINESS)

    // THEN
    expect(entitéJuridiqueChargée).toStrictEqual(entitéJuridiqueAttendue)
  })
})
