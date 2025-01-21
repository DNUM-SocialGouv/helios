import { UserListEtablissementLoader } from "../gateways/UserListEtablissementLoader";

export class UserListEtablissementUseCase {
    constructor(private userListEtablissementLoader: UserListEtablissementLoader) { }

    async create(idUser: string, listId: number, finessNumber: string, typeEtablissement: string) {
        return await this.userListEtablissementLoader.create(idUser, listId, finessNumber, typeEtablissement);
    }

    async delete(idUser: string, idList: number, finessNumber: string): Promise<void> {
        return await this.userListEtablissementLoader.delete(idUser, idList, finessNumber);
    }
}