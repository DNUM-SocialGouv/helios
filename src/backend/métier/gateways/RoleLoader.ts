import { RoleModel } from "../../../../database/models/RoleModel";

export interface RoleLoader {
  getAllRoles(): Promise<RoleModel[]>;
}
