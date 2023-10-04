import { compare } from 'bcrypt';
import { createHash } from 'crypto';
import { DataSource } from "typeorm";

import { InstitutionModel } from '../../../../../database/models/InstitutionModel';
import { RoleModel } from '../../../../../database/models/RoleModel';
import { UtilisateurModel } from "../../../../../database/models/UtilisateurModel";
import { Institution } from '../../../métier/entities/Utilisateur/Institution';
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

    async getInstitutions(): Promise<Institution[]> {
        const institutions = await (await this.orm).getRepository(InstitutionModel).find();
        return institutions;
    }

    async createAccount(firstName: string, lastName: string, email: string, institution: string): Promise<void> {
        const account = new UtilisateurModel();

        const institutionToSave = await (await this.orm).getRepository(InstitutionModel).findOneBy({ code: institution });
        const roleToSave = await (await this.orm).getRepository(RoleModel).findOneBy({ code: 'USER' });

        const passwordToSave = 'HeliosConnect-' + institutionToSave?.codeGeo;
        const hashing = createHash('sha256');
        hashing.update(passwordToSave);
        const hashedPassword = hashing.digest('hex');

        if (institutionToSave && roleToSave) {
            account.nom = lastName;
            account.prenom = firstName;
            account.email = email;
            account.institution = institutionToSave;
            account.role = roleToSave;
            account.password = hashedPassword;
            account.actif = true;
            account.dateCreation = new Date();
        }

        // eslint-disable-next-line no-console
        console.log('make it to typeoarm', institution);
        (await this.orm).getRepository(UtilisateurModel).save(account)
            .then(() => {
                // if saved with no problem, send email
            })
            .catch((error) => {
                // eslint-disable-next-line no-console
                console.log("error", error);
            });

    }
}