import { DataSource } from "typeorm";

import { ParametrageJsonModel } from "../../../../../database/models/ParametrageJsonModel";
import type { ParametrageJsonLoader } from "../../../métier/gateways/ParametrageJsonLoader";


export class TypeOrmParametrageJsonLoader implements ParametrageJsonLoader {
  constructor(private readonly orm: Promise<DataSource>) { }

  private async repository() {
    return (await this.orm).getRepository(ParametrageJsonModel);
  }

  async recupererParametrage(slug: string): Promise<Record<string, unknown>> {
    const repository = await this.repository();
    let enregistrement = await repository.findOne({ where: { slug: slug } });

    enregistrement ??= await repository.save(
      repository.create({ slug: slug, contenu: {} })
    );

    return (enregistrement.contenu ?? {});
  }

  async enregistrerParametrage(slug: string, contenu: Record<string, unknown>): Promise<void> {
    const repository = await this.repository();
    const enregistrement = await repository.findOne({ where: { slug: slug } });

    if (enregistrement) {
      await repository.save({ ...enregistrement, contenu });
      return;
    }

    await repository.save(repository.create({ slug: slug, contenu }));
  }
}
