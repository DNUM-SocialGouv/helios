import { RécupèreLEntitéJuridiqueUseCase } from './RécupèreLEntitéJuridiqueUseCase'

describe('La récupération d’une entité juridique', () => {
  it('récupère la fiche identité de l’entité juridique', () => {
    // GIVEN
    const numéroFINESS = '123456789'
    const récupèreLEntitéJuridiqueUseCase = new RécupèreLEntitéJuridiqueUseCase()

    // WHEN
    const ficheIdentitéRécupérée = récupèreLEntitéJuridiqueUseCase.exécute(numéroFINESS)

    // THEN
    const ficheIdentité = {
      adresseNuméroVoie: '6',
      adresseTypeVoie: 'AV',
      adresseVoie: 'rue de la Paix',
      nom: 'Nom de l’entité juridique',
      numéroFINESS,
      statut: 'statut',
      téléphone: '0123456789',
    }
    expect(ficheIdentitéRécupérée).toStrictEqual(ficheIdentité)
  })
})
