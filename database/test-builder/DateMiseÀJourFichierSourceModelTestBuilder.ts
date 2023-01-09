import { DateMiseÀJourFichierSourceModel, FichierSource } from '../models/DateMiseÀJourFichierSourceModel'

export class DateMiseÀJourFichierSourceModelTestBuilder {
  public static crée(champsSurchargés?: Partial<DateMiseÀJourFichierSourceModel>): DateMiseÀJourFichierSourceModel {
    const dateMiseÀJourFichierSourceModel = new DateMiseÀJourFichierSourceModel()
    dateMiseÀJourFichierSourceModel.dernièreMiseÀJour = champsSurchargés?.dernièreMiseÀJour || '2022-05-14'
    dateMiseÀJourFichierSourceModel.fichier = champsSurchargés?.fichier || FichierSource.FINESS_CS1400101
    return dateMiseÀJourFichierSourceModel
  }

  public static créePourFichiersFiness(): DateMiseÀJourFichierSourceModel[] {
    return [
      DateMiseÀJourFichierSourceModelTestBuilder.crée({
        dernièreMiseÀJour: '2022-05-14',
        fichier: FichierSource.FINESS_CS1400102,
      }),
      DateMiseÀJourFichierSourceModelTestBuilder.crée({
        dernièreMiseÀJour: '2022-08-29',
        fichier: FichierSource.FINESS_CS1400103,
      }),
      DateMiseÀJourFichierSourceModelTestBuilder.crée({
        dernièreMiseÀJour: '2022-08-29',
        fichier: FichierSource.FINESS_CS1400104,
      }),
      DateMiseÀJourFichierSourceModelTestBuilder.crée({
        dernièreMiseÀJour: '2022-08-18',
        fichier: FichierSource.FINESS_CS1400105,
      }),
      DateMiseÀJourFichierSourceModelTestBuilder.crée({
        dernièreMiseÀJour: '2022-08-29',
        fichier: FichierSource.FINESS_CS1600101,
      }),
      DateMiseÀJourFichierSourceModelTestBuilder.crée({
        dernièreMiseÀJour: '2022-08-29',
        fichier: FichierSource.FINESS_CS1600102,
      }),
    ]
  }

  public static créePourFichiersDiamant(): DateMiseÀJourFichierSourceModel[] {
    return [
      DateMiseÀJourFichierSourceModelTestBuilder.crée({
        dernièreMiseÀJour: '2022-09-02',
        fichier: FichierSource.DIAMANT_ANN_SAE,
      }),
      DateMiseÀJourFichierSourceModelTestBuilder.crée({
        dernièreMiseÀJour: '2022-05-14',
        fichier: FichierSource.DIAMANT_ANN_RPU,
      }),
      DateMiseÀJourFichierSourceModelTestBuilder.crée({
        dernièreMiseÀJour: '2022-05-15',
        fichier: FichierSource.DIAMANT_MEN_PMSI_ANNUEL,
      }),
      DateMiseÀJourFichierSourceModelTestBuilder.crée({
        dernièreMiseÀJour: '2022-05-13',
        fichier: FichierSource.DIAMANT_ANN_MS_TDP_ET,
      }),
      DateMiseÀJourFichierSourceModelTestBuilder.crée({
        dernièreMiseÀJour: '2022-05-15',
        fichier: FichierSource.DIAMANT_ANN_ERRD_EJ_ET,
      }),
      DateMiseÀJourFichierSourceModelTestBuilder.crée({
        dernièreMiseÀJour: '2022-02-02',
        fichier: FichierSource.DIAMANT_ANN_CA_EJ_ET,
      }),
      DateMiseÀJourFichierSourceModelTestBuilder.crée({
        dernièreMiseÀJour: '2022-03-03',
        fichier: FichierSource.DIAMANT_ANN_ERRD_EJ,
      }),
    ]
  }

  public static créePourTousLesFichiers(): DateMiseÀJourFichierSourceModel[] {
    return Object.values(FichierSource).map((fichier) => {
      return DateMiseÀJourFichierSourceModelTestBuilder.crée({
        dernièreMiseÀJour: '2022-02-02',
        fichier,
      })
    } )
  }
}
