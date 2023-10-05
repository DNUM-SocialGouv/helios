import { DataSource } from "typeorm";

import { ProfilModel, ProfileValue } from "../../../../../database/models/ProfilModel";
import { ProfileLoader } from "../../../métier/gateways/ProfileLoader";


export class TypeOrmProfileLoader implements ProfileLoader {
    constructor(private readonly orm: Promise<DataSource>) { }

    async getAllProfiles(): Promise<ProfilModel[]> {
        return await (await this.orm).getRepository(ProfilModel).find();
    }

    async getProfileByCode(code: string): Promise<ProfilModel | null> {
        return await (await this.orm).getRepository(ProfilModel).findOne({ where: { code: code } })
    }

    async updateProfileValue(code: string, value: ProfileValue): Promise<void> {
        await (await this.orm).getRepository(ProfilModel).update({ code: code }, { value: value });
    }

    async addNewProfile(label: string, value: ProfileValue): Promise<void> {
        const profile = new ProfilModel();
        profile.dateCreation = new Date();
        profile.label = label;
        profile.value = value;
        await (await this.orm).getRepository(ProfilModel).save(profile);
    }
}