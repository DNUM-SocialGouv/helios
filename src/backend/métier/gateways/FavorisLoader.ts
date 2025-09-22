import { FavorisModel } from "../../../../database/models/FavorisModel";

export interface FavorisLoader {
  addToFavoris(finessNumber: string, type: string, idUser: string, commune: string, departement: string, social_reason: string): Promise<void>;
  removeFromFavoris(idUser: string, finessNumber: string): Promise<void>;
  getAllFavoris(idUser: string): Promise<FavorisModel[]>;
}
