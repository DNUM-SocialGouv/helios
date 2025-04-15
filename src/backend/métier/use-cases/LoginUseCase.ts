import { ProfilModel } from "../../../../database/models/ProfilModel";
import { Institution } from "../entities/Utilisateur/Institution";
import { RésultatLogin } from "../entities/Utilisateur/RésultatLogin";
import { UtilisateurLoader } from "../gateways/UtilisateurLoader";

export class LoginUseCase {
  constructor(private readonly utilisateurLoader: UtilisateurLoader) { }

  async exécute(email: string, password: string): Promise<RésultatLogin> {
    return await this.utilisateurLoader.login(email, password);
  }

  async checkUserIsNotAdminAndInactif(email: string): Promise<boolean> {
    return await this.utilisateurLoader.checkUserIsNotAdminAndInactif(email);
  }

  async updateLastConnectionDate(email: string): Promise<boolean> {
    return await this.utilisateurLoader.updateLastConnectionDate(email);
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

  async getUserProfiles(codes: string[]): Promise<ProfilModel[] | null> {
    return await this.utilisateurLoader.getUserProfiles(codes);
  }
}
