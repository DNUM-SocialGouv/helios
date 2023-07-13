import { AddToFavorisUseCase } from "../../métier/use-cases/FavorisUseCase";
import { Dependencies } from "../dependencies";

export async function addToFavorisEndpoint(dependencies: Dependencies, finessNumber: string, type: string, idUser: number, commune: string, departement: string, socialReason
    : string): Promise<void> {
    try {
        const addToFavorisUseCase = new AddToFavorisUseCase(dependencies.favorisLoader);

        return await addToFavorisUseCase.exécute(finessNumber, type, idUser, commune, departement, socialReason);
    } catch (error) {
        dependencies.logger.error(error);
        throw error;
    }
}
