import { ChangePasswordLoader } from "../gateways/ChangePasswordLoader";

export class ChangePasswordUseCase {
  constructor(private changePasswordLoader: ChangePasswordLoader) {}

  async exécute(loginToken: string, password: string): Promise<boolean> {
    return this.changePasswordLoader.changePassword(loginToken, password);
  }
}