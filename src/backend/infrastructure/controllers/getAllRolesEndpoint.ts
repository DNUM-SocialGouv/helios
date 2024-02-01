import { RoleModel } from "../../../../database/models/RoleModel";
import { RolesUseCase } from "../../métier/use-cases/RolesUseCase";
import { Dependencies } from "../dependencies";

export async function getAllRolesEndpoint(dependencies: Dependencies): Promise<RoleModel[]> {
  try {
    const RoleUseCase = new RolesUseCase(dependencies.roleLoader);
    return await RoleUseCase.getAllRoles();
  } catch (error) {
    dependencies.logger.error(error);
    throw error;
  }
}
