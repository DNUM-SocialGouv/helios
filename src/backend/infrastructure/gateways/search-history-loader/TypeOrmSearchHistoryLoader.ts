import { DataSource } from "typeorm";

import { SearchHistoryModel } from "../../../../../database/models/SearchHistoryModel";
import { SearchHistoryLoader } from "../../../métier/gateways/SearchHistoryLoader";

export class TypeOrmSearchHistoryLoader implements SearchHistoryLoader {
  constructor(private readonly orm: Promise<DataSource>) { }


  async saveSearchHistory(title: string, idUser: string, finessNumber: string, type: string) {

    const ds = await this.orm;
    const repo = (await this.orm).getRepository(SearchHistoryModel);
    const history = await repo.findOne({ where: { userId: idUser, finessNumber: finessNumber } });
    if (history) {
      await repo.update(history.id, { date: new Date() });
    } else {
      const searchHistory = new SearchHistoryModel();
      searchHistory.date = new Date();
      searchHistory.finessNumber = finessNumber;
      searchHistory.title = title;
      searchHistory.userId = idUser;
      searchHistory.type = type;
      await repo.save(searchHistory);
    }

    // Supprime les 10 entrées les plus anciennes
    await ds.query(
      `DELETE FROM search_history WHERE id IN (
           SELECT id FROM search_history WHERE user_id = $1 ORDER BY date DESC, id DESC OFFSET 10
         )`,
      [idUser]
    );

  }

  async getAllUserSearchHistory(idUser: string) {
    return await (await this.orm).getRepository(SearchHistoryModel).find({ where: { userId: idUser }, order: { date: 'DESC' } });
  }
}
