import { ProfilModel } from "../../../../database/models/ProfilModel";
import { UtilisateurModel } from "../../../../database/models/UtilisateurModel";
import { Institution } from "../entities/Utilisateur/Institution";
import { RésultatLogin } from "../entities/Utilisateur/RésultatLogin";

export interface UtilisateurLoader {
  login(email: string, password: string): Promise<RésultatLogin>;
  checkIfEmailExists(email: string): Promise<boolean>;
  getInstitutions(): Promise<Institution[]>;
  createAccount(firstName: string, lastName: string, email: string, institution: string): Promise<void>;
  getUserProfiles(codes: string[]): Promise<ProfilModel[] | null>;
  checkIfAdmin(userId: string): Promise<boolean>;
  getUsersListPaginated(key: string, sort: string, pdescrtion: number, institutionId: number, roleId: number, profilId: string): Promise<void>;
  getUserByCode(code: string): Promise<UtilisateurModel | null>;
  updateUser(userCode: string, roleCode: string, institutionCode: string, profilsCode: string[]): Promise<UtilisateurModel | null>;
  deleteUser(userCode: string): Promise<string | null>;
}
