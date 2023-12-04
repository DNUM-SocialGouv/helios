import { compare, genSalt, hash } from 'bcrypt';
import { createHash } from 'crypto';
import fs from 'fs';
import path from "path";
import { DataSource } from "typeorm";

import { InstitutionModel } from '../../../../../database/models/InstitutionModel';
import { ProfilModel } from '../../../../../database/models/ProfilModel';
import { RoleModel } from '../../../../../database/models/RoleModel';
import { UtilisateurModel } from "../../../../../database/models/UtilisateurModel";
import { generateToken } from '../../../jwtHelper';
import { Institution } from '../../../métier/entities/Utilisateur/Institution';
import { RésultatLogin } from "../../../métier/entities/Utilisateur/RésultatLogin";
import { UtilisateurLoader } from "../../../métier/gateways/UtilisateurLoader";
import { sendEmail } from '../../../sendEmail';



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
        try {
            const account = new UtilisateurModel();

            const institutionToSave = await (await this.orm).getRepository(InstitutionModel).findOneBy({ code: institution });
            const roleToSave = await (await this.orm).getRepository(RoleModel).findOneBy({ code: 'USER' });
            const profileToSave = await (await this.orm).getRepository(ProfilModel).findOneBy({ id: 1 });

            const passwordToSave = 'HeliosConnect-' + institutionToSave?.codeGeo;

            const salt = await genSalt(10);
            const hashedPassword = await hash(passwordToSave, salt);

            if (institutionToSave && roleToSave && profileToSave) {
                account.nom = lastName;
                account.prenom = firstName;
                account.email = email;
                account.institution = institutionToSave;
                account.role = roleToSave;
                account.password = hashedPassword;
                account.profils = [profileToSave.code];
                account.actif = true;
                account.dateCreation = new Date();
            }

            (await this.orm).getRepository(UtilisateurModel).save(account)
                .then(async () => {
                    const absolutePath = path.resolve(process.cwd(), './public/logo-helios.png');
                    const imageContent = fs.readFileSync(absolutePath, 'base64');
                    const APP_URL = process.env["APP_BASE_URL"];
                    const token = generateToken(email, '24h');
                    const images = [
                        {
                            "contentType": "image/png",
                            "filename": "logo-helios",
                            "content": imageContent,
                            "contentId": "logo"
                        }
                    ];
                    const body = `
                    <img src="cid:logo" alt="helios" height="75" width="200">
                    <p>Bonjour,</p>
                    <p>L'équipe projet Helios est heureuse de vous accueillir sur l'application Helios. Pour finaliser la création de votre compte, merci de cliquer 
                    <a href="${APP_URL}/reinitialisation-mot-passe?loginToken=${token}">ici</a> et définir votre mot de passe</p>
                    <p><b>Attention, la page est accessible une seule fois, et pendant 24h à compter de son ouverture. </b></p>                
                    <p>Si le lien ne fonctionne plus, merci de passer par <a href="${APP_URL}/mot-passe-oublie"> Mot de passe oublié ?</a> présent sur la page de connexion. </p>      
                    <p>L'équipe Helios reste disponible à l'adresse mail suivante : dnum.scn-helios-support@sg.social.gouv.fr</p>
                    <p> Cordialement, </p>
                    <p>L'équipe Helios</p>`;
                    sendEmail(email, "[Helios]-Création de votre compte Helios", body, images);
                })
                .catch((error) => {
                    // eslint-disable-next-line no-console
                    console.log("error", error);
                });

        } catch (error) {
            // eslint-disable-next-line no-console
            console.log("error", error);
        }
    }

    async checkIfAdmin(userId: string): Promise<boolean> {
        const user = await (await this.orm).getRepository(UtilisateurModel).findOneBy({ code: userId.trim() });
        if (user && (user.roleId === '1' || user.roleId === '2')) {
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