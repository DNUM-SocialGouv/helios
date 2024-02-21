import { UtilisateursUseCase } from "../../métier/use-cases/UtilisateursUseCase";
import { Dependencies } from "../dependencies";

export async function getUsersListPaginatedEndpoint(
  dependencies: Dependencies,
  key: string,
  pdescrtion: number,
  institutionId: number,
  roleId: number,
  profilId: string,
  etatId: string,
  itemsPerPage: number,
  orderBy: string,
  sortDir: string
): Promise<any> {
  try {
    const UtilisateurUseCase = new UtilisateursUseCase(dependencies.utilisateurLoader);
    return await UtilisateurUseCase.getUsersListPaginated(key, pdescrtion, institutionId, roleId, profilId, etatId, itemsPerPage, orderBy, sortDir);
  } catch (error) {
    dependencies.logger.error(error);
    throw error;
  }
}
