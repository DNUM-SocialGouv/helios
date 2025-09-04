import { DataSource, In } from "typeorm";

import { FavorisModel } from "../../../../../database/models/FavorisModel";
import { RechercheModel } from "../../../../../database/models/RechercheModel";
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

    async checkFinessInDatabase(finessList: string[]): Promise<string[]> {
        const existing = await (await this.orm).getRepository(RechercheModel).find({
            where: { numeroFiness: In(finessList) },
            select: ["numeroFiness"],
        });

        const found = new Set(existing.map(e => e.numeroFiness));

        return finessList.filter(finess => !found.has(finess));
    }
}