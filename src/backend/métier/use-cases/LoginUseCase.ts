import { RésultatLogin } from "../entities/Utilisateur/RésultatLogin";
import { UtilisateurLoader } from "../gateways/UtilisateurLoader";

export class LoginUseCase {
  constructor(private utilisateurLoader: UtilisateurLoader) { }

  async exécute(email: string, password: string): Promise<RésultatLogin> {
    return await this.utilisateurLoader.login(email, password);
  }

  async checkIfEmailExists(email: string): Promise<boolean> {
    return await this.utilisateurLoader.checkIfEmailExists(email);
  }
}
