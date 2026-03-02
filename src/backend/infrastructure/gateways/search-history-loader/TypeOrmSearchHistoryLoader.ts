import { DataSource } from "typeorm";

import { RechercheModel } from "../../../../../database/models/RechercheModel";
import { SearchHistoryModel } from "../../../../../database/models/SearchHistoryModel";
import { ResultatRechercheHistorique } from "../../../métier/entities/ResultatHistorique";
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
           SELECT id FROM search_history WHERE user_id = $1 ORDER BY date DESC, id DESC OFFSET 30
         )`,
      [idUser]
    );

  }

  async getAllUserSearchHistory(idUser: string): Promise<ResultatRechercheHistorique[]> {
    const resultatDeLaRecherche = await (await this.orm).createQueryBuilder()
      .select("search.date", "date")
      .addSelect("recherche.numero_finess", "finessNumber")
      .addSelect("recherche.raison_sociale_courte", "title")
      .addSelect("recherche.type", "type")
      .addSelect("recherche.categorie", "categorie")
      .addSelect("recherche.libelle_categorie", "libelleCategorie")
      .from(SearchHistoryModel, "search")
      .innerJoin(RechercheModel, "recherche", "search.finess_number = recherche.numero_finess")
      .where("search.userId = :idUser", { idUser })
      .addGroupBy("recherche.numero_finess")
      .addGroupBy("recherche.raison_sociale_courte")
      .addGroupBy("recherche.type")
      .addGroupBy("recherche.categorie")
      .addGroupBy("recherche.libelle_categorie")
      .addGroupBy("search.date")
      .orderBy("search.date", "DESC")
      .getRawMany<ResultatRechercheHistorique>();

    return resultatDeLaRecherche.map((resultat) => {
      return {
        finessNumber: resultat.finessNumber,
        title: resultat.title,
        date: resultat.date,
        libelleCategorie: resultat.libelleCategorie,
        type: resultat.type,
        categorie: resultat.categorie + "-" + resultat.libelleCategorie,
      }
    });
  }
}
