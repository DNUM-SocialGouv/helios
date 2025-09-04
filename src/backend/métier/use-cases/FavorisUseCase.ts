import { FavorisModel } from "../../../../database/models/FavorisModel";
import { FavorisLoader } from "../gateways/FavorisLoader";

export class AddToFavorisUseCase {
    constructor(private readonly favorisLoader: FavorisLoader) { }

    async exécute(finessNumber: string, type: string, idUser: string, commune: string, departement: string, socialReason
        : string): Promise<void> {
        await this.favorisLoader.addToFavoris(finessNumber, type, idUser, commune, departement, socialReason);
    }
}

export class RemoveFromFavorisUseCase {
    constructor(private readonly favorisLoader: FavorisLoader) { }

    async exécute(idUser: string, finessNumber: string): Promise<void> {
        await this.favorisLoader.removeFromFavoris(idUser, finessNumber);
    }
}

export class GetAllFavorisUseCase {
    constructor(private readonly favorisLoader: FavorisLoader) { }

    async exécute(idUser: string): Promise<FavorisModel[]> {
        return await this.favorisLoader.getAllFavoris(idUser);
    }
}

export class CheckFinessInDatabaseUseCase {
    constructor(private readonly favorisLoader: FavorisLoader) { }

    async exécute(finessList: string[]): Promise<string[]> {
        return await this.favorisLoader.checkFinessInDatabase(finessList);
    }
}