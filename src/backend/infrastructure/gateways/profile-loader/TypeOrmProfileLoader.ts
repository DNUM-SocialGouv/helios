import { DataSource } from "typeorm";

import { ProfilModel, ProfileValue } from "../../../../../database/models/ProfilModel";
import { UtilisateurModel } from "../../../../../database/models/UtilisateurModel";
import { ProfileLoader } from "../../../métier/gateways/ProfileLoader";

export class TypeOrmProfileLoader implements ProfileLoader {
    constructor(private readonly orm: Promise<DataSource>) { }

    async getAllProfiles(): Promise<ProfilModel[]> {
        return await (await this.orm).getRepository(ProfilModel).find({
            relations: {
                createdBy: true,
            },
        });
    }

    async getProfileByCode(code: string): Promise<ProfilModel | null> {
        return await (await this.orm).getRepository(ProfilModel).findOne({ where: { code: code } })
    }

    async updateProfileValue(code: string, value: ProfileValue, name: string): Promise<void> {
        await (await this.orm).getRepository(ProfilModel).update({ code: code }, { value: value, label: name });
    }

    async addNewProfile(label: string, value: ProfileValue, userId: string): Promise<void> {
        // get connected user
        const user = await (await this.orm).getRepository(UtilisateurModel).findOne({ where: { code: userId } });
        if (user) {
            const profile = new ProfilModel();
            profile.dateCreation = new Date();
            profile.label = label;
            profile.value = value;
            profile.createdBy = user;
            await (await this.orm).getRepository(ProfilModel).save(profile);
        }
    }

    async deleteProfile(idProfile: number): Promise<string> {
        try {
            const profile = await (await this.orm).getRepository(ProfilModel).findOne({ where: { id: idProfile } })
            const defaultProfile = await (await this.orm).getRepository(ProfilModel).findOneBy({ id: 1 });

            if (defaultProfile && profile) {
                // get list of users attached to this profile
                const users = await (await this.orm).getRepository(UtilisateurModel).createQueryBuilder('entity')
                    .where(':value = ANY(entity.profils)', { value: profile?.code })
                    .getMany();

                // for each user, if user does not have other profiles, affect him default profile 
                for (let index = 0; index < users.length; index++) {
                    if (users[index].profils.length === 1) {
                        users[index].profils = [defaultProfile.code];
                    } else {
                        users[index].profils = users[index].profils.filter(item => item !== profile.code)
                    }
                }

                await (await this.orm).getRepository(UtilisateurModel).save(users);
                // delete profile
                await (await this.orm).getRepository(ProfilModel).delete({ id: idProfile });
                return ("profile deleted successefully");
            }
            return ("can not delete profile");
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log("error", error);
            return ("error " + error);
        }
    }
}