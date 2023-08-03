import { hash, genSalt, compare } from 'bcrypt';
import { DataSource } from "typeorm";

import { UtilisateurModel } from "../../../../../database/models/UtilisateurModel";
import { checkToken } from "../../../jwtHelper";
import { ChangePasswordLoader } from "../../../métier/gateways/ChangePasswordLoader";

export class TypeOrmChangePasswordLoader implements ChangePasswordLoader {
    constructor(private readonly orm: Promise<DataSource>) { }

    async changePassword(loginToken: string, password: string): Promise<string> {
        const info = checkToken(loginToken);
        if (info?.email) {
            const user = await (await this.orm).getRepository(UtilisateurModel).findOneBy({ email: info.email.trim() });
            if (user) {
                const checkOldPwd = await compare(password, user.password);
                if (!checkOldPwd) {
                    const salt = await genSalt(10);
                    const hashedPassword = await hash(password, salt);
                    user.password = hashedPassword;
                    (await this.orm).getRepository(UtilisateurModel).save(user);
                    return 'user updated'
                } else {
                    return 'same password'
                }
            } else {
                return 'user not found'
            }
        }
        return 'wrong token';
    }

    async updatePassword(email: string, password: string, oldPassword: string): Promise<string> {
        const user = await (await this.orm).getRepository(UtilisateurModel).findOneBy({ email: email.trim() });
        if (user) {
            const checkOldPwd = await compare(oldPassword, user.password);
            if (checkOldPwd) {
                if (oldPassword === password) {
                    return 'same password'
                }
                const salt = await genSalt(10);
                const hashedPassword = await hash(password, salt);
                user.password = hashedPassword;
                (await this.orm).getRepository(UtilisateurModel).save(user);
                return 'user updated'
            } else {
                return 'wrong password'
            }
        } else {
            return 'user not found'
        }
    }

}