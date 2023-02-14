import { ÉtablissementTerritorialSanitaireActivité } from "../../../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireActivité";

export type ActivitéMCO = Pick<
  ÉtablissementTerritorialSanitaireActivité,
  | "année"
  | "nombreSéjoursPartielsMédecine"
  | "nombreSéjoursCompletsMédecine"
  | "nombreSéjoursPartielsChirurgie"
  | "nombreSéjoursCompletsChirurgie"
  | "nombreSéjoursPartielsObstétrique"
  | "nombreSéjoursCompletsObstétrique"
>;
