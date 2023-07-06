import { ForgetPasswordLoader } from "../gateways/ForgetPasswordLoader";

export class ForgetPasswordUseCase {
  constructor(private forgetPasswordLoader: ForgetPasswordLoader) {}

  async exécute(email: string): Promise<Object> {       
     return await this.forgetPasswordLoader.forgetPassword(email);
  }
}
