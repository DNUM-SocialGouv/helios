import { CategoriesFinessModel } from "../../../../database/models/CategoriesFinessModel";
import { CategoriesFinessLoader } from "../gateways/CategoriesFinessLoader";

export class CategoriesFinessUseCase {
    constructor(private readonly categoriesFinessLoader: CategoriesFinessLoader) { }

    async getAllCategories(): Promise<CategoriesFinessModel[] | null> {
        return await this.categoriesFinessLoader.getAllCategories();
    }
}
