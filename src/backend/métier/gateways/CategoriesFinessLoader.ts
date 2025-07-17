import { CategoriesFinessModel } from "../../../../database/models/CategoriesFinessModel";

export interface CategoriesFinessLoader {
    getAllCategories(): Promise<CategoriesFinessModel[]>;
}
