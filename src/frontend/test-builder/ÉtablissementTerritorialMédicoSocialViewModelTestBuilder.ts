import { ÉtablissementTerritorialMédicoSocial } from '../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocial'
import { Paths } from '../configuration/Paths'
import { Wording } from '../configuration/wording/Wording'
import { ÉtablissementTerritorialMédicoSocialViewModel } from '../ui/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialViewModel'

export class ÉtablissementTerritorialMédicoSocialViewModelTestBuilder {
  private static identité: ÉtablissementTerritorialMédicoSocial['identité'] = {
    adresseAcheminement: {
      dateMiseÀJourSource: '2021-07-07',
      value: '01117 OYONNAX CEDEX',
    },
    adresseNuméroVoie: {
      dateMiseÀJourSource: '2021-07-07',
      value: '1',
    },
    adresseTypeVoie: {
      dateMiseÀJourSource: '2021-07-07',
      value: 'RTE',
    },
    adresseVoie: {
      dateMiseÀJourSource: '2021-07-07',
      value: 'DE VEYZIAT',
    },
    catégorieÉtablissement: {
      dateMiseÀJourSource: '2021-07-07',
      value: '300',
    },
    courriel: {
      dateMiseÀJourSource: '2021-07-07',
      value: 'a@example.com',
    },
    dateMiseÀJourSource: '2021-07-07',
    estMonoÉtablissement: {
      dateMiseÀJourSource: '2021-07-07',
      value: false,
    },
    libelléCatégorieÉtablissement: {
      dateMiseÀJourSource: '2021-07-07',
      value: 'Ecoles Formant aux Professions Sanitaires',
    },
    numéroFinessEntitéJuridique: {
      dateMiseÀJourSource: '2021-07-07',
      value: '010008407',
    },
    numéroFinessÉtablissementPrincipal: {
      dateMiseÀJourSource: '2021-07-07',
      value: '010005239',
    },
    numéroFinessÉtablissementTerritorial: {
      dateMiseÀJourSource: '2021-07-07',
      value: '010003598',
    },
    raisonSociale: {
      dateMiseÀJourSource: '2021-07-07',
      value: 'IFAS CH DU HAUT BUGEY',
    },
    raisonSocialeDeLEntitéDeRattachement: {
      dateMiseÀJourSource: '2021-07-07',
      value: 'CH DU HAUT BUGEY',
    },
    statutJuridique: {
      dateMiseÀJourSource: '2021-07-07',
      value: 'Etablissement Public Intercommunal d’Hospitalisation',
    },
    typeÉtablissement: {
      dateMiseÀJourSource: '2021-07-07',
      value: 'S',
    },
    téléphone: {
      dateMiseÀJourSource: '2021-07-07',
      value: '0123456789',
    },
  }

  private static activités: ÉtablissementTerritorialMédicoSocial['activités'] = [
    {
      année: 2019,
      dateMiseÀJourSource: '2021-07-07',
      duréeMoyenneSéjourAccompagnementPersonnesSorties: {
        dateMiseÀJourSource: '2021-07-07',
        value: 1013,
      },
      fileActivePersonnesAccompagnées: {
        dateMiseÀJourSource: '2021-07-07',
        value: 340,
      },
      nombreMoyenJournéesAbsencePersonnesAccompagnées: {
        dateMiseÀJourSource: '2021-07-07',
        value: 87,
      },
      numéroFinessÉtablissementTerritorial: '010003598',
      tauxOccupationAccueilDeJour: {
        dateMiseÀJourSource: '2021-07-07',
        value: 0.004,
      },
      tauxOccupationHébergementPermanent: {
        dateMiseÀJourSource: '2021-07-07',
        value: 0.944,
      },
      tauxOccupationHébergementTemporaire: {
        dateMiseÀJourSource: '2021-07-07',
        value: 0.704,
      },
      tauxRéalisationActivité: {
        dateMiseÀJourSource: '2021-07-07',
        value: 1.004,
      },
    },
    {
      année: 2020,
      dateMiseÀJourSource: '2021-07-07',
      duréeMoyenneSéjourAccompagnementPersonnesSorties: {
        dateMiseÀJourSource: '2021-07-07',
        value: 994,
      },
      fileActivePersonnesAccompagnées: {
        dateMiseÀJourSource: '2021-07-07',
        value: 280,
      },
      nombreMoyenJournéesAbsencePersonnesAccompagnées: {
        dateMiseÀJourSource: '2021-07-07',
        value: 90,
      },
      numéroFinessÉtablissementTerritorial: '010003598',
      tauxOccupationAccueilDeJour: {
        dateMiseÀJourSource: '2021-07-07',
        value: 0.155,
      },
      tauxOccupationHébergementPermanent: {
        dateMiseÀJourSource: '2021-07-07',
        value: 0.975,
      },
      tauxOccupationHébergementTemporaire: {
        dateMiseÀJourSource: '2021-07-07',
        value: 1.215,
      },
      tauxRéalisationActivité: {
        dateMiseÀJourSource: '2021-07-07',
        value: 0.945,
      },
    },
    {
      année: 2021,
      dateMiseÀJourSource: '2021-07-07',
      duréeMoyenneSéjourAccompagnementPersonnesSorties: {
        dateMiseÀJourSource: '2021-07-07',
        value: 990,
      },
      fileActivePersonnesAccompagnées: {
        dateMiseÀJourSource: '2021-07-07',
        value: 300,
      },
      nombreMoyenJournéesAbsencePersonnesAccompagnées: {
        dateMiseÀJourSource: '2021-07-07',
        value: 22,
      },
      numéroFinessÉtablissementTerritorial: '010003598',
      tauxOccupationAccueilDeJour: {
        dateMiseÀJourSource: '2021-07-07',
        value: 0.206,
      },
      tauxOccupationHébergementPermanent: {
        dateMiseÀJourSource: '2021-07-07',
        value: 1.016,
      },
      tauxOccupationHébergementTemporaire: {
        dateMiseÀJourSource: '2021-07-07',
        value: 0.676,
      },
      tauxRéalisationActivité: {
        dateMiseÀJourSource: '2021-07-07',
        value: 0.966,
      },
    },
  ]

  public static crée(
    wording: Wording,
    paths: Paths,
    champsSurchargés?: Partial<ÉtablissementTerritorialMédicoSocial['identité']>
  ): ÉtablissementTerritorialMédicoSocialViewModel {
    return new ÉtablissementTerritorialMédicoSocialViewModel({
      activités: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.activités,
      identité: {
        ...ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.identité,
        ...champsSurchargés,
      },
    }, wording, paths)
  }
}
