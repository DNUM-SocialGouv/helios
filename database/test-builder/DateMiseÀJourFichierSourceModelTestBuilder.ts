import { DateMiseÀJourFichierSourceModel, FichierSource } from '../models/DateMiseÀJourFichierSourceModel'

export class DateMiseÀJourFichierSourceModelTestBuilder {
  public static crée(champsSurchargés?: Partial<DateMiseÀJourFichierSourceModel>): DateMiseÀJourFichierSourceModel {
    const dateMiseÀJourSourceModel = new DateMiseÀJourFichierSourceModel()
    dateMiseÀJourSourceModel.dernièreMiseÀJour = champsSurchargés?.dernièreMiseÀJour || '2022-05-14'
    dateMiseÀJourSourceModel.fichier = champsSurchargés?.fichier || FichierSource.FINESS_CS1400101
    return dateMiseÀJourSourceModel
  }
}
