import { CategoriesFinessModel } from "../../../../database/models/CategoriesFinessModel";
import { CategoriesFinessUseCase } from "../../métier/use-cases/CategoriesFinessUseCase";
import { Dependencies } from "../dependencies";

export async function getFinessCategoriesEndpoint(dependencies: Dependencies): Promise<CategoriesFinessModel[] | null> {
    try {
        const categoriesFinessUseCase = new CategoriesFinessUseCase(dependencies.categoriesFinessLoader);
        return await categoriesFinessUseCase.getAllCategories();
    } catch (error) {
        dependencies.logger.error(error);
        throw error;
    }
}
