import { DataSource } from "typeorm";

import { UtilisateurModel } from "../../../../../database/models/UtilisateurModel";
import { checkToken } from "../../../jwtHelper";
import { ChangePasswordLoader } from "../../../métier/gateways/ChangePasswordLoader";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');

export class TypeOrmChangePasswordLoader implements ChangePasswordLoader {
    constructor(private readonly orm: Promise<DataSource>) {}

    async changePassword(loginToken: string, password: string): Promise<boolean> {
        const info =  checkToken(loginToken);
        if (info?.email) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);     
            const user = await (await this.orm).getRepository(UtilisateurModel).update({ email: info.email.trim() }, {password : hashedPassword});    
            if (user?.affected) {
                return true
            }
        }               
        return false;
    }

}