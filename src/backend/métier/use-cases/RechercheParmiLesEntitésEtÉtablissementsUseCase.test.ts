import { RésultatDeRechercheTestBuilder } from '../../test-builder/RésultatDeRechercheTestBuilder'
import { RésultatDeRecherche } from '../entities/RésultatDeRecherche'
import { RechercheLoader } from '../gateways/RechercheLoader'
import { RechercheParmiLesEntitésEtÉtablissementsUseCase } from './RechercheParmiLesEntitésEtÉtablissementsUseCase'

describe('La recherche des entités juridiques et des établissements territoriaux', () => {
  it('retourne les résultats de la recherche', async () => {
    // GIVEN
    const résultatDeRecherche: RésultatDeRecherche = {
      nombreDeRésultats: 3,
      résultats: [
        RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheEntité(),
        RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheÉtablissementMédicoSocial(),
        RésultatDeRechercheTestBuilder.créeUnRésultatDeRechercheÉtablissementSanitaire(),
      ],
    }
    const mockedRechercheParTerme = jest.fn().mockResolvedValueOnce(résultatDeRecherche)
    const rechercheLoader: RechercheLoader = { recherche: mockedRechercheParTerme }
    const termeDeLaRecherche = 'terme de la recherche'
    const premièrePage = 1

    const rechercheParmiLesEntitésEtÉtablissementsUseCase = new RechercheParmiLesEntitésEtÉtablissementsUseCase(rechercheLoader)

    // WHEN
    const résultatsDeLaRecherche = await rechercheParmiLesEntitésEtÉtablissementsUseCase.exécute(termeDeLaRecherche, premièrePage)

    // THEN
    expect(mockedRechercheParTerme).toHaveBeenCalledWith(termeDeLaRecherche, premièrePage)
    expect(mockedRechercheParTerme).toHaveBeenCalledTimes(1)
    expect(résultatsDeLaRecherche).toStrictEqual<RésultatDeRecherche>(
      {
        nombreDeRésultats: 3,
        résultats:
        [
          {
            commune: 'OYONNAX',
            département: 'AIN',
            numéroFiness: '010018407',
            raisonSociale: 'CENTRE HOSPITALIER DU HAUT BUGEY',
            type: 'Entité juridique',
          },
          {
            commune: 'NANTUA',
            département: 'AIN',
            numéroFiness: '010000040',
            raisonSociale: 'CENTRE HOSPITALIER NANTUA',
            type: 'Médico-social',
          },
          {
            commune: 'VILLENEUVE D ASCQ',
            département: 'NORD',
            numéroFiness: '590782553',
            raisonSociale: 'HOPITAL PRIVE DE VILLENEUVE DASCQ',
            type: 'Sanitaire',
          },
        ],
      }
    )
  })
})
