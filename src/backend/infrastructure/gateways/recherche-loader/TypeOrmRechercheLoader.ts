import { DataSource, SelectQueryBuilder } from "typeorm";

import { RechercheModel } from "../../../../../database/models/RechercheModel";
import { Résultat, RésultatDeRecherche } from "../../../métier/entities/RésultatDeRecherche";
import { RechercheLoader } from "../../../métier/gateways/RechercheLoader";
import { OrderDir } from "../../../métier/use-cases/RechercheAvanceeParmiLesEntitésEtÉtablissementsUseCase";

type RechercheTypeOrm = Readonly<{
  commune: string;
  departement: string;
  numero_finess: string;
  raison_sociale_courte: string;
  type: string;
}>;

export class TypeOrmRechercheLoader implements RechercheLoader {
  private readonly NOMBRE_DE_RÉSULTATS_MAX_PAR_PAGE = 12;
  private readonly NOMBRE_DE_RÉSULTATS_RECHERCHE_AVANCEE__MAX_PAR_PAGE = 20;

  constructor(private readonly orm: Promise<DataSource>) { }

  async recherche(terme: string, page: number): Promise<RésultatDeRecherche> {
    const termeSansEspaces = terme.replaceAll(/\s/g, "");
    const termeSansTirets = terme.replaceAll(/-/g, " ");

    const requêteDeLaRecherche = (await this.orm)
      .createQueryBuilder()
      .select("recherche.numero_finess", "numero_finess")
      .addSelect("recherche.raison_sociale_courte", "raison_sociale_courte")
      .addSelect("recherche.type", "type")
      .addSelect("recherche.commune", "commune")
      .addSelect("recherche.departement", "departement")
      .addSelect("ts_rank_cd(recherche.termes, plainto_tsquery('unaccent_helios', :terme))", "rank")
      .from(RechercheModel, "recherche")
      .where("recherche.termes @@ plainto_tsquery('unaccent_helios', :terme)", { terme })
      .orWhere("recherche.termes @@ plainto_tsquery('unaccent_helios', :termeSansEspaces)", { termeSansEspaces })
      .orWhere("recherche.termes @@ plainto_tsquery('unaccent_helios', :termeSansTirets)", { termeSansTirets })
      .orderBy("rank", "DESC")
      .addOrderBy("type", "ASC")
      .addOrderBy("numero_finess", "ASC")
      .limit(this.NOMBRE_DE_RÉSULTATS_MAX_PAR_PAGE)
      .offset(this.NOMBRE_DE_RÉSULTATS_MAX_PAR_PAGE * (page - 1));

    const rechercheModelRésultats = await requêteDeLaRecherche.getRawMany<RechercheTypeOrm>();
    const nombreDeRésultats = await this.compteLeNombreDeRésultats(requêteDeLaRecherche);

    return this.construisLesRésultatsDeLaRecherche(rechercheModelRésultats, nombreDeRésultats);
  }

  async rechercheAvancee(terme: string, commune: string, type: string, statutJuridique: string[], orderBy: string, order: OrderDir, page: number): Promise<RésultatDeRecherche> {
    const termeSansEspaces = terme.replaceAll(/\s/g, "");
    const termeSansTirets = terme.replaceAll(/-/g, " ");
    const majusCommune = commune.replaceAll(/\b(?:-|')\b/gi, " ").toLocaleUpperCase();

    const conditions = [];
    const parameters: any = {};

    const requêteDeLaRecherche = (await this.orm)
      .createQueryBuilder()
      .select("recherche.numero_finess", "numero_finess")
      .addSelect("recherche.raison_sociale_courte", "raison_sociale_courte")
      .addSelect("recherche.type", "type")
      .addSelect("recherche.commune", "commune")
      .addSelect("recherche.departement", "departement")
      .addSelect("recherche.statut_juridique", "statutJuridique")
      .from(RechercheModel, "recherche");

    if (majusCommune) {
      conditions.push("recherche.commune = :commune");
      parameters.commune = majusCommune;
    }

    if (terme) {
      conditions.push("(recherche.termes @@ plainto_tsquery('unaccent_helios', :terme) OR recherche.termes @@ plainto_tsquery('unaccent_helios', :termeSansEspaces) OR recherche.termes @@ plainto_tsquery('unaccent_helios', :termeSansTirets))");
      parameters.terme = terme;
      parameters.termeSansEspaces = termeSansEspaces;
      parameters.termeSansTirets = termeSansTirets;
    }

    if (type) {
      conditions.push("recherche.type = :type");
      parameters.type = type;
    }

    if (statutJuridique.length > 0) {
      conditions.push("(recherche.statut_juridique IN (:...statutJuridique) OR recherche.statut_juridique = '')");
      parameters.statutJuridique = statutJuridique;
    }

    if (conditions.length > 0) requêteDeLaRecherche.where(conditions.join(' AND '), parameters);

    if (orderBy && order) {
      requêteDeLaRecherche.orderBy(orderBy, order)
        .limit(this.NOMBRE_DE_RÉSULTATS_RECHERCHE_AVANCEE__MAX_PAR_PAGE)
        .offset(this.NOMBRE_DE_RÉSULTATS_RECHERCHE_AVANCEE__MAX_PAR_PAGE * (page - 1));
    } else {
      requêteDeLaRecherche.orderBy("type", "ASC")
        .addOrderBy("numero_finess", "ASC")
        .limit(this.NOMBRE_DE_RÉSULTATS_RECHERCHE_AVANCEE__MAX_PAR_PAGE)
        .offset(this.NOMBRE_DE_RÉSULTATS_RECHERCHE_AVANCEE__MAX_PAR_PAGE * (page - 1));
    }

    const rechercheModelRésultats = await requêteDeLaRecherche.getRawMany<RechercheTypeOrm>();
    const nombreDeRésultats = await this.compteLeNombreDeRésultats(requêteDeLaRecherche);

    return this.construisLesRésultatsDeLaRecherche(rechercheModelRésultats, nombreDeRésultats);
  }


  private async compteLeNombreDeRésultats(requêteDeLaRecherche: SelectQueryBuilder<RechercheModel>): Promise<number> {
    return await requêteDeLaRecherche.getCount();
  }

  private construisLesRésultatsDeLaRecherche(résultats: RechercheTypeOrm[], nombreDeRésultats: number): RésultatDeRecherche {
    return {
      nombreDeRésultats,
      résultats: résultats.map((rechercheRésultat: RechercheTypeOrm): Résultat => {
        return {
          commune: rechercheRésultat.commune,
          département: rechercheRésultat.departement,
          numéroFiness: rechercheRésultat.numero_finess,
          raisonSocialeCourte: rechercheRésultat.raison_sociale_courte,
          type: rechercheRésultat.type,
        };
      }),
    };
  }
}
