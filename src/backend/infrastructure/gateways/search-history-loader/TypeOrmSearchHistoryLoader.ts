import { DataSource } from "typeorm";

import { SearchHistoryModel } from "../../../../../database/models/SearchHistoryModel";
import { SearchHistoryLoader } from "../../../métier/gateways/SearchHistoryLoader";

export class TypeOrmSearchHistoryLoader implements SearchHistoryLoader {
    constructor(private readonly orm: Promise<DataSource>) { }


    async saveSearchHistory(title: string, idUser: string, finessNumber: string, type: string) {
        const history = await (await this.orm).getRepository(SearchHistoryModel).findOne({ where: { userId: idUser, finessNumber: finessNumber } });
        if (history) {
            await (await this.orm).getRepository(SearchHistoryModel).update(history.id, { date: new Date() });
        } else {
            // make sure to keep only the last 10 search
            const count = await (await this.orm).getRepository(SearchHistoryModel).countBy({ userId: idUser });
            const searchHistory = new SearchHistoryModel();
            searchHistory.date = new Date();
            searchHistory.finessNumber = finessNumber;
            searchHistory.title = title;
            searchHistory.userId = idUser;
            searchHistory.type = type;
            if (count === 10) {
                // delete the oldest line
                const oldestElement = await (await this.orm).getRepository(SearchHistoryModel).findOne({
                    where: { userId: idUser },
                    order: { date: 'ASC' },
                });
                if (oldestElement) await (await this.orm).getRepository(SearchHistoryModel).remove(oldestElement);
            }
            await (await this.orm).getRepository(SearchHistoryModel).save(searchHistory);
        }
    }

    async getAllUserSearchHistory(idUser: string) {
        return await (await this.orm).getRepository(SearchHistoryModel).find({ where: { userId: idUser }, order: { date: 'DESC' } });
    }
}