import { ProfilModel } from "../../../../database/models/ProfilModel";
import { Institution } from "../entities/Utilisateur/Institution";
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

  async getInstitutions(): Promise<Institution[]> {
    return await this.utilisateurLoader.getInstitutions();
  }

  async createAccount(firstName: string, lastName: string, email: string, institution: string): Promise<void> {

    return this.utilisateurLoader.createAccount(firstName, lastName, email, institution);
  }

  async checkIfAdmin(userId: string): Promise<boolean> {
    return await this.utilisateurLoader.checkIfAdmin(userId);
  }

  async getUserProfiles(codes: string[]): Promise<ProfilModel[] | null> {
    return await this.utilisateurLoader.getUserProfiles(codes);
  }
}
