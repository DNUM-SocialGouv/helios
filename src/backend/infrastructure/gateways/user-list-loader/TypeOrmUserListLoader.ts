import { DataSource } from "typeorm";

import { RechercheModel } from "../../../../../database/models/RechercheModel";
import { UserListModel } from "../../../../../database/models/UserListModel";
import { InformationSurListe } from "../../../métier/entities/liste/InformationSurListe";
import { UserListLoader } from "../../../métier/gateways/UserListLoader";

export class TypeOrmUserListLoader implements UserListLoader {
  constructor(private readonly orm: Promise<DataSource>) { }

  async create(idUser: string, listName: string, isFavoris: boolean = false): Promise<UserListModel> {
    const userListModel = new UserListModel();
    userListModel.nom = listName;
    userListModel.userId = idUser;
    userListModel.isFavoris = isFavoris;

    const insertResult = await (await this.orm)
      .createQueryBuilder()
      .insert()
      .into(UserListModel)
      .values(userListModel)
      .execute();
    return { ...userListModel, ...insertResult.generatedMaps[0] };
  }
  async getAll(idUser: string): Promise<UserListModel[]> {
    const requete = await (await this.orm)
      .getRepository(UserListModel)
      .createQueryBuilder("list")
      .leftJoinAndSelect(
        "list.userListEtablissements",
        "ule"
      )
      .innerJoin(
        RechercheModel,
        "recherche",
        "ule.finessNumber = recherche.numero_finess"
      )
      .where("list.userId = :idUser", { idUser })

    return requete.getMany();
  }
  async getById(idUser: string, idList: number): Promise<UserListModel | null> {

    const requete = await (await this.orm)
      .getRepository(UserListModel)
      .createQueryBuilder("list")
      .leftJoinAndSelect(
        "list.userListEtablissements",
        "ule"
      )
      .innerJoin(
        RechercheModel,
        "recherche",
        "ule.finessNumber = recherche.numero_finess"
      )
      .where("list.id = :idList", { idList })
      .andWhere("list.userId = :idUser", { idUser })

    return requete.getOne();
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
