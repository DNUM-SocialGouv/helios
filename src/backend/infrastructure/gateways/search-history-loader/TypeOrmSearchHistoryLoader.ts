import { DataSource } from "typeorm";

import { SearchHistoryModel } from "../../../../../database/models/SearchHistoryModel";
import { SearchHistoryLoader } from "../../../métier/gateways/SearchHistoryLoader";

export class TypeOrmSearchHistoryLoader implements SearchHistoryLoader {
    constructor(private readonly orm: Promise<DataSource>) { }


    async saveSearchHistory(title: string, idUser: string, finessNumber: string, type: string) {
        // check if not exists --> if exists update date else save
        const history = await (await this.orm).getRepository(SearchHistoryModel).findOne({ where: { userId: idUser, finessNumber: finessNumber } });
        if (history) {
            await (await this.orm).getRepository(SearchHistoryModel).update(history.id, { date: new Date() });
        } else {
            const searchHistory = new SearchHistoryModel();
            searchHistory.date = new Date();
            searchHistory.finessNumber = finessNumber;
            searchHistory.title = title;
            searchHistory.userId = idUser;
            searchHistory.type = type;
            await (await this.orm).getRepository(SearchHistoryModel).save(searchHistory);
        }

    }
}