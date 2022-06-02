import { DomaineÉtablissementTerritorial } from '../entities/DomaineÉtablissementTerritorial'
import { ÉtablissementTerritorialRattaché } from '../entities/entité-juridique/ÉtablissementTerritorialRattaché'
import { ÉtablissementTerritorialRattachéLoader } from '../gateways/ÉtablissementTerritorialRattachéLoader'
import { RécupèreLesÉtablissementsTerritoriauxRattachésUseCase } from './RécupèreLesÉtablissementsTerritoriauxRattachésÀLEntitéJuridiqueUseCase'

describe('La récupération des établissements territoriaux rattachés à une entité juridique', () => {
  it('récupère la liste des établissements territoriaux', async () => {
    // GIVEN
    const numéroFiness = '123456789'
    const établissementsTerritoriauxAttendus: ÉtablissementTerritorialRattaché[] = [
      {
        domaine: DomaineÉtablissementTerritorial.MÉDICO_SOCIAL,
        numéroFiness: '111222333',
        raisonSociale: 'Établissement 1',
      },
      {
        domaine: DomaineÉtablissementTerritorial.MÉDICO_SOCIAL,
        numéroFiness: '333222111',
        raisonSociale: 'Établissement 2',
      },
    ]
    const mockedRécupèreParFinessDeLEntitéJuridiqueDeRattachement = jest.fn(async () => {
      return établissementsTerritoriauxAttendus
    })
    const établissementTerritorialLoader: ÉtablissementTerritorialRattachéLoader
      = { chargeLesÉtablissementsDeLEntitéJuridiqueDeRattachement: mockedRécupèreParFinessDeLEntitéJuridiqueDeRattachement }
    const récupèreLesÉtablissementsTerritoriauxRattachésUseCase = new RécupèreLesÉtablissementsTerritoriauxRattachésUseCase(établissementTerritorialLoader)

    // WHEN
    const établissementsTerritoriaux = await récupèreLesÉtablissementsTerritoriauxRattachésUseCase.exécute(numéroFiness)

    // THEN
    expect(établissementsTerritoriaux).toStrictEqual(établissementsTerritoriauxAttendus)
    expect(mockedRécupèreParFinessDeLEntitéJuridiqueDeRattachement).toHaveBeenCalledWith(numéroFiness)
    expect(mockedRécupèreParFinessDeLEntitéJuridiqueDeRattachement).toHaveBeenCalledTimes(1)
  })
})
