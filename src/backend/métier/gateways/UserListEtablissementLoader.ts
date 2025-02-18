import { RechercheModel } from "../../../../database/models/RechercheModel";

export interface UserListEtablissementLoader {
    getByListIdOrderedAndPaginated(idUser: string, listId: number, order: string, orderBy: string, page: number, limit: number, forExport: boolean): Promise<RechercheModel[]> ;
    create(idUser: string, listId: number, finessNumber: string, typeEtablissement: string): Promise<void>;
    delete(idUser: string, idList: number, finess: string): Promise<void>;
}