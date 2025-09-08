import { UtilisateurModel } from "../../../../database/models/UtilisateurModel";
import { UtilisateurLoader } from "../gateways/UtilisateurLoader";

export class UtilisateursUseCase {
  constructor(private readonly utilisateurLoader: UtilisateurLoader) { }

  async getUsersListPaginated(
    key: string,
    pdescrtion: number,
    institutionId: number,
    roleId: number,
    profilId: string,
    etatId: string,
    itemsPerPage: number,
    orderBy: string,
    sortDir: string
  ): Promise<void> {
    return await this.utilisateurLoader.getUsersListPaginated(key, pdescrtion, institutionId, roleId, profilId, etatId, itemsPerPage, orderBy, sortDir);
  }

  async getUserByCode(code: string): Promise<UtilisateurModel | null> {
    return await this.utilisateurLoader.getUserByCode(code);
  }

  async updateUser(
    userCode: string,
    roleCode: string,
    institutionCode: string,
    profilsCode: string[],
    firstname: string,
    lastname: string
  ): Promise<void> {
    return this.utilisateurLoader.updateUser(userCode, roleCode, institutionCode, profilsCode, firstname, lastname);
  }

  async deleteUser(userCode: string): Promise<string | void> {
    return this.utilisateurLoader.deleteUser(userCode);
  }

  async reactivateUser(userCode: string): Promise<string | void> {
    return this.utilisateurLoader.reactivateUser(userCode);
  }
}
