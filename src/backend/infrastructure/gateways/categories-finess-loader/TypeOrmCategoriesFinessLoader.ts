import { DataSource } from "typeorm";

import { CategoriesFinessModel } from "../../../../../database/models/CategoriesFinessModel";
import { CategoriesFinessLoader } from "../../../métier/gateways/CategoriesFinessLoader";

export class TypeOrmCategoriesFinessLoader implements CategoriesFinessLoader {
    constructor(private readonly orm: Promise<DataSource>) { }

    async getAllCategories(): Promise<CategoriesFinessModel[]> {
        return await (await this.orm).getRepository(CategoriesFinessModel).find();
    }
}