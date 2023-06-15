import { DataSource } from "typeorm";

import { ChangePasswordLoader } from "../../../métier/gateways/ChangePasswordLoader";
import { checkToken } from "../../../jwtHelper";

export class TypeOrmChangePasswordLoader implements ChangePasswordLoader {
    constructor(private readonly orm: Promise<DataSource>) {}

    async changePassword(loginToken: string, password: string): Promise<boolean> {
        console.log("loginToken   ", loginToken, "   password   ", password); 
        const email = await checkToken(loginToken);

        return true;
    }

}