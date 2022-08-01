import { ÉtablissementTerritorialSanitaire } from '../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaire'
import { Paths } from '../configuration/Paths'
import { Wording } from '../configuration/wording/Wording'
import { ÉtablissementTerritorialSanitaireViewModel } from '../ui/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireViewModel'

export class ÉtablissementTerritorialSanitaireViewModelTestBuilder {
  private static identité: ÉtablissementTerritorialSanitaire['identité'] = {
    adresseAcheminement: {
      dateMiseAJourSource: '2021-07-07',
      value: '01130 NANTUA',
    },
    adresseNuméroVoie: {
      dateMiseAJourSource: '2021-07-07',
      value: '50',
    },
    adresseTypeVoie: {
      dateMiseAJourSource: '2021-07-07',
      value: 'R',
    },
    adresseVoie: {
      dateMiseAJourSource: '2021-07-07',
      value: 'PAUL PAINLEVE',
    },
    catégorieÉtablissement: {
      dateMiseAJourSource: '2021-07-07',
      value: '355',
    },
    courriel: {
      dateMiseAJourSource: '2021-07-07',
      value: 'a@example.com',
    },
    dateMiseAJourSource: '2021-07-07',
    libelléCatégorieÉtablissement: {
      dateMiseAJourSource: '2021-07-07',
      value: 'Centre Hospitalier (C.H.)',
    },
    numéroFinessEntitéJuridique: {
      dateMiseAJourSource: '2021-07-07',
      value: '010008407',
    },
    numéroFinessÉtablissementPrincipal: {
      dateMiseAJourSource: '2021-07-07',
      value: '010045057',
    },
    numéroFinessÉtablissementTerritorial: {
      dateMiseAJourSource: '2021-07-07',
      value: '010000040',
    },
    raisonSociale: {
      dateMiseAJourSource: '2021-07-07',
      value: 'CH NANTUA',
    },
    raisonSocialeDeLEntitéDeRattachement: {
      dateMiseAJourSource: '2021-07-07',
      value: 'HOPITAL PRIVE DE VILLENEUVE DASCQ',
    },
    statutJuridique: {
      dateMiseAJourSource: '2021-07-07',
      value: 'Société Anonyme (S.A.)',
    },
    typeÉtablissement: {
      dateMiseAJourSource: '2021-07-07',
      value: 'S',
    },
    téléphone: {
      dateMiseAJourSource: '2021-07-07',
      value: '0474754800',
    },
  }
  private static activités: ÉtablissementTerritorialSanitaire['activités'] = [
    {
      année: 2017,
      dateMiseAJourSource: '2021-07-07',
      nombreDePassagesAuxUrgences: {
        dateMiseAJourSource: '2021-07-07',
        value: 10,
      },
      nombreJournéesCompletePsy: {
        dateMiseAJourSource: '2021-07-07',
        value: 10,
      },
      nombreJournéesCompletesSsr: {
        dateMiseAJourSource: '2021-07-07',
        value: 10,
      },
      nombreJournéesPartiellesPsy: {
        dateMiseAJourSource: '2021-07-07',
        value: 10,
      },
      nombreJournéesPartielsSsr: {
        dateMiseAJourSource: '2021-07-07',
        value: 10,
      },
      nombreSéjoursCompletsChirurgie: {
        dateMiseAJourSource: '2021-07-07',
        value: 10,
      },
      nombreSéjoursCompletsMédecine: {
        dateMiseAJourSource: '2021-07-07',
        value: 10,
      },
      nombreSéjoursCompletsObstétrique: {
        dateMiseAJourSource: '2021-07-07',
        value: 10,
      },
      nombreSéjoursPartielsChirurgie: {
        dateMiseAJourSource: '2021-07-07',
        value: 10,
      },
      nombreSéjoursPartielsMédecine: {
        dateMiseAJourSource: '2021-07-07',
        value: 10,
      },
      nombreSéjoursPartielsObstétrique: {
        dateMiseAJourSource: '2021-07-07',
        value: 10,
      },
      numéroFinessÉtablissementTerritorial: '010000040',
    },
    {
      année: 2018,
      dateMiseAJourSource: '2021-07-07',
      nombreDePassagesAuxUrgences: {
        dateMiseAJourSource: '2021-07-07',
        value: 20,
      },
      nombreJournéesCompletePsy: {
        dateMiseAJourSource: '2021-07-07',
        value: 20,
      },
      nombreJournéesCompletesSsr: {
        dateMiseAJourSource: '2021-07-07',
        value: 20,
      },
      nombreJournéesPartiellesPsy: {
        dateMiseAJourSource: '2021-07-07',
        value: 20,
      },
      nombreJournéesPartielsSsr: {
        dateMiseAJourSource: '2021-07-07',
        value: 20,
      },
      nombreSéjoursCompletsChirurgie: {
        dateMiseAJourSource: '2021-07-07',
        value: 20,
      },
      nombreSéjoursCompletsMédecine: {
        dateMiseAJourSource: '2021-07-07',
        value: 20,
      },
      nombreSéjoursCompletsObstétrique: {
        dateMiseAJourSource: '2021-07-07',
        value: 20,
      },
      nombreSéjoursPartielsChirurgie: {
        dateMiseAJourSource: '2021-07-07',
        value: 20,
      },
      nombreSéjoursPartielsMédecine: {
        dateMiseAJourSource: '2021-07-07',
        value: 20,
      },
      nombreSéjoursPartielsObstétrique: {
        dateMiseAJourSource: '2021-07-07',
        value: 20,
      },
      numéroFinessÉtablissementTerritorial: '010000040',
    },
    {
      année: 2019,
      dateMiseAJourSource: '2021-07-07',
      nombreDePassagesAuxUrgences: {
        dateMiseAJourSource: '2021-07-07',
        value: 30,
      },
      nombreJournéesCompletePsy: {
        dateMiseAJourSource: '2021-07-07',
        value: 30,
      },
      nombreJournéesCompletesSsr: {
        dateMiseAJourSource: '2021-07-07',
        value: 30,
      },
      nombreJournéesPartiellesPsy: {
        dateMiseAJourSource: '2021-07-07',
        value: 30,
      },
      nombreJournéesPartielsSsr: {
        dateMiseAJourSource: '2021-07-07',
        value: 30,
      },
      nombreSéjoursCompletsChirurgie: {
        dateMiseAJourSource: '2021-07-07',
        value: 30,
      },
      nombreSéjoursCompletsMédecine: {
        dateMiseAJourSource: '2021-07-07',
        value: 30,
      },
      nombreSéjoursCompletsObstétrique: {
        dateMiseAJourSource: '2021-07-07',
        value: 30,
      },
      nombreSéjoursPartielsChirurgie: {
        dateMiseAJourSource: '2021-07-07',
        value: 30,
      },
      nombreSéjoursPartielsMédecine: {
        dateMiseAJourSource: '2021-07-07',
        value: 30,
      },
      nombreSéjoursPartielsObstétrique: {
        dateMiseAJourSource: '2021-07-07',
        value: 30,
      },
      numéroFinessÉtablissementTerritorial: '010000040',
    },
    {
      année: 2020,
      dateMiseAJourSource: '2021-07-07',
      nombreDePassagesAuxUrgences: {
        dateMiseAJourSource: '2021-07-07',
        value: 40,
      },
      nombreJournéesCompletePsy: {
        dateMiseAJourSource: '2021-07-07',
        value: 40,
      },
      nombreJournéesCompletesSsr: {
        dateMiseAJourSource: '2021-07-07',
        value: 40,
      },
      nombreJournéesPartiellesPsy: {
        dateMiseAJourSource: '2021-07-07',
        value: 40,
      },
      nombreJournéesPartielsSsr: {
        dateMiseAJourSource: '2021-07-07',
        value: 40,
      },
      nombreSéjoursCompletsChirurgie: {
        dateMiseAJourSource: '2021-07-07',
        value: 40,
      },
      nombreSéjoursCompletsMédecine: {
        dateMiseAJourSource: '2021-07-07',
        value: 40,
      },
      nombreSéjoursCompletsObstétrique: {
        dateMiseAJourSource: '2021-07-07',
        value: 40,
      },
      nombreSéjoursPartielsChirurgie: {
        dateMiseAJourSource: '2021-07-07',
        value: 40,
      },
      nombreSéjoursPartielsMédecine: {
        dateMiseAJourSource: '2021-07-07',
        value: 40,
      },
      nombreSéjoursPartielsObstétrique: {
        dateMiseAJourSource: '2021-07-07',
        value: 40,
      },
      numéroFinessÉtablissementTerritorial: '010000040',
    },
    {
      année: 2021,
      dateMiseAJourSource: '2021-07-07',
      nombreDePassagesAuxUrgences: {
        dateMiseAJourSource: '2021-07-07',
        value: 5000,
      },
      nombreJournéesCompletePsy: {
        dateMiseAJourSource: '2021-07-07',
        value: 5000,
      },
      nombreJournéesCompletesSsr: {
        dateMiseAJourSource: '2021-07-07',
        value: 5000,
      },
      nombreJournéesPartiellesPsy: {
        dateMiseAJourSource: '2021-07-07',
        value: 5000,
      },
      nombreJournéesPartielsSsr: {
        dateMiseAJourSource: '2021-07-07',
        value: 5000,
      },
      nombreSéjoursCompletsChirurgie: {
        dateMiseAJourSource: '2021-07-07',
        value: 5000,
      },
      nombreSéjoursCompletsMédecine: {
        dateMiseAJourSource: '2021-07-07',
        value: 5000,
      },
      nombreSéjoursCompletsObstétrique: {
        dateMiseAJourSource: '2021-07-07',
        value: 5000,
      },
      nombreSéjoursPartielsChirurgie: {
        dateMiseAJourSource: '2021-07-07',
        value: 5000,
      },
      nombreSéjoursPartielsMédecine: {
        dateMiseAJourSource: '2021-07-07',
        value: 5000,
      },
      nombreSéjoursPartielsObstétrique: {
        dateMiseAJourSource: '2021-07-07',
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
