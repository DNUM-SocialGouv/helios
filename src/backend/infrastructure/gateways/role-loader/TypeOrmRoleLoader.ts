import { DataSource } from "typeorm";

import { RoleModel } from "../../../../../database/models/RoleModel";
import { RoleLoader } from "../../../métier/gateways/RoleLoader";

export class TypeOrmRoleLoader implements RoleLoader {
  constructor(private readonly orm: Promise<DataSource>) {}

  async getAllRoles(): Promise<RoleModel[]> {
    return await (await this.orm).getRepository(RoleModel).find();
  }
}
