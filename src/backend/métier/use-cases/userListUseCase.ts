import { UserListModel } from "../../../../database/models/UserListModel"
import { InformationSurListe } from "../../métier/entities/liste/InformationSurListe";
import { UserListLoader } from "../gateways/UserListLoader";

export class UserListUseCase {
  constructor(private userListLoader: UserListLoader) { }

  async create(idUser: string, listName: string, isFavoris: boolean = false): Promise<UserListModel> {
    return await this.userListLoader.create(idUser, listName, isFavoris); // TODO security
  }

  async getAll(idUser: string): Promise<UserListModel[]> {
    return await this.userListLoader.getAll(idUser); // TODO security
  }

  async getById(idUser: string, idList: number): Promise<UserListModel | null> {
    return await this.userListLoader.getById(idUser, idList); // TODO security
  }

  async getAllIdAndName(idUser: string): Promise<InformationSurListe[]> {
    return await this.userListLoader.getAllIdAndName(idUser); // TODO security
  }

  async updateName(idUser: string, idList: number, listName: string): Promise<UserListModel | null> {
    return await this.userListLoader.updateName(idUser, idList, listName); // TODO security
  }

  async delete(idUser: string, idList: number): Promise<void> {
    return await this.userListLoader.delete(idUser, idList); // TODO security
  }

  async count(idUser: string): Promise<number> {
    return await this.userListLoader.count(idUser);
  }
}
