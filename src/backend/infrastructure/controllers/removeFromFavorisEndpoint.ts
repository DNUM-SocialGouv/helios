import { RemoveFromFavorisUseCase } from "../../métier/use-cases/FavorisUseCase";
import { Dependencies } from "../dependencies";

export async function removeFromFavorisEndpoint(dependencies: Dependencies, idUser: number, finessNumber: string): Promise<void> {
    try {
        const removeFromFavorisUseCase = new RemoveFromFavorisUseCase(dependencies.favorisLoader);

        return await removeFromFavorisUseCase.exécute(idUser, finessNumber);
    } catch (error) {
        dependencies.logger.error(error);
        throw error;
    }
}
