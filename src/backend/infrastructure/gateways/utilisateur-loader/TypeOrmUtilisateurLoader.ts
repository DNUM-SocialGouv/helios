import { DataSource } from "typeorm";
import { UtilisateurLoader } from "../../../métier/gateways/UtilisateurLoader";
import { RésultatLogin } from "../../../métier/entities/Utilisateur/RésultatLogin";
import { UtilisateurModel } from "../../../../../database/models/UtilisateurModel";

export class TypeOrmUtilisateurLoader implements UtilisateurLoader {
    constructor(private readonly orm: Promise<DataSource>) { }

    async login(email: string, password: string): Promise<RésultatLogin> {
        const user = await (await this.orm).getRepository(UtilisateurModel).findOneBy({ email: email.trim() });
        if (user) {
            return user?.password === password ? { utilisateur: user } : null
        } else {
            return null
        }
    }
}