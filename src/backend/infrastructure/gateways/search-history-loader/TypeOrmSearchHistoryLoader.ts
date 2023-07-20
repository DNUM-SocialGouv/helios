import { DataSource } from "typeorm";

import { SearchHistoryModel } from "../../../../../database/models/SearchHistoryModel";
import { SearchHistoryLoader } from "../../../métier/gateways/SearchHistoryLoader";

export class TypeOrmSearchHistoryLoader implements SearchHistoryLoader {
    constructor(private readonly orm: Promise<DataSource>) { }


    async saveSearchHistory(title: string, idUser: string, finessNumber: string) {
        const searchHistory = new SearchHistoryModel();
        searchHistory.date = new Date();
        searchHistory.finessNumber = finessNumber;
        searchHistory.title = title;
        searchHistory.userId = idUser;
        await (await this.orm).getRepository(SearchHistoryModel).save(searchHistory);
    }
}