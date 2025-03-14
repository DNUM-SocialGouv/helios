import { RechercheModel } from "../../../../database/models/RechercheModel";
import { UserListEtablissementLoader } from "../gateways/UserListEtablissementLoader";

export class UserListEtablissementUseCase {
  constructor(private readonly userListEtablissementLoader: UserListEtablissementLoader) { }

  async getByListIdOrderedAndPaginated(idUser: string, listId: number, order: string, orderBy: string, page: number, limit: number, forExport: boolean): Promise<RechercheModel[]> {
    return await this.userListEtablissementLoader.getByListIdOrderedAndPaginated(idUser, listId, order, orderBy, page, limit, forExport);
  }

  async create(idUser: string, listId: number, finessNumber: string): Promise<boolean> {
    return await this.userListEtablissementLoader.create(idUser, listId, finessNumber);
  }

  async delete(idUser: string, idList: number, finessNumbers: string[]): Promise<boolean> {
    return await this.userListEtablissementLoader.delete(idUser, idList, finessNumbers);
  }
}
