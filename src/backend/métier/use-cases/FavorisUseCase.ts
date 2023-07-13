import { FavorisModel } from "../../../../database/models/FavorisModel";
import { FavorisLoader } from "../gateways/FavorisLoader";

export class AddToFavorisUseCase {
    constructor(private favorisLoader: FavorisLoader) { }

    async exécute(finessNumber: string, type: string, idUser: number, commune: string, departement: string, socialReason
        : string): Promise<void> {
        await this.favorisLoader.addToFavoris(finessNumber, type, idUser, commune, departement, socialReason);
    }
}

export class RemoveFromFavorisUseCase {
    constructor(private favorisLoader: FavorisLoader) { }

    async exécute(idUser: number, finessNumber: string): Promise<void> {
        await this.favorisLoader.removeFromFavoris(idUser, finessNumber);
    }
}

export class GetAllFavorisUseCase {
    constructor(private favorisLoader: FavorisLoader) { }

    async exécute(idUser: number): Promise<FavorisModel[]> {
        return await this.favorisLoader.getAllFavoris(idUser);
    }
}