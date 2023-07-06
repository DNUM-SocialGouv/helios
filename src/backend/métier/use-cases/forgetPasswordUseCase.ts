import { ForgetPasswordLoader } from "../gateways/ForgetPasswordLoader";

export class ForgetPasswordUseCase {
  constructor(private forgetPasswordLoader: ForgetPasswordLoader) {}

  async exécute(email: string): Promise<Object> {
    console.log('222222222');
    
    return await this.forgetPasswordLoader.forgetPassword(email);
  }
    test() {
        console.log('test');
        
     return this.forgetPasswordLoader.test() 
  }
}
