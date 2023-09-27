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
}