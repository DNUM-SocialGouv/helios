import { DataSource } from "typeorm";

import { EntitéJuridiqueModel } from "../../../../database/models/EntitéJuridiqueModel";
import { EntitéJuridiqueHeliosLoader } from "../../../métier/gateways/EntitéJuridiqueHeliosLoader";

export class TypeOrmEntitéJuridiqueHeliosLoader implements EntitéJuridiqueHeliosLoader {
  constructor(private readonly orm: Promise<DataSource>) {}

  async récupèreLeNuméroFinessDesEntitésJuridiques(): Promise<string[]> {
    const entitésJuridiques = await (await this.orm)
      .getRepository(EntitéJuridiqueModel)
      .find({ order: { numéroFinessEntitéJuridique: "ASC" }, select: { numéroFinessEntitéJuridique: true } });
    return this.listeLesNumérosFiness(entitésJuridiques);
  }

  private listeLesNumérosFiness(entitésJuridiques: EntitéJuridiqueModel[]): string[] {
    return entitésJuridiques.map((entitéJuridique) => entitéJuridique.numéroFinessEntitéJuridique);
  }
}
