import { ChangePasswordLoader } from "../../../métier/gateways/ChangePasswordLoader";
import { checkToken } from "../../../jwtHelper";

export class TypeOrmChangePasswordLoader implements ChangePasswordLoader {
    async changePassword(loginToken: string, password: string): Promise<boolean> {
        const email = await checkToken(loginToken);
        
        return true;
    }


}