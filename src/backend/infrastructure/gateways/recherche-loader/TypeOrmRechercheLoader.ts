import { DataSource, SelectQueryBuilder } from "typeorm";

import { ActivitéSanitaireModel } from "../../../../../database/models/ActivitéSanitaireModel";
import { AutorisationMédicoSocialModel } from "../../../../../database/models/AutorisationMédicoSocialModel";
import { RechercheModel } from "../../../../../database/models/RechercheModel";
import { ÉtablissementTerritorialIdentitéModel } from "../../../../../database/models/ÉtablissementTerritorialIdentitéModel";
import { ParametreDeRechercheAvancee, CapaciteSMS, OrderDir, ActiviteSAN } from "../../../métier/entities/ParametresDeRechercheAvancee";
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
    const { terme, zone, zoneD, typeZone, type, statutJuridique, categories, capaciteSMS, activiteSAN, orderBy, order, page, forExport } = params;

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




    let capaciteQuery = requêteDeLaRecherche.clone();
    let capaciteParams = { ...parameters };
    const capaciteConditions: any[] = [];
    capaciteConditions.push(...conditions);
    let activiteQuery = requêteDeLaRecherche.clone();
    let activiteParams = { ...parameters };
    const activiteConditions: any[] = [];
    activiteConditions.push(...conditions);
    const standardQuery = requêteDeLaRecherche.clone();
    let standardParams = { ...parameters };
    const standardConditions: any[] = [];
    standardConditions.push(...conditions);

    let nombreDeRésultats;
    let nombreDeRésultatsStandard;
    let nombreDeRésultatsCapacite;
    let nombreDeRésultatsActivite;
    let finalQuery;


    if (capaciteSMS.length === 0 && activiteSAN.length === 0) {
      if (zoneParam) {
        standardParams = this.computeZoneParamConditions(typeZone, zoneParam, standardConditions, standardParams, zoneDParam);
      }
      if (type.length > 0) {
        standardParams = this.computeStructureParamConditions(statutJuridique, type, capaciteSMS, activiteSAN, standardConditions, standardParams);
      }

      if (categories.length !== 0) {
        standardParams = this.ajouteFiltreCategories(categories, standardConditions, standardParams);
      }
      if (standardConditions.length > 0) standardQuery.where(standardConditions.join(" AND "), standardParams);

      nombreDeRésultatsStandard = await standardQuery.clone().select("COUNT(DISTINCT recherche.numero_finess)", "count").getRawOne();

      standardQuery
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
    }

    if (capaciteSMS.length !== 0) {
      if (zoneParam) {
        capaciteParams = this.computeZoneParamConditions(typeZone, zoneParam, capaciteConditions, capaciteParams, zoneDParam);
      }
      capaciteQuery = await this.ajouteFiltreCapaciteSMS(capaciteQuery, capaciteSMS, capaciteConditions, capaciteParams);

      if (capaciteConditions.length > 0) capaciteQuery.where(capaciteConditions.join(" AND "), capaciteParams);
      nombreDeRésultatsCapacite = await capaciteQuery.clone().select("COUNT(DISTINCT recherche.numero_finess)", "count").getRawOne();
      capaciteQuery
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
    }

    if (activiteSAN.length !== 0) {
      if (zoneParam) {
        activiteParams = this.computeZoneParamConditions(typeZone, zoneParam, activiteConditions, activiteParams, zoneDParam);
      }

      activiteQuery = await this.ajouteFiltreActiviteSAN(activiteQuery, activiteSAN, activiteConditions, activiteParams);
      if (activiteConditions.length > 0) activiteQuery.where(activiteConditions.join(" AND "), activiteParams);
      nombreDeRésultatsActivite = await activiteQuery.clone().select("COUNT(DISTINCT recherche.numero_finess)", "count").getRawOne();
      activiteQuery
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
    }


    if (capaciteSMS.length === 0 && activiteSAN.length === 0) {
      finalQuery = standardQuery;
      nombreDeRésultats = nombreDeRésultatsStandard.count;
    } else {
      const hasCapacite = capaciteSMS.length !== 0;
      const hasActivite = activiteSAN.length !== 0;
      const structureToHandle = (capaciteSMS.length !== 0 && activiteSAN.length === 0 && type.length > 1) || (activiteSAN.length !== 0 && capaciteSMS.length === 0 && type.length > 1) || (capaciteSMS.length !== 0 && activiteSAN.length && type.length > 2);

      if (structureToHandle) {
        if (zoneParam) {
          standardParams = this.computeZoneParamConditions(typeZone, zoneParam, standardConditions, standardParams, zoneDParam);
        }
        if (type.length > 0) {
          standardParams = this.computeStructureParamConditions(statutJuridique, type, capaciteSMS, activiteSAN, standardConditions, standardParams);
        }
        if (standardConditions.length > 0) standardQuery.where(standardConditions.join(" AND "), standardParams);


        nombreDeRésultatsStandard = await standardQuery.clone().select("COUNT(DISTINCT recherche.numero_finess)", "count").getRawOne();

        standardQuery
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


        finalQuery = standardQuery;
        nombreDeRésultats = Number(nombreDeRésultatsStandard.count);

        if (hasCapacite) {
          finalQuery = (await this.orm)
            .createQueryBuilder()
            .select()
            .from(`(${finalQuery.getQuery()} UNION ALL ${capaciteQuery.getQuery()})`, 'union_table')
            .setParameters({ ...finalQuery.getParameters(), ...capaciteQuery.getParameters() });
          nombreDeRésultats += Number(nombreDeRésultatsCapacite.count);
        }
        if (hasActivite) {
          finalQuery = (await this.orm)
            .createQueryBuilder()
            .select()
            .from(`(${finalQuery.getQuery()} UNION ALL ${activiteQuery.getQuery()})`, 'union_table')
            .setParameters({ ...finalQuery.getParameters(), ...activiteQuery.getParameters() });
          nombreDeRésultats += Number(nombreDeRésultatsActivite.count);

        }
      }
      else if (hasCapacite && hasActivite) {
        finalQuery = (await this.orm)
          .createQueryBuilder()
          .select()
          .from(`(${activiteQuery.getQuery()} UNION ALL ${capaciteQuery.getQuery()})`, 'union_table')
          .setParameters({ ...activiteQuery.getParameters(), ...capaciteQuery.getParameters() });

        nombreDeRésultats = Number(nombreDeRésultatsActivite.count) + Number(nombreDeRésultatsCapacite.count);
      } else {
        finalQuery = hasCapacite ? capaciteQuery : activiteQuery;
        nombreDeRésultats = hasCapacite ? nombreDeRésultatsCapacite.count : nombreDeRésultatsActivite.count;

      }
    }
    this.ajouteTri(finalQuery, orderBy, order, terme);

    if (!forExport) {
      finalQuery
        .limit(this.NOMBRE_DE_RÉSULTATS_RECHERCHE_AVANCEE__MAX_PAR_PAGE)
        .offset(this.NOMBRE_DE_RÉSULTATS_RECHERCHE_AVANCEE__MAX_PAR_PAGE * (page - 1));
    }
    const rechercheModelRésultats = await finalQuery.getRawMany<RechercheTypeOrm>();

    return this.construisLesRésultatsDeLaRecherche(rechercheModelRésultats, nombreDeRésultats);

  }

  private computeStructureParamConditions(statutJuridique: string[], type: string[], capaciteSMS: any[], activiteSAN: any[], conditions: any[], parameters: any) {
    let newParameters = parameters;
    if (capaciteSMS.length > 0) {
      const index = type.indexOf('Médico-social', 0);
      if (index > -1) {
        type.splice(index, 1);
      }
    }
    if (activiteSAN.length > 0) {
      const index = type.indexOf('Sanitaire', 0);
      if (index > -1) {
        type.splice(index, 1);
      }
    }

    if (statutJuridique.length > 0) {
      if (type.length === 1) {
        //seulement des EJs
        conditions.push("(recherche.statut_juridique IN (:...statutJuridique) OR recherche.statut_juridique = '')");
        conditions.push("(recherche.type IN (:...type) OR recherche.type = '')");
        newParameters = { ...parameters, statutJuridique: statutJuridique, type: type };
      } else {
        const filtredTypes = type.filter((t) => t !== 'Entité juridique');
        const typeConditions: string[] = ["(recherche.statut_juridique IN (:...statutJuridique) OR recherche.statut_juridique = '')"];
        newParameters = { ...parameters, statutJuridique: statutJuridique };

        filtredTypes.forEach((filtredType, index) => {
          typeConditions.push(`recherche.type = :${index}`);
          newParameters[`${index}`] = filtredType;
        });
        conditions.push(filtredTypes.length === 0 ? typeConditions[0] : "(" + typeConditions.join(" OR ") + ")");
      }

    } else if (type.length > 0) {
      conditions.push("(recherche.type IN (:...type) OR recherche.type = '')");
      newParameters = { ...parameters, type: type };
    }
    return newParameters;
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

  private ajouteTri(query: any, orderBy?: string, order?: "ASC" | "DESC", terme?: string) {
    if (orderBy && order) {
      query.orderBy(orderBy, order);
    } else if (terme) {
      query.orderBy("is_exact", "DESC")
        .addOrderBy("is_exact_dep", "DESC")
        .addOrderBy("is_exact_com", "DESC")
        .addOrderBy("rank", "DESC")
        .addOrderBy("type", "ASC")
        .addOrderBy("numero_finess", "ASC");
    } else {
      query.orderBy("type", "ASC")
        .addOrderBy("numero_finess", "ASC");
    }
  }

  private async ajouteFiltreCapaciteSMS(query: any, capaciteSMS: any[], conditions: string[], parameters: any) {

    const subQuery = (await this.orm)
      .createQueryBuilder()
      .select("ams.numero_finess_etablissement_territorial", "numero_finess_etablissement_territorial")
      .addSelect("SUM(ams.capacite_installee_totale)", "capacite_installee_totale")
      .from(AutorisationMédicoSocialModel, "ams")
      .groupBy("ams.numero_finess_etablissement_territorial");

    query.innerJoin(`(${subQuery.getQuery()})`, "capacite_sms", "recherche.numero_finess = capacite_sms.numero_finess_etablissement_territorial")
      .innerJoin(ÉtablissementTerritorialIdentitéModel, "etablissementMS", "capacite_sms.numero_finess_etablissement_territorial = etablissementMS.numéroFinessÉtablissementTerritorial")
      .where("etablissementMS.domaine = 'Médico-social' ");

    const caps = capaciteSMS.map(c => {
      const logique = this.construireLaLogiqueCapaciteEtablissements(c);
      Object.assign(parameters, logique.parameters);
      return logique.capaciteSMSConditions;
    });

    conditions.push(caps.length === 1 ? caps[0] : `(${caps.join(" OR ")})`);
    if (conditions.length > 0) query.where(conditions.join(" AND "), parameters);
    return query;
  }

  private async ajouteFiltreActiviteSAN(query: any, activiteSAN: ActiviteSAN[], conditions: string[], parameters: any) {
    const subQuery = (await this.orm)
      .createQueryBuilder()
      .select("as.numero_finess_etablissement_territorial", "numero_finess_etablissement_territorial")
      .addSelect("COALESCE(nombre_sejours_partiels_medecine, 0) + COALESCE(nombre_sejours_partiels_obstetrique, 0) + COALESCE(nombre_sejours_partiels_chirurgie, 0) + COALESCE(nombre_sejours_complets_medecine, 0) + COALESCE(nombre_sejours_complets_obstetrique, 0) + COALESCE(nombre_sejours_complets_chirurgie, 0)", "activite_mco")
      .addSelect("COALESCE(nombre_journees_complete_psy, 0) +  COALESCE(nombre_journées_partielles_psy, 0)", "activite_psy")
      .addSelect("COALESCE(nombre_journees_completes_ssr, 0) +  COALESCE(nombre_journees_partiels_ssr, 0)", "activite_ssr")
      .addSelect("as.nombre_journees_usld", "activite_usld")
      .addSelect("as.nombre_sejours_partiels_medecine", "nombre_sejours_partiels_medecine")
      .addSelect("as.nombre_sejours_partiels_obstetrique", "nombre_sejours_partiels_obstetrique")
      .addSelect("as.nombre_sejours_partiels_chirurgie", "nombre_sejours_partiels_chirurgie")
      .addSelect("as.nombre_sejours_complets_medecine", "nombre_sejours_complets_medecine")
      .addSelect("as.nombre_sejours_complets_obstetrique", "nombre_sejours_complets_obstetrique")
      .addSelect("as.nombre_sejours_complets_chirurgie", "nombre_sejours_complets_chirurgie")
      .addSelect("as.nombre_journees_complete_psy", "nombre_journees_complete_psy")
      .addSelect("as.nombre_journées_partielles_psy", "nombre_journées_partielles_psy")
      .addSelect("as.nombre_journees_completes_ssr", "nombre_journees_completes_ssr")
      .addSelect("as.nombre_journees_partiels_ssr", "nombre_journees_partiels_ssr")
      .from(ActivitéSanitaireModel, "as")
      .where("as.annee = (SELECT MAX(annee) FROM activite_sanitaire)")

    query.innerJoin(`(${subQuery.getQuery()})`, "activite_san", "recherche.numero_finess = activite_san.numero_finess_etablissement_territorial")
      .innerJoin(ÉtablissementTerritorialIdentitéModel, "etablissement", "activite_san.numero_finess_etablissement_territorial = etablissement.numéroFinessÉtablissementTerritorial");
    const { activitesSanConditions } = this.construisLesConditionsActiviteSan(activiteSAN, parameters)
    conditions.push(activitesSanConditions);
    if (conditions.length > 0) query.where(conditions.join(" AND "), parameters);
    return query;
  }

  private construisLesConditionsActiviteSan(activiteSan: ActiviteSAN[], parameters: { [key: string]: any }): any {
    const conditions: string[] = [];

    const nullConditionMco = " AND NOT (nombre_sejours_partiels_medecine IS NULL AND nombre_sejours_partiels_obstetrique IS NULL AND nombre_sejours_partiels_chirurgie IS NULL AND nombre_sejours_complets_medecine IS NULL AND nombre_sejours_complets_obstetrique IS NULL AND nombre_sejours_complets_chirurgie IS NULL)";
    const nullConditionPsy = " AND NOT (nombre_journees_complete_psy IS NULL AND nombre_journées_partielles_psy IS NULL)";
    const nullConditionSsr = " AND NOT (nombre_journees_completes_ssr IS NULL AND nombre_journees_partiels_ssr IS NULL)";
    activiteSan.forEach((activite) => {
      switch (activite.classification) {
        case "mco":
          conditions.push(this.construisConditionActiviteSan(
            'activite_san.activite_mco',
            activite.ranges,
            parameters,
            nullConditionMco
          ).conditions);
          break;
        case "psy":
          conditions.push(this.construisConditionActiviteSan(
            'activite_san.activite_psy',
            activite.ranges,
            parameters,
            nullConditionPsy
          ).conditions);
          break;
        case "ssr":
          conditions.push(this.construisConditionActiviteSan(
            'activite_san.activite_ssr',
            activite.ranges,
            parameters,
            nullConditionSsr
          ).conditions);
          break;
        default:
          conditions.push(this.construisConditionActiviteSan(
            'activite_san.activite_usld',
            activite.ranges,
            parameters,
            ''
          ).conditions);
      }
    });

    let activitesSanConditions = "";
    if (conditions.length > 1) {
      activitesSanConditions = `(${conditions.join(" OR ")})`;
    } else if (conditions.length === 1) {
      activitesSanConditions = conditions[0];
    }
    return { activitesSanConditions: activitesSanConditions };
  }

  private construisConditionActiviteSan(classification: string, ranges: string[], parameters: { [key: string]: any }, nullCondition: string): any {
    const conditions: string[] = [];
    let activiteSanConditions = "";
    ranges.forEach((range, index) => {
      if (range.includes(">")) {
        conditions.push(`${classification} > :range${classification}${index}`);
        parameters[`range${classification}${index}`] = range.substring(1);
      } else {
        const limits = range.split(",");
        conditions.push(
          `${classification} BETWEEN :min${classification}${index} AND :max${classification}${index}`
        );
        parameters[`min${classification}${index}`] = limits[0];
        parameters[`max${classification}${index}`] = limits[1];
      }
    });
    if (ranges.length === 1) activiteSanConditions = conditions[0] + nullCondition;
    else {
      activiteSanConditions = "(" + conditions.join(" OR ") + nullCondition + ")";
    }
    return { conditions: activiteSanConditions, parameters };
  }

  private ajouteFiltreCategories(categories: string[], conditions: string[], parameters: any) {
    conditions.push("recherche.categorie IN (:...categories)");
    return { ...parameters, categories: categories };
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
      conditions.push(`etablissementMS.cat_etablissement IN (:...listCapaciteHandicape)`);
      parameters[`listCapaciteHandicape`] = listCapaciteHandicape;
    } else if (capacite.classification === "personnes_agees") {
      conditions.push(`etablissementMS.cat_etablissement IN (:...listCapaciteAgee)`);
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
