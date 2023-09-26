import { DataSource } from "typeorm";

import { ProfilModel } from "../../../../../database/models/ProfilModel";
import { ProfileLoader } from "../../../métier/gateways/ProfileLoader";


export class TypeOrmProfileLoader implements ProfileLoader {
    constructor(private readonly orm: Promise<DataSource>) { }

    async getAllProfiles(): Promise<ProfilModel[]> {
        return await (await this.orm).getRepository(ProfilModel).find();
    }
}