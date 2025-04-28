import { RoleModel } from "../../../../database/models/RoleModel";
import { RoleLoader } from "../gateways/RoleLoader";

export class RolesUseCase {
  constructor(private readonly roleLoader: RoleLoader) { }

  async getAllRoles(): Promise<RoleModel[]> {
    return await this.roleLoader.getAllRoles();
  }
}
