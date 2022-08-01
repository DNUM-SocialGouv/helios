import { ÉtablissementTerritorialMédicoSocial } from '../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocial'
import { Paths } from '../configuration/Paths'
import { Wording } from '../configuration/wording/Wording'
import { ÉtablissementTerritorialMédicoSocialViewModel } from '../ui/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialViewModel'

export class ÉtablissementTerritorialMédicoSocialViewModelTestBuilder {
  private static identité: ÉtablissementTerritorialMédicoSocial['identité'] = {
    adresseAcheminement: {
      dateMiseAJourSource: '2021-07-07',
      value: '01117 OYONNAX CEDEX',
    },
    adresseNuméroVoie: {
      dateMiseAJourSource: '2021-07-07',
      value: '1',
    },
    adresseTypeVoie: {
      dateMiseAJourSource: '2021-07-07',
      value: 'RTE',
    },
    adresseVoie: {
      dateMiseAJourSource: '2021-07-07',
      value: 'DE VEYZIAT',
    },
    catégorieÉtablissement: {
      dateMiseAJourSource: '2021-07-07',
      value: '300',
    },
    courriel: {
      dateMiseAJourSource: '2021-07-07',
      value: 'a@example.com',
    },
    dateMiseAJourSource: '2021-07-07',
    estMonoÉtablissement: {
      dateMiseAJourSource: '2021-07-07',
      value: false,
    },
    libelléCatégorieÉtablissement: {
      dateMiseAJourSource: '2021-07-07',
      value: 'Ecoles Formant aux Professions Sanitaires',
    },
    numéroFinessEntitéJuridique: {
      dateMiseAJourSource: '2021-07-07',
      value: '010008407',
    },
    numéroFinessÉtablissementPrincipal: {
      dateMiseAJourSource: '2021-07-07',
      value: '010005239',
    },
    numéroFinessÉtablissementTerritorial: {
      dateMiseAJourSource: '2021-07-07',
      value: '010003598',
    },
    raisonSociale: {
      dateMiseAJourSource: '2021-07-07',
      value: 'IFAS CH DU HAUT BUGEY',
    },
    raisonSocialeDeLEntitéDeRattachement: {
      dateMiseAJourSource: '2021-07-07',
      value: 'CH DU HAUT BUGEY',
    },
    statutJuridique: {
      dateMiseAJourSource: '2021-07-07',
      value: 'Etablissement Public Intercommunal d’Hospitalisation',
    },
    typeÉtablissement: {
      dateMiseAJourSource: '2021-07-07',
      value: 'S',
    },
    téléphone: {
      dateMiseAJourSource: '2021-07-07',
      value: '0123456789',
    },
  }

  private static activités: ÉtablissementTerritorialMédicoSocial['activités'] = [
    {
      année: 2019,
      dateMiseAJourSource: '2021-07-07',
      duréeMoyenneSéjourAccompagnementPersonnesSorties: {
        dateMiseAJourSource: '2021-07-07',
        value: 1013,
      },
      fileActivePersonnesAccompagnées: {
        dateMiseAJourSource: '2021-07-07',
        value: 340,
      },
      nombreMoyenJournéesAbsencePersonnesAccompagnées: {
        dateMiseAJourSource: '2021-07-07',
        value: 87,
      },
      numéroFinessÉtablissementTerritorial: '010003598',
      tauxOccupationAccueilDeJour: {
        dateMiseAJourSource: '2021-07-07',
        value: 0.004,
      },
      tauxOccupationHébergementPermanent: {
        dateMiseAJourSource: '2021-07-07',
        value: 0.944,
      },
      tauxOccupationHébergementTemporaire: {
        dateMiseAJourSource: '2021-07-07',
        value: 0.704,
      },
      tauxRéalisationActivité: {
        dateMiseAJourSource: '2021-07-07',
        value: 1.004,
      },
    },
    {
      année: 2020,
      dateMiseAJourSource: '2021-07-07',
      duréeMoyenneSéjourAccompagnementPersonnesSorties: {
        dateMiseAJourSource: '2021-07-07',
        value: 994,
      },
      fileActivePersonnesAccompagnées: {
        dateMiseAJourSource: '2021-07-07',
        value: 280,
      },
      nombreMoyenJournéesAbsencePersonnesAccompagnées: {
        dateMiseAJourSource: '2021-07-07',
        value: 90,
      },
      numéroFinessÉtablissementTerritorial: '010003598',
      tauxOccupationAccueilDeJour: {
        dateMiseAJourSource: '2021-07-07',
        value: 0.155,
      },
      tauxOccupationHébergementPermanent: {
        dateMiseAJourSource: '2021-07-07',
        value: 0.975,
      },
      tauxOccupationHébergementTemporaire: {
        dateMiseAJourSource: '2021-07-07',
        value: 1.215,
      },
      tauxRéalisationActivité: {
        dateMiseAJourSource: '2021-07-07',
        value: 0.945,
      },
    },
    {
      année: 2021,
      dateMiseAJourSource: '2021-07-07',
      duréeMoyenneSéjourAccompagnementPersonnesSorties: {
        dateMiseAJourSource: '2021-07-07',
        value: 990,
      },
      fileActivePersonnesAccompagnées: {
        dateMiseAJourSource: '2021-07-07',
        value: 300,
      },
      nombreMoyenJournéesAbsencePersonnesAccompagnées: {
        dateMiseAJourSource: '2021-07-07',
        value: 22,
      },
      numéroFinessÉtablissementTerritorial: '010003598',
      tauxOccupationAccueilDeJour: {
        dateMiseAJourSource: '2021-07-07',
        value: 0.206,
      },
      tauxOccupationHébergementPermanent: {
        dateMiseAJourSource: '2021-07-07',
        value: 1.016,
      },
      tauxOccupationHébergementTemporaire: {
        dateMiseAJourSource: '2021-07-07',
        value: 0.676,
      },
      tauxRéalisationActivité: {
        dateMiseAJourSource: '2021-07-07',
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
