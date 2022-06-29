import { DateMiseÀJourSourceModel, SourceDeDonnées } from '../models/DateMiseÀJourSourceModel'

export class DateMiseÀJourSourceModelTestFactory {
  public static crée(champsSurchargés?: Partial<DateMiseÀJourSourceModel>): DateMiseÀJourSourceModel {
    const dateMiseÀJourSourceModel = new DateMiseÀJourSourceModel()
    dateMiseÀJourSourceModel.dernièreMiseÀJour = champsSurchargés?.dernièreMiseÀJour || '20220514'
    dateMiseÀJourSourceModel.source = champsSurchargés?.source || SourceDeDonnées.FINESS
    return dateMiseÀJourSourceModel
  }
}
