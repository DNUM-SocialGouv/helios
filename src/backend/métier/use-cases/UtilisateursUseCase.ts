import { UtilisateurModel } from "../../../../database/models/UtilisateurModel";
import { UtilisateurLoader } from "../gateways/UtilisateurLoader";

export class UtilisateursUseCase {
  constructor(private utilisateurLoader: UtilisateurLoader) {}

  async getUsersListPaginated(key: string, sort: string, pdescrtion: number, institutionId: number, roleId: number, profilId: string): Promise<void> {
    return await this.utilisateurLoader.getUsersListPaginated(key, sort, pdescrtion, institutionId, roleId, profilId);
  }

  async getUserByCode(code: string): Promise<UtilisateurModel | null> {
    return await this.utilisateurLoader.getUserByCode(code);
  }

  async updateUser(userCode: string, roleCode: string, institutionCode: string, profilsCode: string[]): Promise<UtilisateurModel | null> {
    return this.utilisateurLoader.updateUser(userCode, roleCode, institutionCode, profilsCode);
  }
}
