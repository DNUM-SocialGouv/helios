import { DateMiseÀJourFichierSourceModel, FichierSource } from "../models/DateMiseÀJourFichierSourceModel";

export class DateMiseÀJourFichierSourceModelTestBuilder {
  public static crée(champsSurchargés?: Partial<DateMiseÀJourFichierSourceModel>): DateMiseÀJourFichierSourceModel {
    const dateMiseÀJourFichierSourceModel = new DateMiseÀJourFichierSourceModel();
    dateMiseÀJourFichierSourceModel.dernièreMiseÀJour = champsSurchargés?.dernièreMiseÀJour || "2022-05-14";
    dateMiseÀJourFichierSourceModel.fichier = champsSurchargés?.fichier || FichierSource.FINESS_CS1400101;
    return dateMiseÀJourFichierSourceModel;
  }

  public static créePourTousLesFichiers(): DateMiseÀJourFichierSourceModel[] {
    return Object.values(FichierSource).map((fichier) => {
      return DateMiseÀJourFichierSourceModelTestBuilder.crée({
        dernièreMiseÀJour: "2022-02-02",
        fichier,
      });
    });
  }
}
