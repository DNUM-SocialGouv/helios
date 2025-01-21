import { UserListModel } from "../../../../database/models/UserListModel"
import { InformationSurListe } from "../../métier/entities/liste/InformationSurListe";
import { UserListUseCase } from "../../métier/use-cases/userListUseCase";
import { dependencies } from "../dependencies";


export async function create(idUser: string, listName: string, isFavoris: boolean = false): Promise<UserListModel> {
    try {
        const userListUseCase = new UserListUseCase(dependencies.userListLoader);
        return await userListUseCase.create(idUser, listName, isFavoris);
    } catch (error) {
        dependencies.logger.error(error);
        throw error;
    }
}
export async function getAll(idUser: string): Promise<UserListModel[]> {
    try {
        const userListUseCase = new UserListUseCase(dependencies.userListLoader);
        return await userListUseCase.getAll(idUser);
    } catch (error) {
        dependencies.logger.error(error);
        throw error;
    }
}
export async function getById(idUser: string, idList: number): Promise<UserListModel | null> {
    try {
        const userListUseCase = new UserListUseCase(dependencies.userListLoader);
        return await userListUseCase.getById(idUser, idList);
    } catch (error) {
        dependencies.logger.error(error);
        throw error;
    }
}
export async function getAllIdAndName(idUser: string): Promise<InformationSurListe[]> {
    try {
        const userListUseCase = new UserListUseCase(dependencies.userListLoader);
        return await userListUseCase.getAllIdAndName(idUser);
    } catch (error) {
        dependencies.logger.error(error);
        throw error;
    }
}
export async function updateName(idUser: string, idList: number, listName: string): Promise<void> {
    try {
        const userListUseCase = new UserListUseCase(dependencies.userListLoader);
        return await userListUseCase.updateName(idUser, idList, listName);
    } catch (error) {
        dependencies.logger.error(error);
        throw error;
    }
}

export async function deleteList(idUser: string, idList: number): Promise<void> {
    try {
        const userListUseCase = new UserListUseCase(dependencies.userListLoader);
        return await userListUseCase.delete(idUser, idList);
    } catch (error) {
        dependencies.logger.error(error);
        throw error;
    }
}