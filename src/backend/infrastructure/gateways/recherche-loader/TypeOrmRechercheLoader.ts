import { DataSource, SelectQueryBuilder } from "typeorm";

import { AutorisationMédicoSocialModel } from "../../../../../database/models/AutorisationMédicoSocialModel";
import { RechercheModel } from "../../../../../database/models/RechercheModel";
import { ÉtablissementTerritorialIdentitéModel } from "../../../../../database/models/ÉtablissementTerritorialIdentitéModel";
import { ParametreDeRechercheAvancee, CapaciteSMS, OrderDir } from "../../../métier/entities/ParametresDeRechercheAvancee";
import { Résultat, RésultatDeRecherche } from "../../../métier/entities/RésultatDeRecherche";
import { RechercheLoader } from "../../../métier/gateways/RechercheLoader";

type RechercheTypeOrm = Readonly<{
  commune: string;
  departement: string;
  codeRegion: string;
  numero_finess: string;
  raison_sociale_courte: string;
  type: string;
  rattachement: string;
}>;

export class TypeOrmRechercheLoader implements RechercheLoader {
  private readonly NOMBRE_DE_RÉSULTATS_MAX_PAR_PAGE = 12;
  private readonly NOMBRE_DE_RÉSULTATS_RECHERCHE_AVANCEE__MAX_PAR_PAGE = 20;

  constructor(private readonly orm: Promise<DataSource>) { }

  async recherche(terme: string, page: number, orderBy?: string, order?: OrderDir, displayTable?: boolean): Promise<RésultatDeRecherche> {
    const termeSansEspaces = terme.replaceAll(/\s/g, "");
    const termeSansTirets = terme.replaceAll(/-/g, " ");

    const queryBuilder = (await this.orm).createQueryBuilder();

    const requêteDeLaRecherche = queryBuilder
      .select("recherche.numero_finess", "numero_finess")
      .addSelect("recherche.raison_sociale_courte", "raison_sociale_courte")
      .addSelect("recherche.type", "type")
      .addSelect("recherche.commune", "commune")
      .addSelect("recherche.departement", "departement")
      .addSelect("CASE WHEN recherche.raison_sociale_courte ILIKE '%' || :terme || '%' THEN 1 ELSE 0 END", "is_exact")
      .addSelect("CASE WHEN recherche.departement ILIKE '%' || :terme || '%' THEN 1 ELSE 0 END", "is_exact_dep")
      .addSelect("CASE WHEN recherche.commune ILIKE '%' || :terme || '%' THEN 1 ELSE 0 END", "is_exact_com")
      .addSelect("ts_rank_cd(recherche.termes, plainto_tsquery('unaccent_helios', :terme))", "rank")
      .from(RechercheModel, "recherche")
      .where("recherche.termes @@ plainto_tsquery('unaccent_helios', :terme)", { terme })
      .orWhere("recherche.termes @@ plainto_tsquery('unaccent_helios', :termeSansEspaces)", { termeSansEspaces })
      .orWhere("recherche.termes @@ plainto_tsquery('unaccent_helios', :termeSansTirets)", { termeSansTirets })

    const nombreDeRésultats = displayTable ? (await requêteDeLaRecherche.clone().select("COUNT(DISTINCT recherche.numero_finess)", "count").getRawOne()).count : await this.compteLeNombreDeRésultats(requêteDeLaRecherche);

    if (displayTable) {
      requêteDeLaRecherche
        .addSelect(
          `CASE 
          WHEN recherche.type != 'Entité juridique' THEN CONCAT('EJ', ' - ', recherche.rattachement, ' - ', entite_juridique.raison_sociale_courte)
          ELSE 
          CONCAT(
            'Sanitaire (', 
            COUNT(CASE WHEN etablissement_territorial.domaine = 'Sanitaire' THEN etablissement_territorial.numero_finess_entite_juridique END),
            '), SMS (',
            COUNT(CASE WHEN etablissement_territorial.domaine = 'Médico-social' THEN etablissement_territorial.numero_finess_entite_juridique END), ')'
          )
        END`,
          "rattachement"
        )
        .leftJoin("entite_juridique", "entite_juridique", "recherche.rattachement = entite_juridique.numero_finess_entite_juridique")
        .leftJoin("etablissement_territorial", "etablissement_territorial", "etablissement_territorial.numero_finess_entite_juridique = recherche.numero_finess")
        .addGroupBy("recherche.commune")
        .addGroupBy("recherche.type")
        .addGroupBy("recherche.numero_finess")
        .addGroupBy("recherche.raison_sociale_courte")
        .addGroupBy("recherche.departement")
        .addGroupBy("recherche.termes")
        .addGroupBy("recherche.rattachement")
        .addGroupBy("entite_juridique.raison_sociale_courte")
        .orderBy("is_exact", "DESC")
        .addOrderBy("is_exact_dep", "DESC")
        .addOrderBy("is_exact_com", "DESC")
        .addOrderBy("rank", "DESC")
        .addOrderBy("type", "ASC")
        .addOrderBy("numero_finess", "ASC")
        .limit(this.NOMBRE_DE_RÉSULTATS_RECHERCHE_AVANCEE__MAX_PAR_PAGE)
        .offset(this.NOMBRE_DE_RÉSULTATS_RECHERCHE_AVANCEE__MAX_PAR_PAGE * (page - 1));
    } else {
      requêteDeLaRecherche
        .addSelect("recherche.rattachement", "rattachement")
        .orderBy("is_exact", "DESC")
        .addOrderBy("is_exact_dep", "DESC")
        .addOrderBy("is_exact_com", "DESC")
        .addOrderBy("rank", "DESC")
        .addOrderBy("type", "ASC")
        .addOrderBy("numero_finess", "ASC")
        .limit(this.NOMBRE_DE_RÉSULTATS_MAX_PAR_PAGE)
        .offset(this.NOMBRE_DE_RÉSULTATS_MAX_PAR_PAGE * (page - 1));
    }

    if (order && orderBy) {
      requêteDeLaRecherche.orderBy(orderBy, order)
    }

    const rechercheModelRésultats = await requêteDeLaRecherche.getRawMany<RechercheTypeOrm>();

    return this.construisLesRésultatsDeLaRecherche(rechercheModelRésultats, nombreDeRésultats);
  }

