import { DataSource } from "typeorm";

import { InstitutionModel } from "../../../../../database/models/InstitutionModel";
import { InstitutionLoader } from "../../../métier/gateways/InstitutionLoader";

export class TypeOrmInstitutionLoader implements InstitutionLoader {
  constructor(private readonly orm: Promise<DataSource>) {}

  async getInstitutionByCode(code: string): Promise<InstitutionModel | null> {
    return await (await this.orm).getRepository(InstitutionModel).findOne({ where: { codeGeo: code } });
  }
}
