import { RechercheModel } from "../../../../database/models/RechercheModel";

export interface UserListEtablissementLoader {
  getByListIdOrderedAndPaginated(idUser: string, listId: number, order: string, orderBy: string, page: number, limit: number, forExport: boolean): Promise<RechercheModel[]>;
  create(idUser: string, listId: number, finessNumber: string): Promise<boolean>;
  delete(idUser: string, idList: number, finessNumbers: string[]): Promise<boolean>;
}
