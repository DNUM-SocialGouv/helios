import { ProfilModel } from "../../../../database/models/ProfilModel";
import { RechercheUtilisateur, ResultatRechercheUtilisateur } from "../entities/ResultatRechercheUtilisateur";
import { Institution } from "../entities/Utilisateur/Institution";
import { PasswordStatus, RésultatLogin } from "../entities/Utilisateur/RésultatLogin";

export interface UtilisateurLoader {
  login(email: string, password: string): Promise<RésultatLogin>;
  getLoginError(email: string): Promise<string>;
  checkIfEmailExists(email: string): Promise<boolean>;
  getInstitutions(): Promise<Institution[]>;
  createAccount(firstName: string, lastName: string, email: string, institution: string): Promise<void>;
  getUserProfiles(codes: string[]): Promise<ProfilModel[] | null>;
  checkUserIsNotAdminAndInactif(email: string): Promise<boolean>;
  checkPasswordStatus(email: string): Promise<PasswordStatus>;
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
  deleteUser(userCode: string): Promise<string | void>;
  reactivateUser(userCode: string): Promise<string | void>;
}
