import { ÉtablissementTerritorialSanitaire } from '../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaire'
import { Paths } from '../configuration/Paths'
import { Wording } from '../configuration/wording/Wording'
import { ÉtablissementTerritorialSanitaireViewModel } from '../ui/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireViewModel'

export class ÉtablissementTerritorialSanitaireViewModelTestBuilder {
  private static identité: ÉtablissementTerritorialSanitaire['identité'] = {
    adresseAcheminement: {
      dateMiseÀJourSource: '2021-07-07',
      value: '01130 NANTUA',
    },
    adresseNuméroVoie: {
      dateMiseÀJourSource: '2021-07-07',
      value: '50',
    },
    adresseTypeVoie: {
      dateMiseÀJourSource: '2021-07-07',
      value: 'R',
    },
    adresseVoie: {
      dateMiseÀJourSource: '2021-07-07',
      value: 'PAUL PAINLEVE',
    },
    catégorieÉtablissement: {
      dateMiseÀJourSource: '2021-07-07',
      value: '355',
    },
    courriel: {
      dateMiseÀJourSource: '2021-07-07',
      value: 'a@example.com',
    },
    libelléCatégorieÉtablissement: {
      dateMiseÀJourSource: '2021-07-07',
      value: 'Centre Hospitalier (C.H.)',
    },
    numéroFinessEntitéJuridique: {
      dateMiseÀJourSource: '2021-07-07',
      value: '010008407',
    },
    numéroFinessÉtablissementPrincipal: {
      dateMiseÀJourSource: '2021-07-07',
      value: '010045057',
    },
    numéroFinessÉtablissementTerritorial: {
      dateMiseÀJourSource: '2021-07-07',
      value: '010000040',
    },
    raisonSociale: {
      dateMiseÀJourSource: '2021-07-07',
      value: 'CH NANTUA',
    },
    raisonSocialeDeLEntitéDeRattachement: {
      dateMiseÀJourSource: '2021-07-07',
      value: 'HOPITAL PRIVE DE VILLENEUVE DASCQ',
    },
    statutJuridique: {
      dateMiseÀJourSource: '2021-07-07',
      value: 'Société Anonyme (S.A.)',
    },
    typeÉtablissement: {
      dateMiseÀJourSource: '2021-07-07',
      value: 'S',
    },
    téléphone: {
      dateMiseÀJourSource: '2021-07-07',
      value: '0474754800',
    },
  }
  private static activités: ÉtablissementTerritorialSanitaire['activités'] = [
    {
      année: 2017,
      nombreDePassagesAuxUrgences: {
        dateMiseÀJourSource: '2021-07-07',
        value: 10,
      },
      nombreJournéesCompletePsy: {
        dateMiseÀJourSource: '2021-07-07',
        value: 10,
      },
      nombreJournéesCompletesSsr: {
        dateMiseÀJourSource: '2021-07-07',
        value: 10,
      },
      nombreJournéesPartiellesPsy: {
        dateMiseÀJourSource: '2021-07-07',
        value: 10,
      },
      nombreJournéesPartielsSsr: {
        dateMiseÀJourSource: '2021-07-07',
        value: 10,
      },
      nombreSéjoursCompletsChirurgie: {
        dateMiseÀJourSource: '2021-07-07',
        value: 10,
      },
      nombreSéjoursCompletsMédecine: {
        dateMiseÀJourSource: '2021-07-07',
        value: 10,
      },
      nombreSéjoursCompletsObstétrique: {
        dateMiseÀJourSource: '2021-07-07',
        value: 10,
      },
      nombreSéjoursPartielsChirurgie: {
        dateMiseÀJourSource: '2021-07-07',
        value: 10,
      },
      nombreSéjoursPartielsMédecine: {
        dateMiseÀJourSource: '2021-07-07',
        value: 10,
      },
      nombreSéjoursPartielsObstétrique: {
        dateMiseÀJourSource: '2021-07-07',
        value: 10,
      },
      numéroFinessÉtablissementTerritorial: '010000040',
    },
    {
      année: 2018,
      nombreDePassagesAuxUrgences: {
        dateMiseÀJourSource: '2021-07-07',
        value: 20,
      },
      nombreJournéesCompletePsy: {
        dateMiseÀJourSource: '2021-07-07',
        value: 20,
      },
      nombreJournéesCompletesSsr: {
        dateMiseÀJourSource: '2021-07-07',
        value: 20,
      },
      nombreJournéesPartiellesPsy: {
        dateMiseÀJourSource: '2021-07-07',
        value: 20,
      },
      nombreJournéesPartielsSsr: {
        dateMiseÀJourSource: '2021-07-07',
        value: 20,
      },
      nombreSéjoursCompletsChirurgie: {
        dateMiseÀJourSource: '2021-07-07',
        value: 20,
      },
      nombreSéjoursCompletsMédecine: {
        dateMiseÀJourSource: '2021-07-07',
        value: 20,
      },
      nombreSéjoursCompletsObstétrique: {
        dateMiseÀJourSource: '2021-07-07',
        value: 20,
      },
      nombreSéjoursPartielsChirurgie: {
        dateMiseÀJourSource: '2021-07-07',
        value: 20,
      },
      nombreSéjoursPartielsMédecine: {
        dateMiseÀJourSource: '2021-07-07',
        value: 20,
      },
      nombreSéjoursPartielsObstétrique: {
        dateMiseÀJourSource: '2021-07-07',
        value: 20,
      },
      numéroFinessÉtablissementTerritorial: '010000040',
    },
    {
      année: 2019,
      nombreDePassagesAuxUrgences: {
        dateMiseÀJourSource: '2021-07-07',
        value: 30,
      },
      nombreJournéesCompletePsy: {
        dateMiseÀJourSource: '2021-07-07',
        value: 30,
      },
      nombreJournéesCompletesSsr: {
        dateMiseÀJourSource: '2021-07-07',
        value: 30,
      },
      nombreJournéesPartiellesPsy: {
        dateMiseÀJourSource: '2021-07-07',
        value: 30,
      },
      nombreJournéesPartielsSsr: {
        dateMiseÀJourSource: '2021-07-07',
        value: 30,
      },
      nombreSéjoursCompletsChirurgie: {
        dateMiseÀJourSource: '2021-07-07',
        value: 30,
      },
      nombreSéjoursCompletsMédecine: {
        dateMiseÀJourSource: '2021-07-07',
        value: 30,
      },
      nombreSéjoursCompletsObstétrique: {
        dateMiseÀJourSource: '2021-07-07',
        value: 30,
      },
      nombreSéjoursPartielsChirurgie: {
        dateMiseÀJourSource: '2021-07-07',
        value: 30,
      },
      nombreSéjoursPartielsMédecine: {
        dateMiseÀJourSource: '2021-07-07',
        value: 30,
      },
      nombreSéjoursPartielsObstétrique: {
        dateMiseÀJourSource: '2021-07-07',
        value: 30,
      },
      numéroFinessÉtablissementTerritorial: '010000040',
    },
    {
      année: 2020,
      nombreDePassagesAuxUrgences: {
        dateMiseÀJourSource: '2021-07-07',
        value: 40,
      },
      nombreJournéesCompletePsy: {
        dateMiseÀJourSource: '2021-07-07',
        value: 40,
      },
      nombreJournéesCompletesSsr: {
        dateMiseÀJourSource: '2021-07-07',
        value: 40,
      },
      nombreJournéesPartiellesPsy: {
        dateMiseÀJourSource: '2021-07-07',
        value: 40,
      },
      nombreJournéesPartielsSsr: {
        dateMiseÀJourSource: '2021-07-07',
        value: 40,
      },
      nombreSéjoursCompletsChirurgie: {
        dateMiseÀJourSource: '2021-07-07',
        value: 40,
      },
      nombreSéjoursCompletsMédecine: {
        dateMiseÀJourSource: '2021-07-07',
        value: 40,
      },
      nombreSéjoursCompletsObstétrique: {
        dateMiseÀJourSource: '2021-07-07',
        value: 40,
      },
      nombreSéjoursPartielsChirurgie: {
        dateMiseÀJourSource: '2021-07-07',
        value: 40,
      },
      nombreSéjoursPartielsMédecine: {
        dateMiseÀJourSource: '2021-07-07',
        value: 40,
      },
      nombreSéjoursPartielsObstétrique: {
        dateMiseÀJourSource: '2021-07-07',
        value: 40,
      },
      numéroFinessÉtablissementTerritorial: '010000040',
    },
    {
      année: 2021,
      nombreDePassagesAuxUrgences: {
        dateMiseÀJourSource: '2021-07-07',
        value: 5000,
      },
      nombreJournéesCompletePsy: {
        dateMiseÀJourSource: '2021-07-07',
        value: 5000,
      },
      nombreJournéesCompletesSsr: {
        dateMiseÀJourSource: '2021-07-07',
        value: 5000,
      },
      nombreJournéesPartiellesPsy: {
        dateMiseÀJourSource: '2021-07-07',
        value: 5000,
      },
      nombreJournéesPartielsSsr: {
        dateMiseÀJourSource: '2021-07-07',
        value: 5000,
      },
      nombreSéjoursCompletsChirurgie: {
        dateMiseÀJourSource: '2021-07-07',
        value: 5000,
      },
      nombreSéjoursCompletsMédecine: {
        dateMiseÀJourSource: '2021-07-07',
        value: 5000,
      },
      nombreSéjoursCompletsObstétrique: {
        dateMiseÀJourSource: '2021-07-07',
        value: 5000,
      },
      nombreSéjoursPartielsChirurgie: {
        dateMiseÀJourSource: '2021-07-07',
        value: 5000,
      },
      nombreSéjoursPartielsMédecine: {
        dateMiseÀJourSource: '2021-07-07',
        value: 5000,
      },
      nombreSéjoursPartielsObstétrique: {
        dateMiseÀJourSource: '2021-07-07',
        value: 5000,
      },
      numéroFinessÉtablissementTerritorial: '010000040',
    },
  ]

  public static crée(
    wording: Wording, paths: Paths, champsSurchargés?: Partial<ÉtablissementTerritorialSanitaire['identité']>
  ): ÉtablissementTerritorialSanitaireViewModel {
    return new ÉtablissementTerritorialSanitaireViewModel({
      activités: ÉtablissementTerritorialSanitaireViewModelTestBuilder.activités,
      identité: {
        ...ÉtablissementTerritorialSanitaireViewModelTestBuilder.identité,
        ...champsSurchargés,
      },
    }, wording, paths)
  }
}