  computeZoneParam(zone: string, typeZone: string) {
    let zoneParam = "";
    if (zone) {
      if (typeZone === "R") {
        zoneParam = zone;
      } else {
        zoneParam = zone
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/\b(?:[-'])\b/gi, " ")
          .toLocaleUpperCase();
      }
    }
    return zoneParam;
  }

  async rechercheAvancee(params: ParametreDeRechercheAvancee): Promise<RésultatDeRecherche> {
    const { terme, zone, zoneD, typeZone, type, statutJuridique, capaciteSMS, orderBy, order, page, forExport } = params;

    const termeSansEspaces = terme.replaceAll(/\s/g, "");
    const termeSansTirets = terme.replaceAll(/-/g, " ");

    const zoneParam = this.computeZoneParam(zone, typeZone);

    const zoneDParam = typeZone === 'C' ? zoneD.normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\b(?:[-'])\b/gi, " ")
      .toLocaleUpperCase() : '';

    const conditions = [];
    let parameters: any = { terme: terme };

    const requêteDeLaRecherche = (await this.orm)
      .createQueryBuilder()
      .select("recherche.numero_finess", "numero_finess")
      .distinct(true)
      .addSelect("recherche.raison_sociale_courte", "raison_sociale_courte")
      .addSelect("recherche.type", "type")
      .addSelect("recherche.commune", "commune")
      .addSelect("recherche.departement", "departement")
      .addSelect("recherche.code_region", "code_region")
      .addSelect("recherche.statut_juridique", "statutJuridique")
      .addSelect(
        `CASE 
          WHEN recherche.type != 'Entité juridique' THEN CONCAT('EJ', ' - ', recherche.rattachement, ' - ', entite_juridique.raison_sociale_courte)
          ELSE 
          CONCAT(
            'Sanitaire (', 
            COUNT(CASE WHEN etablissement_territorial.domaine = 'Sanitaire' THEN etablissement_territorial.numero_finess_entite_juridique END),
            '), SMS (',
            COUNT(CASE WHEN etablissement_territorial.domaine = 'Médico-social' THEN etablissement_territorial.numero_finess_entite_juridique END), ')'
          )
        END`,
        "rattachement"
      )

    if (terme) {
      requêteDeLaRecherche
        .addSelect(`CASE WHEN recherche.raison_sociale_courte ILIKE '%' || :terme || '%' THEN 1 ELSE 0 END`, "is_exact")
        .addSelect("CASE WHEN recherche.departement ILIKE '%' || :terme || '%' THEN 1 ELSE 0 END", "is_exact_dep")
        .addSelect("CASE WHEN recherche.commune ILIKE '%' || :terme || '%' THEN 1 ELSE 0 END", "is_exact_com")
        .addSelect("ts_rank_cd(recherche.termes, plainto_tsquery('unaccent_helios', :terme))", "rank")

      conditions.push(
        "(recherche.termes @@ plainto_tsquery('unaccent_helios', :terme) OR recherche.termes @@ plainto_tsquery('unaccent_helios', :termeSansEspaces) OR recherche.termes @@ plainto_tsquery('unaccent_helios', :termeSansTirets))"
      );
      parameters.terme = terme;
      parameters = { ...parameters, termeSansEspaces: termeSansEspaces, termeSansTirets: termeSansTirets };
    }

    requêteDeLaRecherche.from(RechercheModel, "recherche")
      .leftJoin("entite_juridique", "entite_juridique", "recherche.rattachement = entite_juridique.numero_finess_entite_juridique")
      .leftJoin("etablissement_territorial", "etablissement_territorial", "etablissement_territorial.numero_finess_entite_juridique = recherche.numero_finess");

    if (zoneParam) {
      parameters = this.computeZoneParamConditions(typeZone, zoneParam, conditions, parameters, zoneDParam);
    }

    if (type) {
      conditions.push("recherche.type = :type");
      parameters = { ...parameters, type: type };
    }

    if (statutJuridique.length > 0) {
      conditions.push("(recherche.statut_juridique IN (:...statutJuridique) OR recherche.statut_juridique = '')");
      parameters = { ...parameters, statutJuridique: statutJuridique };
    }

    const CapaciteSMS = (await this.orm)
      .createQueryBuilder()
      .select("ams.numero_finess_etablissement_territorial", "numero_finess_etablissement_territorial")
      .addSelect("SUM(ams.capacite_installee_totale)", "capacite_installee_totale")
      .from(AutorisationMédicoSocialModel, "ams")
      .groupBy("ams.numero_finess_etablissement_territorial");

    if (capaciteSMS.length !== 0) {
      const capaciteSMSConditions: string[] = [];
      requêteDeLaRecherche
        .innerJoin(`(${CapaciteSMS.getQuery()})`, "capacite_sms", "recherche.numero_finess = capacite_sms.numero_finess_etablissement_territorial")
        .innerJoin(
          ÉtablissementTerritorialIdentitéModel,
          "etablissement",
          "capacite_sms.numero_finess_etablissement_territorial = etablissement.numéroFinessÉtablissementTerritorial"
        );
      capaciteSMS.forEach((capacite) => {
        const conditionsSMS = this.construireLaLogiqueCapaciteEtablissements(capacite);
        capaciteSMSConditions.push(conditionsSMS.capaciteSMSConditions);
        parameters = { ...parameters, ...conditionsSMS.parameters };
      });
      conditions.push(capaciteSMS.length === 1 ? capaciteSMSConditions[0] : "(" + capaciteSMSConditions.join(" OR ") + ")");
    }

    if (conditions.length > 0) requêteDeLaRecherche.where(conditions.join(" AND "), parameters);

    const nombreDeRésultats = await requêteDeLaRecherche.clone().select("COUNT(DISTINCT recherche.numero_finess)", "count").getRawOne();

    requêteDeLaRecherche
      .addGroupBy("recherche.commune")
      .addGroupBy("recherche.type")
      .addGroupBy("recherche.statut_juridique")
      .addGroupBy("recherche.numero_finess")
      .addGroupBy("recherche.raison_sociale_courte")
      .addGroupBy("recherche.departement")
      .addGroupBy("recherche.code_region")
      .addGroupBy("recherche.rattachement")
      .addGroupBy("entite_juridique.raison_sociale_courte")
      .addGroupBy("recherche.termes")

    if (orderBy && order) {
      requêteDeLaRecherche
        .orderBy(orderBy, order)
    } else if (terme) {
      requêteDeLaRecherche
        .orderBy("is_exact", "DESC")
        .addOrderBy("is_exact_dep", "DESC")
        .addOrderBy("is_exact_com", "DESC")
        .addOrderBy("rank", "DESC")
        .addOrderBy("type", "ASC")
        .addOrderBy("numero_finess", "ASC")
    } else {
      requêteDeLaRecherche
        .orderBy("type", "ASC")
        .addOrderBy("numero_finess", "ASC")
    }

    if (!forExport) {
      requêteDeLaRecherche
        .limit(this.NOMBRE_DE_RÉSULTATS_RECHERCHE_AVANCEE__MAX_PAR_PAGE)
        .offset(this.NOMBRE_DE_RÉSULTATS_RECHERCHE_AVANCEE__MAX_PAR_PAGE * (page - 1));
    }

    const rechercheModelRésultats = await requêteDeLaRecherche.getRawMany<RechercheTypeOrm>();

    return this.construisLesRésultatsDeLaRecherche(rechercheModelRésultats, nombreDeRésultats.count);

  }

  private computeZoneParamConditions(typeZone: string, zoneParam: string, conditions: any[], parameters: any, zoneDParam: string) {
    let newParameters = parameters;
    if (typeZone === "C") {
      // Afficher toute la ville pour les villes avec arrondissements: Paris, Marseille et Lyon
      if (zoneParam === "LYON" || zoneParam === "MARSEILLE" || zoneParam === "PARIS") {
        conditions.push("recherche.commune like :commune");
        newParameters = { ...newParameters, commune: `%${zoneParam}%ARRONDISSEMENT%` };
      } else {
        conditions.push("recherche.commune = :commune");
        conditions.push("recherche.departement = :departement");
        newParameters = { ...newParameters, commune: zoneParam, departement: zoneDParam };
      }
    }
    if (typeZone === "D") {
      conditions.push("recherche.departement = :departement");
      newParameters = { ...newParameters, departement: zoneParam };
    }
    if (typeZone === "R") {
      conditions.push("recherche.code_region = :codeRegion");
      newParameters = { ...newParameters, codeRegion: zoneParam };
    }
    return newParameters;
  }

  async rechercheParNumeroFiness(finessNumber: string[]): Promise<Résultat[]> {
    const resultatDeLaRecherche = await (await this.orm).createQueryBuilder()
      .select("recherche.numero_finess", "numeroFiness")
      .addSelect("recherche.raison_sociale_courte", "raisonSocialeCourte")
      .addSelect("recherche.type", "type")
      .addSelect("recherche.commune", "commune")
      .addSelect("recherche.departement", "département")
      .addSelect(
        `CASE 
          WHEN recherche.type != 'Entité juridique' THEN CONCAT('EJ', ' - ', recherche.rattachement, ' - ', entite_juridique.raison_sociale_courte)
          ELSE 
          CONCAT(
            'Sanitaire (', 
            COUNT(CASE WHEN etablissement_territorial.domaine = 'Sanitaire' THEN etablissement_territorial.numero_finess_entite_juridique END),
            '), SMS (',
            COUNT(CASE WHEN etablissement_territorial.domaine = 'Médico-social' THEN etablissement_territorial.numero_finess_entite_juridique END), ')'
          )
        END`,
        "rattachement"
      )
      .from(RechercheModel, "recherche")
      .leftJoin("entite_juridique", "entite_juridique", "recherche.rattachement = entite_juridique.numero_finess_entite_juridique")
      .leftJoin("etablissement_territorial", "etablissement_territorial", "etablissement_territorial.numero_finess_entite_juridique = recherche.numero_finess")
      .where("recherche.numeroFiness  IN(:...numeroFiness)", { numeroFiness: finessNumber })
      .addGroupBy("recherche.numero_finess")
      .addGroupBy("recherche.raison_sociale_courte")
      .addGroupBy("recherche.type")
      .addGroupBy("recherche.commune")
      .addGroupBy("recherche.departement")
      .addGroupBy("recherche.rattachement")
      .addGroupBy("entite_juridique.raison_sociale_courte")
      .getRawMany<RechercheModel>();

    return resultatDeLaRecherche.map((resultat) => {
      return {
        numéroFiness: resultat.numeroFiness,
        ...resultat
      }
    });
  }

  private construisLesConditionsCapacitesSMS(capaciteSMS: CapaciteSMS, conditionsBefore: string, parameters: { [key: string]: any }): any {
    const conditions: string[] = [];
    let capaciteSMSConditions = "";
    capaciteSMS.ranges.forEach((range, index) => {
      if (range.includes(">")) {
        conditions.push(`capacite_sms.capacite_installee_totale > :range${capaciteSMS.classification}${index}`);
        parameters[`range${capaciteSMS.classification}${index}`] = range.substring(1);
      } else {
        const limits = range.split(",");
        conditions.push(
          `capacite_sms.capacite_installee_totale BETWEEN :min${capaciteSMS.classification}${index} AND :max${capaciteSMS.classification}${index}`
        );
        parameters[`min${capaciteSMS.classification}${index}`] = limits[0];
        parameters[`max${capaciteSMS.classification}${index}`] = limits[1];
      }
    });
    if (capaciteSMS.ranges.length === 1) capaciteSMSConditions = conditions[0];
    else {
      capaciteSMSConditions = "(" + conditions.join(" OR ") + ")";
    }
    capaciteSMSConditions = conditionsBefore !== "" ? "(" + conditionsBefore + ") AND " + "(" + capaciteSMSConditions + ")" : "(" + capaciteSMSConditions + ")";
    return { capaciteSMSConditions, parameters };
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
          rattachement: rechercheRésultat.rattachement,
        };
      }),
    };
  }

  private construireLaLogiqueCapaciteEtablissements(capacite: CapaciteSMS): any {
    const listCapaciteHandicape = [189, 190, 198, 461, 249, 448, 188, 246, 437, 195, 194, 192, 183, 186, 255, 182, 445, 464];
    const listCapaciteAgee = [500, 209, 354];
    const conditions: string[] = [];
    const parameters: { [key: string]: any } = {};
    if (capacite.classification === "publics_en_situation_de_handicap") {
      conditions.push(`etablissement.cat_etablissement IN (:...listCapaciteHandicape)`);
      parameters[`listCapaciteHandicape`] = listCapaciteHandicape;
    } else if (capacite.classification === "personnes_agees") {
      conditions.push(`etablissement.cat_etablissement IN (:...listCapaciteAgee)`);
      parameters[`listCapaciteAgee`] = listCapaciteAgee;
    }

    let capaciteSMSConditions = "";
    if (conditions.length > 1) {
      capaciteSMSConditions = `(${conditions.join(" OR ")})`;
    } else if (conditions.length === 1) {
      capaciteSMSConditions = conditions[0];
    }

    return this.construisLesConditionsCapacitesSMS(capacite, capaciteSMSConditions, parameters);
  }
}
