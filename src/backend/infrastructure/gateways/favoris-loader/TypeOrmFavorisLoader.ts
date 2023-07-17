import { DataSource } from "typeorm";

import { FavorisModel } from "../../../../../database/models/FavorisModel";
import { FavorisLoader } from "../../../métier/gateways/FavorisLoader";

export class TypeOrmFavorisLoader implements FavorisLoader {
    constructor(private readonly orm: Promise<DataSource>) { }


    async addToFavoris(finessNumber: string, type: string, idUser: string, commune: string, departement: string, socialReason
        : string) {
        const favori = new FavorisModel();
        favori.finessNumber = finessNumber;
        favori.type = type;
        favori.userId = idUser;
        favori.commune = commune;
        favori.departement = departement;
        favori.socialReason = socialReason;
        await (await this.orm).getRepository(FavorisModel).save(favori);
    }

    async removeFromFavoris(idUser: string, finessNumber: string) {
        await (await this.orm).getRepository(FavorisModel).delete({ userId: idUser, finessNumber: finessNumber });
    }

    async getAllFavoris(idUser: string): Promise<FavorisModel[]> {
        return await (await this.orm).getRepository(FavorisModel).find({ where: { userId: idUser } });
    }
}