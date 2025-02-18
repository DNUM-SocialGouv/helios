import { RechercheModel } from "../../../../database/models/RechercheModel";
import { UserListEtablissementUseCase } from "../../métier/use-cases/userListEtablissementUseCase";
import { dependencies } from "../dependencies";


export async function getByListIdOrderedAndPaginated(idUser: string, listId: number, order: string, orderBy: string, page: number, limit: number, forExport: boolean): Promise<RechercheModel[]> {
    try {
        const userListEtablissementUseCase = new UserListEtablissementUseCase(dependencies.userListEtablissementLoader);
        return await userListEtablissementUseCase.getByListIdOrderedAndPaginated(idUser, listId, order, orderBy, page, limit, forExport);
    } catch (error) {
        dependencies.logger.error(error);
        throw error;
    }
}

export async function create(idUser: string, listId: number, finessNumber: string, typeEtablissement: string) {
    try {
        const userListEtablissementUseCase = new UserListEtablissementUseCase(dependencies.userListEtablissementLoader);
        return await userListEtablissementUseCase.create(idUser, listId, finessNumber, typeEtablissement);
    } catch (error) {
        dependencies.logger.error(error);
        throw error;
    }
}

export async function deleteEtablissementFromList(idUser: string, idList: number, finessNumber: string): Promise<void> {
    try {
        const userListEtablissementUseCase = new UserListEtablissementUseCase(dependencies.userListEtablissementLoader);
        return await userListEtablissementUseCase.delete(idUser, idList, finessNumber);
    } catch (error) {
        dependencies.logger.error(error);
        throw error;
    }
}