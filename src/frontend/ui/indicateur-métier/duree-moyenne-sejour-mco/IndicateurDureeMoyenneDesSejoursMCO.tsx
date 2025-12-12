import { ÉtablissementTerritorialSanitaireActivité } from "../../../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireActivité";

export type ActiviteMoyenneMCO = Pick<
  ÉtablissementTerritorialSanitaireActivité,
  | "année"
  | "dureeMoyenneSejourMedecine"
  | "dureeMoyenneSejourChirurgie"
  | "dureeMoyenneSejourObstetrique"
>;
