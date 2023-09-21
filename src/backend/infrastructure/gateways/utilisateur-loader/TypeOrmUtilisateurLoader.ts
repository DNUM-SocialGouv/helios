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

    async getUserProfiles(codes: string[]): Promise<ProfilModel[] | null> {
        const profiles = await (await this.orm).getRepository(ProfilModel)
            .createQueryBuilder("profiles")
            .where('profiles.profil_code IN (:...codes)', { codes })
            .getMany();
        return profiles;
    }
}