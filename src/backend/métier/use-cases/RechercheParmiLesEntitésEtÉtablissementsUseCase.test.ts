import { RésultatDeRechercheTestBuilder } from '../../test-builder/RésultatDeRechercheTestBuilder'
import { RésultatDeRecherche } from '../entities/RésultatDeRecherche'
import { RechercheLoader } from '../gateways/RechercheLoader'
import { RechercheParmiLesEntitésEtÉtablissementsUseCase } from './RechercheParmiLesEntitésEtÉtablissementsUseCase'

describe('La recherche des entités juridiques et des établissements territoriaux', () => {
  it('retourne les résultats de la recherche', async () => {
    // GIVEN
    const mockedRechercheParTerme = jest.fn().mockResolvedValueOnce([
      RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité(),
      RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheÉtablissementMédicoSocial(),
      RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheÉtablissementSanitaire(),
    ])
    const rechercheLoader: RechercheLoader = { recherche: mockedRechercheParTerme }
    const termeDeLaRecherche = 'terme de la recherche'

    const rechercheParmiLesEntitésEtÉtablissementsUseCase = new RechercheParmiLesEntitésEtÉtablissementsUseCase(rechercheLoader)

    // WHEN
    const résultatsDeLaRecherche = await rechercheParmiLesEntitésEtÉtablissementsUseCase.exécute(termeDeLaRecherche)

    // THEN
    expect(mockedRechercheParTerme).toHaveBeenCalledWith(termeDeLaRecherche)
    expect(mockedRechercheParTerme).toHaveBeenCalledTimes(1)
    expect(résultatsDeLaRecherche).toStrictEqual<RésultatDeRecherche>(
      {
        nombreDeRésultats: 3,
        résultats:
        [
          {
            numéroFiness: '010018407',
            raisonSociale: 'CH DU HAUT BUGEY',
            type: 'Entité juridique',
          },
          {
            numéroFiness: '010000040',
            raisonSociale: 'CH NANTUA',
            type: 'Médico-social',
          },
          {
            numéroFiness: '590782553',
            raisonSociale: 'HOPITAL PRIVE DE VILLENEUVE DASCQ',
            type: 'Sanitaire',
          },
        ],
      }
    )
  })
})
