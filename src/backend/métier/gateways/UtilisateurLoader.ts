import { ProfilModel } from "../../../../database/models/ProfilModel";
import { UtilisateurModel } from "../../../../database/models/UtilisateurModel";
import { RechercheUtilisateur, ResultatRechercheUtilisateur } from "../entities/ResultatRechercheUtilisateur";
import { Institution } from "../entities/Utilisateur/Institution";

export interface UtilisateurLoader {
  checkIfEmailExists(email: string): Promise<boolean>;
  getInstitutions(): Promise<Institution[]>;
  createAccount(firstName: string, lastName: string, email: string, institution: string): Promise<void>;
  getUserProfiles(codes: string[]): Promise<ProfilModel[] | null>;
  checkUserIsNotAdminAndInactif(email: string): Promise<boolean>;
  updateLastConnectionDate(email: string): Promise<boolean>;
  getUsersListPaginated(
    key: string,
    pdescrtion: number,
    institutionId: number,
    roleId: number,
    profilId: string,
    etatId: string,
    itemsPerPage: number,
    orderBy: string,
    sortDir: string
  ): Promise<ResultatRechercheUtilisateur>;
  getUserByCode(code: string): Promise<RechercheUtilisateur | null>;
  updateUser(userCode: string, roleCode: string, institutionCode: string, profilsCode: string[], firstname: string, lastname: string): Promise<void>;
  updateCgu(userCode: string, cguAccepted: boolean): Promise<void>;
  deleteUser(userCode: string): Promise<string | void>;
  reactivateUser(userCode: string): Promise<string | void>;
  createUser(firstName: string, lastName: string, email: string, institution: string): Promise<UtilisateurModel | null>;
  getUserByEmail(email: string): Promise<RechercheUtilisateur | null>;
}
