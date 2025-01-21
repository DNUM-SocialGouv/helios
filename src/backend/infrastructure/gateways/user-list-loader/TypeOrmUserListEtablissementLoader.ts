import { DataSource } from "typeorm";

import { UserListEtablissementModel } from "../../../../../database/models/UserListEtablissementModel";
import { UserListModel } from "../../../../../database/models/UserListModel";
import { UserListEtablissementLoader } from "../../../métier/gateways/UserListEtablissementLoader";

export class TypeOrmUserListEtablissementLoader implements UserListEtablissementLoader {
    constructor(private readonly orm: Promise<DataSource>) { }

    async create(userId: string, listId: number, finessNumber: string, typeEtablissement: string): Promise<void> {
        const userListEtablissementModel = new UserListEtablissementModel();
        userListEtablissementModel.listId = listId;
        userListEtablissementModel.finessNumber = finessNumber;
        userListEtablissementModel.typeEtablissement = typeEtablissement;

        const countList = await (await this.orm).getRepository(UserListModel).countBy({ id: listId, userId: userId });

        if (countList !== 0) {
            await (await this.orm).getRepository(UserListEtablissementModel).save(userListEtablissementModel);
        }
    }

    async delete(userId: string, listId: number, finess: string): Promise<void> {
        const countList = await (await this.orm).getRepository(UserListModel).countBy({ id: listId, userId: userId });

        if (countList !== 0) {
            await (await this.orm).getRepository(UserListEtablissementModel).delete({ listId: listId, finessNumber: finess });
        }
    }
}