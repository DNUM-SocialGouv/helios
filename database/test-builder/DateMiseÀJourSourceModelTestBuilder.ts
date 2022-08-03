import { DateMiseÀJourSourceModel, SourceDeDonnées } from '../models/DateMiseÀJourSourceModel'

export class DateMiseÀJourSourceModelTestBuilder {
  public static crée(champsSurchargés?: Partial<DateMiseÀJourSourceModel>): DateMiseÀJourSourceModel {
    const dateMiseÀJourSourceModel = new DateMiseÀJourSourceModel()
    dateMiseÀJourSourceModel.dernièreMiseÀJour = champsSurchargés?.dernièreMiseÀJour || '2022-05-14'
    dateMiseÀJourSourceModel.source = champsSurchargés?.source || SourceDeDonnées.FINESS
    return dateMiseÀJourSourceModel
  }
}
