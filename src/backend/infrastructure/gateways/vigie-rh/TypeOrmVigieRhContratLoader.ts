import { DataSource } from "typeorm";

import { VigieRhContratModel } from "../../../../../database/models/vigie_rh/VigieRhContratModel";
import { VigieRhContratLoader } from "../../../métier/gateways/vigie-rh/VigieRhContratLoader";

export class TypeOrmVigieRhContratLoader implements VigieRhContratLoader {

    constructor(private readonly orm: Promise<DataSource>) { }

    async getAllContratParNumFiness(numeroFiness: string): Promise<any> {
        const retour = (await this.chargerContratModel(numeroFiness)) as VigieRhContratModel[];
        return retour;
    }


    private async chargerContratModel(numFiness: string): Promise<VigieRhContratModel[]> {
        return await (await this.orm).getRepository(VigieRhContratModel).find({
            where: { numeroFiness: numFiness },
        });
    }
}

