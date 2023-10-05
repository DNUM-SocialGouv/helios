import { ProfilModel } from "../../../../database/models/ProfilModel";
import { Institution } from "../entities/Utilisateur/Institution";
import { RésultatLogin } from "../entities/Utilisateur/RésultatLogin";

export interface UtilisateurLoader {
  login(email: string, password: string): Promise<RésultatLogin>;
  checkIfEmailExists(email: string): Promise<boolean>;
  getInstitutions(): Promise<Institution[]>;
  createAccount(firstName: string, lastName: string, email: string, institution: string): Promise<void>;
  getUserProfiles(codes: string[]): Promise<ProfilModel[] | null>;
  checkIfAdmin(userId: string): Promise<boolean>
}
