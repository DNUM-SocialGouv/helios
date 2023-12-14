import { hash, genSalt, compare } from 'bcrypt';
import { DataSource } from "typeorm";

import { UtilisateurModel } from "../../../../../database/models/UtilisateurModel";
import { checkToken } from "../../../jwtHelper";
import { ChangePasswordLoader } from "../../../métier/gateways/ChangePasswordLoader";

export class TypeOrmChangePasswordLoader implements ChangePasswordLoader {
    constructor(private readonly orm: Promise<DataSource>) { }

    updateUserPassword = async (password: string, user: any) => {
        const salt = await genSalt(10);
        const hashedPassword = await hash(password, salt);
        user.password = hashedPassword;
        (await this.orm).getRepository(UtilisateurModel).save(user);
        return 'user updated'
    }

    async updatePassword(token: string, password: string, oldPassword: string): Promise<string> {
        let email;
        if (!oldPassword) {
            const info = checkToken(token);
            if (info?.email) {
                email = info?.email;
            } else {
                return 'wrong token';
            }
        } else {
            email = token;
        }

        const user = await (await this.orm).getRepository(UtilisateurModel).findOneBy({ email: email.trim().toLocaleLowerCase() });

        if (user) {
            let checkOldPwd;
            if (oldPassword) {
                checkOldPwd = await compare(oldPassword, user.password);
                if (oldPassword === password) {
                    return 'same password'
                }
                if (checkOldPwd) {
                    return this.updateUserPassword(password, user);
                } else {
                    return 'wrong password'
                }
            } else {
                checkOldPwd = await compare(password, user.password);
                if (!checkOldPwd) {
                    return this.updateUserPassword(password, user);
                } else {
                    return 'same password'
                }
            }
        } else {
            return 'user not found';
        }
    }
}