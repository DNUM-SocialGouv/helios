import { DataSource } from "typeorm";

import { ÉtablissementTerritorialIdentitéModel } from "../../../../../database/models/ÉtablissementTerritorialIdentitéModel";
import { ÉtablissementTerritorialRattaché } from "../../../métier/entities/entité-juridique/ÉtablissementTerritorialRattaché";
import { ÉtablissementTerritorialRattachéLoader } from "../../../métier/gateways/ÉtablissementTerritorialRattachéLoader";

export class TypeOrmÉtablissementTerritorialRattachéLoader implements ÉtablissementTerritorialRattachéLoader {
  constructor(private readonly orm: Promise<DataSource>) {}

  async chargeLesÉtablissementsDeLEntitéJuridiqueDeRattachement(numéroFinessEntitéJuridique: string): Promise<ÉtablissementTerritorialRattaché[]> {
    const établissementsTerritoriauxModels = await this.chargeLesÉtablissementsRattachésÀLEntitéJuridique(numéroFinessEntitéJuridique);

    return this.construisLesÉtablissementsTerritoriauxRattachés(établissementsTerritoriauxModels);
  }

  private async chargeLesÉtablissementsRattachésÀLEntitéJuridique(numéroFinessEntitéJuridique: string) {
    return await (await this.orm)
      .getRepository(ÉtablissementTerritorialIdentitéModel)
      .find({ order: { domaine: "ASC", numéroFinessÉtablissementTerritorial: "ASC" }, where: { numéroFinessEntitéJuridique } });
  }

  private construisLesÉtablissementsTerritoriauxRattachés(
    établissementsTerritoriauxModels: ÉtablissementTerritorialIdentitéModel[]
  ): ÉtablissementTerritorialRattaché[] {
    return établissementsTerritoriauxModels.map((établissementTerritorialModel): ÉtablissementTerritorialRattaché => {
      return {
        domaine: établissementTerritorialModel.domaine,
        numéroFiness: établissementTerritorialModel.numéroFinessÉtablissementTerritorial,
        raisonSocialeCourte: établissementTerritorialModel.raisonSocialeCourte,
      };
    });
  }
}
