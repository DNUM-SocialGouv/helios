import { compare, genSalt, hash } from "bcrypt";
import { createHash } from "crypto";
import fs from "fs";
import path from "path";
import { DataSource, ILike, ArrayContains, ArrayContainedBy, ArrayOverlap } from "typeorm";

import { InstitutionModel } from "../../../../../database/models/InstitutionModel";
import { ProfilModel } from "../../../../../database/models/ProfilModel";
import { RoleModel } from "../../../../../database/models/RoleModel";
import { UtilisateurModel } from "../../../../../database/models/UtilisateurModel";
import { generateToken } from "../../../jwtHelper";
import { Institution } from "../../../métier/entities/Utilisateur/Institution";
import { RésultatLogin } from "../../../métier/entities/Utilisateur/RésultatLogin";
import { UtilisateurLoader } from "../../../métier/gateways/UtilisateurLoader";
import { sendEmail } from "../../../sendEmail";

export class TypeOrmUtilisateurLoader implements UtilisateurLoader {
  constructor(private readonly orm: Promise<DataSource>) {}
  async getUserByCode(code: string): Promise<UtilisateurModel | null> {
    return await (await this.orm).getRepository(UtilisateurModel).findOne({ where: { code: code } });
  }

  async login(email: string, password: string): Promise<RésultatLogin> {
    const user = await (await this.orm).getRepository(UtilisateurModel).findOne({ where: { email: email.trim().toLowerCase() }, relations: ["institution"] });
    if (user) {
      const hashing = createHash("sha256");
      hashing.update(password);
      const hashedPassword = hashing.digest("hex");
      return (await compare(password, user.password)) || hashedPassword === user.password ? { utilisateur: user } : null;
    } else {
      return null;
    }
  }

  async checkIfEmailExists(email: string): Promise<boolean> {
    const user = await (await this.orm).getRepository(UtilisateurModel).findOneBy({ email: email.trim().toLowerCase() });
    if (user) {
      return true;
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
      const roleToSave = await (await this.orm).getRepository(RoleModel).findOneBy({ code: "USER" });
      const profileToSave = await (await this.orm).getRepository(ProfilModel).findOneBy({ id: 1 });

      const passwordToSave = "HeliosConnect-" + institutionToSave?.codeGeo;

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

      (await this.orm)
        .getRepository(UtilisateurModel)
        .save(account)
        .then(async () => {
          const absolutePath = path.resolve(process.cwd(), "./public/logo-helios.png");
          const imageContent = fs.readFileSync(absolutePath, "base64");
          const APP_URL = process.env["APP_BASE_URL"];
          const token = generateToken(email, "24h");
          const images = [
            {
              contentType: "image/png",
              filename: "logo-helios",
              content: imageContent,
              contentId: "logo",
            },
          ];
          const body = `
                    <img src="cid:logo" alt="helios" >
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
    if (user && (user.roleId === "1" || user.roleId === "2")) {
      return true;
    } else return false;
  }

  async getUserProfiles(codes: string[]): Promise<ProfilModel[] | null> {
    const profiles = await (await this.orm)
      .getRepository(ProfilModel)
      .createQueryBuilder("profiles")
      .where("profiles.profil_code IN (:...codes)", { codes })
      .getMany();
    return profiles;
  }

  async getUsersListPaginated(
    key = "",
    sort: string,
    currentPage: number,
    institutionId: number,
    roleId: number,
    profilId: string,
    itemsPerPage: number
  ): Promise<any> {
    //  return await (await this.orm).getRepository(UtilisateurModel).find();

    const utilisateurRepo = (await this.orm).getRepository(UtilisateurModel);
    /*
    const institutionCondition = { institution: { id: 19 } };
    const roleCondition = { role: { id: 3 } };
    const profilCondition = { profils: ["4bbf1e31-180a-4d29-9973-54459dc3087d"] };*/

    let institutionCondition = {};
    if (institutionId > 0) {
      institutionCondition = { institution: { id: institutionId } };
    }

    let roleCondition = {};
    if (roleId > 0) {
      roleCondition = { role: { id: roleId } };
    }

    let profilCondition = {};
    if (profilId && profilId.length > 0) {
      profilCondition = { profils: ArrayContains([profilId]) };
    }

    const selectConditions = { ...institutionCondition, ...roleCondition, ...profilCondition };

    const conditions = [
      { nom: ILike("%" + key.toString() + "%"), ...selectConditions },
      { prenom: ILike("%" + key.toString() + "%"), ...selectConditions },
      { email: ILike("%" + key.toString() + "%"), ...selectConditions },
    ];

    const currentPageA: number = parseInt(currentPage as any) || 1;

    const take = itemsPerPage || 10;

    const total = await utilisateurRepo.countBy(conditions);

    const data = await utilisateurRepo.find({
      where: conditions,
      take,
      skip: (currentPageA - 1) * take,
      relations: {
        role: true,
        institution: true,
      },
    });

    return {
      data,
      total,
      keyWord: key,
      currentPage: currentPageA,
      lastPage: Math.ceil(total / take),
      itemsPerPage: itemsPerPage,
    };
  }

  async updateUser(userCode: string, roleCode: string, institutionCode: string, profilsCode: string[]): Promise<UtilisateurModel | null> {
    try {
      const user = await (await this.orm).getRepository(UtilisateurModel).findOne({ where: { code: userCode } });

      const institutionToSave = await (await this.orm).getRepository(InstitutionModel).findOneBy({ code: institutionCode });
      const roleToSave = await (await this.orm).getRepository(RoleModel).findOneBy({ code: roleCode });

      if (user && institutionToSave && roleToSave && profilsCode && profilsCode.length > 0) {
        user.institution = institutionToSave;
        user.role = roleToSave;
        user.profils = profilsCode;
      }

      (await this.orm)
        .getRepository(UtilisateurModel)
        .save(user as UtilisateurModel)
        .then(async () => {
          return user;
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

  async deleteUser(userCode: string): Promise<string | null> {
    try {
      const user = await (await this.orm).getRepository(UtilisateurModel).findOne({ where: { code: userCode } });

      if (user) {
        await (await this.orm).getRepository(UtilisateurModel).remove(user);
        return "User deleted successfully";
      } else {
        return "User not found";
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("error", error);
    }
  }
}
