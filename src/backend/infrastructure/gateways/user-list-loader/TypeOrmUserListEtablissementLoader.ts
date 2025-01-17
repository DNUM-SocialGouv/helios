import { DataSource } from "typeorm";

import { UserListEtablissementModel } from "../../../../../database/models/UserListEtablissementModel";
import { UserListEtablissementLoader } from "../../../métier/gateways/UserListEtablissementLoader";

export class TypeOrmUserListEtablissementLoader implements UserListEtablissementLoader {
    constructor(private readonly orm: Promise<DataSource>) { }

    async create(listId: number, finessNumber: string, typeEtablissement: string): Promise<void> {
        const userListEtablissementModel = new UserListEtablissementModel();
        userListEtablissementModel.listId = listId;
        userListEtablissementModel.finessNumber = finessNumber;
        userListEtablissementModel.typeEtablissement = typeEtablissement;

        await (await this.orm).getRepository(UserListEtablissementModel).save(userListEtablissementModel);
    }

    async delete(idList: number, finess: string): Promise<void> {
        await (await this.orm).getRepository(UserListEtablissementModel).delete({ listId: idList, finessNumber: finess });
    }
}