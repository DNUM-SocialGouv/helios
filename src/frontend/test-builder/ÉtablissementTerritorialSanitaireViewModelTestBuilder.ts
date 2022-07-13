import { ÉtablissementTerritorialSanitaire } from '../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaire'
import { Wording } from '../configuration/wording/Wording'
import { ÉtablissementTerritorialSanitaireViewModel } from '../ui/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireViewModel'

export class ÉtablissementTerritorialSanitaireViewModelTestBuilder {
  private static identité: ÉtablissementTerritorialSanitaire['identité'] = {
    adresseAcheminement: '01130 NANTUA',
    adresseNuméroVoie : '50',
    adresseTypeVoie : 'R',
    adresseVoie : 'PAUL PAINLEVE',
    catégorieÉtablissement : '355',
    courriel : 'a@example.com',
    dateMiseAJourSource : '2021-07-07',
    libelléCatégorieÉtablissement : 'Centre Hospitalier (C.H.)',
    numéroFinessEntitéJuridique : '010008407',
    numéroFinessÉtablissementPrincipal : '010045057',
    numéroFinessÉtablissementTerritorial: '010000040',
    raisonSociale : 'CH NANTUA',
    raisonSocialeDeLEntitéDeRattachement : 'HOPITAL PRIVE DE VILLENEUVE DASCQ',
    statutJuridique : 'Société Anonyme (S.A.)',
    typeÉtablissement : 'S',
    téléphone : '0474754800',
  }
  private static activités: ÉtablissementTerritorialSanitaire['activités'] = [
    {
      année: 2017,
      dateMiseAJourSource: '2021-07-07',
      nombreJournéesCompletePsy: 10,
      nombreJournéesCompletesSsr: 10,
      nombreJournéesPartiellesPsy: 10,
      nombreJournéesPartielsSsr: 10,
      nombreSéjoursCompletsChirurgie: 10,
      nombreSéjoursCompletsMédecine: 10,
      nombreSéjoursCompletsObstétrique: 10,
      nombreSéjoursPartielsChirurgie: 10,
      nombreSéjoursPartielsMédecine: 10,
      nombreSéjoursPartielsObstétrique: 10,
      numéroFinessÉtablissementTerritorial: '010000040',
    },
    {
      année: 2018,
      dateMiseAJourSource: '2021-07-07',
      nombreJournéesCompletePsy: 20,
      nombreJournéesCompletesSsr: 20,
      nombreJournéesPartiellesPsy: 20,
      nombreJournéesPartielsSsr: 20,
      nombreSéjoursCompletsChirurgie: 20,
      nombreSéjoursCompletsMédecine: 20,
      nombreSéjoursCompletsObstétrique: 20,
      nombreSéjoursPartielsChirurgie: 20,
      nombreSéjoursPartielsMédecine: 20,
      nombreSéjoursPartielsObstétrique: 20,
      numéroFinessÉtablissementTerritorial: '010000040',
    },
    {
      année: 2019,
      dateMiseAJourSource: '2021-07-07',
      nombreJournéesCompletePsy: 30,
      nombreJournéesCompletesSsr: 30,
      nombreJournéesPartiellesPsy: 30,
      nombreJournéesPartielsSsr: 30,
      nombreSéjoursCompletsChirurgie: 30,
      nombreSéjoursCompletsMédecine: 30,
      nombreSéjoursCompletsObstétrique: 30,
      nombreSéjoursPartielsChirurgie: 30,
      nombreSéjoursPartielsMédecine: 30,
      nombreSéjoursPartielsObstétrique: 30,
      numéroFinessÉtablissementTerritorial: '010000040',
    },
    {
      année: 2020,
      dateMiseAJourSource: '2021-07-07',
      nombreJournéesCompletePsy: 40,
      nombreJournéesCompletesSsr: 40,
      nombreJournéesPartiellesPsy: 40,
      nombreJournéesPartielsSsr: 40,
      nombreSéjoursCompletsChirurgie: 40,
      nombreSéjoursCompletsMédecine: 40,
      nombreSéjoursCompletsObstétrique: 40,
      nombreSéjoursPartielsChirurgie: 40,
      nombreSéjoursPartielsMédecine: 40,
      nombreSéjoursPartielsObstétrique: 40,
      numéroFinessÉtablissementTerritorial: '010000040',
    },
    {
      année: 2021,
      dateMiseAJourSource: '2021-07-07',
      nombreJournéesCompletePsy: 50,
      nombreJournéesCompletesSsr: 50,
      nombreJournéesPartiellesPsy: 50,
      nombreJournéesPartielsSsr: 50,
      nombreSéjoursCompletsChirurgie: 50,
      nombreSéjoursCompletsMédecine: 50,
      nombreSéjoursCompletsObstétrique: 50,
      nombreSéjoursPartielsChirurgie: 50,
      nombreSéjoursPartielsMédecine: 50,
      nombreSéjoursPartielsObstétrique: 50,
      numéroFinessÉtablissementTerritorial: '010000040',
    },
  ]

  public static crée(
    wording: Wording, champsSurchargés?: Partial<ÉtablissementTerritorialSanitaire['identité']>
  ): ÉtablissementTerritorialSanitaireViewModel {
    return new ÉtablissementTerritorialSanitaireViewModel({
      activités: ÉtablissementTerritorialSanitaireViewModelTestBuilder.activités,
      identité: {
        ...ÉtablissementTerritorialSanitaireViewModelTestBuilder.identité,
        ...champsSurchargés,
      },
    }, wording)
  }
}
