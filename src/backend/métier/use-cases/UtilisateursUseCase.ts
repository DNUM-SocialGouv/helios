import { UtilisateurModel } from "../../../../database/models/UtilisateurModel";
import { UtilisateurLoader } from "../gateways/UtilisateurLoader";

export class UtilisateursUseCase {
  constructor(private utilisateurLoader: UtilisateurLoader) {}

  async getUsersListPaginated(key: string, sort: string, pdescrtion: number): Promise<void> {
    return await this.utilisateurLoader.getUsersListPaginated(key, sort, pdescrtion);
  }

  async getUserByCode(code: string): Promise<UtilisateurModel | null> {
    return await this.utilisateurLoader.getUserByCode(code);
  }
}
