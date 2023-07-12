import { DataSource } from "typeorm";

import { FavorisModel } from "../../../../../database/models/FavorisModel";
import { FavorisLoader } from "../../../métier/gateways/FavorisLoader";

export class TypeOrmFavorisLoader implements FavorisLoader {
    constructor(private readonly orm: Promise<DataSource>) { }


    async addToFavoris(finessNumber: string, type: string, idUser: number) {
        const favori = new FavorisModel();
        favori.finessNumber = finessNumber;
        favori.type = type;
        favori.userId = idUser;
        await (await this.orm).getRepository(FavorisModel).save(favori);
    }

    async removeFromFavoris(idUser: number, finessNumber: string) {
        await (await this.orm).getRepository(FavorisModel).delete({ userId: idUser, finessNumber: finessNumber });
    }

    async getAllFavoris(idUser: number): Promise<FavorisModel[]> {
        return await (await this.orm).getRepository(FavorisModel).find({ where: { userId: idUser } });
    }
}