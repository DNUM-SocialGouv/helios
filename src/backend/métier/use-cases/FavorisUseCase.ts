import { FavorisModel } from "../../../../database/models/FavorisModel";
import { FavorisLoader } from "../gateways/FavorisLoader";

export class AddToFavorisUseCase {
    constructor(private favorisLoader: FavorisLoader) { }

    async exécute(finessNumber: string, type: string, idUser: number): Promise<void> {
        await this.favorisLoader.addToFavoris(finessNumber, type, idUser);
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