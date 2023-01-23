import { DomaineÉtablissementTerritorial } from "../../backend/métier/entities/DomaineÉtablissementTerritorial";
import { ÉtablissementTerritorialRattaché } from "../../backend/métier/entities/entité-juridique/ÉtablissementTerritorialRattaché";

export const établissementMédicoSocial: ÉtablissementTerritorialRattaché = {
  domaine: DomaineÉtablissementTerritorial.MÉDICO_SOCIAL,
  numéroFiness: "010000040",
  raisonSocialeCourte: "CH NANTUA",
};

export const établissementSanitaire: ÉtablissementTerritorialRattaché = {
  domaine: DomaineÉtablissementTerritorial.SANITAIRE,
  numéroFiness: "590782553",
  raisonSocialeCourte: "HP VILLENEUVE DASCQ",
};
