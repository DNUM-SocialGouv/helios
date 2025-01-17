import { DataSource } from "typeorm";

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
        return (await this.orm).getRepository(UserListModel).save(userListModel);
    }
    async getAll(idUser: string): Promise<UserListModel[]> {
        return await (await this.orm).getRepository(UserListModel).findBy({ userId: idUser });
    }
    async getById(idList: number): Promise<UserListModel | null> {
        return await (await this.orm).getRepository(UserListModel).findOneBy({ id: idList });
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
    async updateName(idList: number, listName: string): Promise<void> {
        await (await this.orm).getRepository(UserListModel).update(idList, { nom: listName });
    }
    async delete(idList: number): Promise<void> {
        await (await this.orm).getRepository(UserListModel).delete(idList);
    }
}