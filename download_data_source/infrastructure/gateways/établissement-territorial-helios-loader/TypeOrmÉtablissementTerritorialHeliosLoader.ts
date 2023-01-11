import { DataSource } from "typeorm";

import { ÉtablissementTerritorialIdentitéModel } from "../../../../database/models/ÉtablissementTerritorialIdentitéModel";
import { ÉtablissementTerritorialHeliosLoader } from "../../../métier/gateways/ÉtablissementTerritorialHeliosLoader";

export class TypeOrmÉtablissementTerritorialHeliosLoader implements ÉtablissementTerritorialHeliosLoader {
  constructor(private readonly orm: Promise<DataSource>) {}

  async récupèreLeNuméroFinessDesÉtablissementsTerritoriaux(): Promise<string[]> {
    const établissementsTerritoriaux = await (await this.orm)
      .getRepository(ÉtablissementTerritorialIdentitéModel)
      .find({ order: { numéroFinessÉtablissementTerritorial: "ASC" }, select: { numéroFinessÉtablissementTerritorial: true } });
    return this.listeLesNumérosFiness(établissementsTerritoriaux);
  }

  private listeLesNumérosFiness(établissementTerritorialIdentitéModels: ÉtablissementTerritorialIdentitéModel[]): string[] {
    return établissementTerritorialIdentitéModels.map((établissementTerritorial) => établissementTerritorial.numéroFinessÉtablissementTerritorial);
  }
}
