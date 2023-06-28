import { RésultatLogin } from "../entities/Utilisateur/RésultatLogin";

export interface UtilisateurLoader {
  login(email: string, password: string): Promise<RésultatLogin>;
}
