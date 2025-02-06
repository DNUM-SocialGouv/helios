import { UserListModel } from "../../../../database/models/UserListModel";
import { InformationSurListe } from "../entities/liste/InformationSurListe";

export interface UserListLoader {
    create(idUser: string, listName: string, isFavoris?: boolean): Promise<UserListModel>;
    getAll(idUser: string): Promise<UserListModel[]>;
    getById(idUser: string, idList: number): Promise<UserListModel | null>;
    getAllIdAndName(idUser: string): Promise<InformationSurListe[]>; // TODO Use a specific object an not the Entity
    updateName(idUser: string, idList: number, listName: string): Promise<UserListModel | null>;
    delete(idUser: string, idList: number): Promise<void>;
}