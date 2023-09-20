import { ProfilModel } from "../../../../database/models/ProfilModel";
import { RésultatLogin } from "../entities/Utilisateur/RésultatLogin";

export interface UtilisateurLoader {
  login(email: string, password: string): Promise<RésultatLogin>;
  checkIfEmailExists(email: string): Promise<boolean>;
  getProfile(): Promise<ProfilModel | null>;
}
