import { UtilisateursUseCase } from "../../métier/use-cases/UtilisateursUseCase";
import { Dependencies } from "../dependencies";

export async function getUsersListPaginatedEndpoint(
  dependencies: Dependencies,
  key: string,
  sort: string,
  pdescrtion: number,
  institutionId: number,
  roleId: number,
  profilId: string,
  itemsPerPage: number
): Promise<any> {
  try {
    const UtilisateurUseCase = new UtilisateursUseCase(dependencies.utilisateurLoader);
    return await UtilisateurUseCase.getUsersListPaginated(key, sort, pdescrtion, institutionId, roleId, profilId, itemsPerPage);
  } catch (error) {
    dependencies.logger.error(error);
    throw error;
  }
}
