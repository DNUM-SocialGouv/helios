import { EntitéJuridique } from '../../métier/entities/EntitéJuridique'
import { TypeORMEntitéJuridiqueLoader } from './TypeORMEntitéJuridiqueLoader'

describe('Entité juridique loader', () => {
  it('charge par numéro FINESS', () => {
    // GIVEN
    const numéroFINESS = '012345678'
    const typeORMEntitéJuridiqueLoader = new TypeORMEntitéJuridiqueLoader()
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
    const entitéJuridiqueChargée = typeORMEntitéJuridiqueLoader.chargeParNuméroFINESS()

    // THEN
    expect(entitéJuridiqueChargée).toStrictEqual(entitéJuridiqueAttendue)
  })
})
