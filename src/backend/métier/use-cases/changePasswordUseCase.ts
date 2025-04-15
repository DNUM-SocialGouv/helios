import { ChangePasswordLoader } from "../gateways/ChangePasswordLoader";

export class ChangePasswordUseCase {
  constructor(private readonly changePasswordLoader: ChangePasswordLoader) { }

  async exécute(loginToken: string, password: string): Promise<string> {
    return this.changePasswordLoader.updatePassword(loginToken, password, '');
  }
}