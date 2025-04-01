import { DataSource } from "typeorm";

import { UserListModel } from "../../../../../database/models/UserListModel";
import { InformationSurListe } from "../../../métier/entities/liste/InformationSurListe";
import { UserListLoader } from "../../../métier/gateways/UserListLoader";

export class TypeOrmUserListLoader implements UserListLoader {
  constructor(private readonly orm: Promise<DataSource>) { }

  async create(idUser: string, listName: string, isFavoris: boolean = false): Promise<UserListModel> {
    return (await (await this.orm)
      .createQueryBuilder()
      .insert()
      .into(UserListModel)
      .values([
        { nom: listName, userId: idUser, isFavoris: isFavoris },
      ])
      .returning(['id', 'nom', 'isFavoris', 'userId', 'dateCreation'])
      .execute())
      .generatedMaps[0] as UserListModel;

  }
  async getAll(idUser: string): Promise<UserListModel[]> {
    return await (await this.orm).getRepository(UserListModel).findBy({ userId: idUser });
  }
  async getById(idUser: string, idList: number): Promise<UserListModel | null> {
    return await (await this.orm).getRepository(UserListModel).findOneBy({ id: idList, userId: idUser });
  }
  async getAllIdAndName(idUser: string): Promise<InformationSurListe[]> {
    const requêteDeLaRecherche = (await this.orm)
      .createQueryBuilder()
      .select("liste.id", "id")
      .addSelect("liste.nom", "nom")
      .from(UserListModel, "liste")
      .where("liste.userId = :idUser", { idUser: idUser });

    return (await requêteDeLaRecherche.getRawMany<UserListModel>()).map((list) => {
      return {
        id: list.id,
        nom: list.nom,
      }
    });
  }
  async updateName(idUser: string, idList: number, listName: string): Promise<UserListModel | null> {
    await (await this.orm).getRepository(UserListModel).update({ id: idList, userId: idUser }, { nom: listName });
    return this.getById(idUser, idList)
  }
  async delete(idUser: string, idList: number): Promise<void> {
    await (await this.orm).getRepository(UserListModel).delete({ id: idList, userId: idUser });
  }

  async count(idUser: string): Promise<number> {
    return await (await this.orm).getRepository(UserListModel).countBy({ userId: idUser });
  }
}
