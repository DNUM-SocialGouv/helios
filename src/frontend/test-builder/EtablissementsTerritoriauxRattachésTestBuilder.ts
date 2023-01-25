import { DomaineÉtablissementTerritorial } from "../../backend/métier/entities/DomaineÉtablissementTerritorial";
import { ÉtablissementTerritorialRattaché } from "../../backend/métier/entities/entité-juridique/ÉtablissementTerritorialRattaché";
import { Wording } from "../configuration/wording/Wording";
import { EtablissementsTerritoriauxRattachésViewModel } from "../ui/entité-juridique/liste-des-établissements/EtablissementsTerritoriauxRattachésViewModel";

export class EtablissementsTerritoriauxRattachésTestBuilder {
  private établissements: ÉtablissementTerritorialRattaché[] = [];

  constructor(private wording: Wording) {}

  avecEtablissementSanitaire(champsSurchargés?: Partial<ÉtablissementTerritorialRattaché>): this {
    this.établissements.push({
      ...établissementSanitaire,
      numéroFiness: établissementSanitaire.numéroFiness + this.établissements.length,
      ...champsSurchargés,
    });
    return this;
  }

  avecEtablissementMédicoSocial(champsSurchargés?: Partial<ÉtablissementTerritorialRattaché>): this {
    this.établissements.push({
      ...établissementMédicoSocial,
      numéroFiness: établissementMédicoSocial.numéroFiness + this.établissements.length,
      ...champsSurchargés,
    });
    return this;
  }

  build(): EtablissementsTerritoriauxRattachésViewModel {
    return new EtablissementsTerritoriauxRattachésViewModel(this.établissements, this.wording);
  }

  avecNEtablissementsSanitaires(number: number) {
    for (let i = 0; i < number; i++) {
      this.avecEtablissementSanitaire();
    }
    return this;
  }

  avecNEtablissementsMedicoSociaux(number: number) {
    for (let i = 0; i < number; i++) {
      this.avecEtablissementMédicoSocial();
    }
    return this;
  }
}

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
