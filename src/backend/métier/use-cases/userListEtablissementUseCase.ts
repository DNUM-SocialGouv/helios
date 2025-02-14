import { UserListEtablissementLoader } from "../gateways/UserListEtablissementLoader";

export class UserListEtablissementUseCase {
    constructor(private readonly userListEtablissementLoader: UserListEtablissementLoader) { }

    async getByListIdOrderedAndPaginated(idUser: string, listId: number, order: string, orderBy: string, page: number, limit: number) {
        return await this.userListEtablissementLoader.getByListIdOrderedAndPaginated(idUser, listId, order, orderBy, page, limit);
    }

    async create(idUser: string, listId: number, finessNumber: string, typeEtablissement: string) {
        return await this.userListEtablissementLoader.create(idUser, listId, finessNumber, typeEtablissement);
    }

    async delete(idUser: string, idList: number, finessNumbers: string[]): Promise<void> {
        return await this.userListEtablissementLoader.delete(idUser, idList, finessNumbers);
    }
}