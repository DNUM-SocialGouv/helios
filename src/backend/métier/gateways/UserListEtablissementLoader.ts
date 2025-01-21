export interface UserListEtablissementLoader {
    create(idUser: string, listId: number, finessNumber: string, typeEtablissement: string): Promise<void>;
    delete(idUser: string, idList: number, finess: string): Promise<void>;
}