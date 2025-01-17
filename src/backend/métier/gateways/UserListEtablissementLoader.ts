export interface UserListEtablissementLoader {
    create(listId: number, finessNumber: string, typeEtablissement: string): Promise<void>;
    delete(idList: number, finess: string): Promise<void>;
}