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

  private static autorisations: ÉtablissementTerritorialMédicoSocial['autorisationsEtCapacités'] = {
    dateMiseÀJourSource: '2022-08-18',
    disciplines: [
      {
        activités: [
          {
            clientèles: [
              {
                code: '702',
                datesEtCapacités: {
                  capacitéAutoriséeTotale: 10,
                  capacitéInstalléeTotale: 10,
                  dateDAutorisation: '2020-01-01',
                  dateDeDernièreInstallation: '2020-01-01',
                  dateDeMiseÀJourDAutorisation: '2020-01-01',
                  estInstallée: true,
                },
                libellé: 'PH vieillissantes',
              },
              {
                code: '711',
                datesEtCapacités: {
                  capacitéAutoriséeTotale: 10,
                  capacitéInstalléeTotale: 10,
                  dateDAutorisation: '2020-01-01',
                  dateDeDernièreInstallation: '2020-01-01',
                  dateDeMiseÀJourDAutorisation: '2020-01-01',
                  estInstallée: true,
                },
                libellé: 'P.A. dépendantes',
              },
            ],
            code: '11',
            libellé: 'Hébergement Complet Internat',
          },
          {
            clientèles: [
              {
                code: '010',
                datesEtCapacités: {
                  capacitéAutoriséeTotale: 10,
                  capacitéInstalléeTotale: 10,
                  dateDAutorisation: '2020-01-01',
                  dateDeDernièreInstallation: '2020-01-01',
                  dateDeMiseÀJourDAutorisation: '2020-01-01',
                  estInstallée: true,
                },
                libellé: 'Tous Types de Déficiences Pers.Handicap.(sans autre indic.)',
              },
            ],
            code: '16',
            libellé: 'Prestation en milieu ordinaire',
          },
        ],
        code: '657',
        libellé: 'Accueil temporaire pour Personnes Âgées',
      },
      {
        activités: [
          {
            clientèles: [
              {
                code: '010',
                datesEtCapacités: {
                  capacitéAutoriséeTotale: 10,
                  capacitéInstalléeTotale: 10,
                  dateDAutorisation: '2020-01-01',
                  dateDeDernièreInstallation: '2020-01-01',
                  dateDeMiseÀJourDAutorisation: '2020-01-01',
                  estInstallée: true,
                },
                libellé: 'Tous Types de Déficiences Pers.Handicap.(sans autre indic.)',
              },
            ],
            code: '21',
            libellé: 'Accueil de Jour',
          },
        ],
        code: '658',
        libellé: 'Accueil temporaire pour adultes handicapés',
      },
    ],
    numéroFinessÉtablissementTerritorial: '010003598',
  }

  public static crée(
    wording: Wording,
    paths: Paths,
    champsSurchargés?: Partial<ÉtablissementTerritorialMédicoSocial['identité']>
  ): ÉtablissementTerritorialMédicoSocialViewModel {
    return new ÉtablissementTerritorialMédicoSocialViewModel({
      activités: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.activités,
      autorisationsEtCapacités: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.autorisations,
      identité: {
        ...ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.identité,
        ...champsSurchargés,
      },
    }, wording, paths)
  }
}
