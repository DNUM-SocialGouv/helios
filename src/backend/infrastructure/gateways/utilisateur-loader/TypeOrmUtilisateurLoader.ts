import { compare } from 'bcrypt';
import { createHash } from 'crypto';
import { DataSource } from "typeorm";

import { ProfilModel } from '../../../../../database/models/ProfilModel';
import { UtilisateurModel } from "../../../../../database/models/UtilisateurModel";
import { RésultatLogin } from "../../../métier/entities/Utilisateur/RésultatLogin";
import { UtilisateurLoader } from "../../../métier/gateways/UtilisateurLoader";


export class TypeOrmUtilisateurLoader implements UtilisateurLoader {
    constructor(private readonly orm: Promise<DataSource>) { }

    async login(email: string, password: string): Promise<RésultatLogin> {
        const user = await (await this.orm).getRepository(UtilisateurModel).findOne({ where: { email: email.trim().toLowerCase() }, relations: ['institution'] });
        if (user) {
            const hashing = createHash('sha256');
            hashing.update(password);
            const hashedPassword = hashing.digest('hex');
            return await compare(password, user.password) || hashedPassword === user.password ? { utilisateur: user } : null
        } else {
            return null
        }
    }

    async checkIfEmailExists(email: string): Promise<boolean> {
        const user = await (await this.orm).getRepository(UtilisateurModel).findOneBy({ email: email.trim().toLowerCase() });
        if (user) {
            return true
        } else return false;
    }

    async getProfile(): Promise<ProfilModel | null> {
        const profile = await (await this.orm).getRepository(ProfilModel).findOne({
            where: { code: '3f0f46f6-f50a-4d92-be71-23e7b76d2f43' },
        });
        return profile;
    }
}