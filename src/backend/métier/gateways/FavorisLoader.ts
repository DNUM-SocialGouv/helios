import { FavorisModel } from "../../../../database/models/FavorisModel";

export interface FavorisLoader {
    addToFavoris(finessNumber: string, type: string, idUser: number): Promise<void>;
    removeFromFavoris(idUser: number, finessNumber: string): Promise<void>;
    getAllFavoris(idUser: number): Promise<FavorisModel[]>;
}
