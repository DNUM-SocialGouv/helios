import { DataSource } from "typeorm";

import { UtilisateurModel } from "../../../../../database/models/UtilisateurModel";
import { RésultatLogin } from "../../../métier/entities/Utilisateur/RésultatLogin";
import { UtilisateurLoader } from "../../../métier/gateways/UtilisateurLoader";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');

export class TypeOrmUtilisateurLoader implements UtilisateurLoader {
    constructor(private readonly orm: Promise<DataSource>) { }

    async login(email: string, password: string): Promise<RésultatLogin> {
        const user = await (await this.orm).getRepository(UtilisateurModel).findOneBy({ email: email.trim() });
        if (user) {
            return bcrypt.compare(password, user.password) ? { utilisateur: user } : null
        } else {
            return null
        }
    }
}