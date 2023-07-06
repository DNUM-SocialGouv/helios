import { ForgetPasswordUseCase } from "../../métier/use-cases/forgetPasswordUseCase";
import { Dependencies } from "../dependencies";

export async function forgetPasswordEndPoint(dependencies: Dependencies,email: string): Promise<Object> {
  try {
    console.log('111111');
    
    const forgetPasswordUseCase = new ForgetPasswordUseCase(dependencies.forgetPasswordLoader);
           
    return await forgetPasswordUseCase.exécute(email);
  } catch (error) {
    return error
  }

}