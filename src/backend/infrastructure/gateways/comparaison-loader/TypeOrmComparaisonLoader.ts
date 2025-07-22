import { DataSource } from "typeorm";

import { DateMiseÀJourFichierSourceModel, FichierSource } from "../../../../../database/models/DateMiseÀJourFichierSourceModel";
import { ProfilModel } from "../../../../../database/models/ProfilModel";
import { ParametresDeComparaison } from "../../../métier/entities/ParametresDeComparaison";
import { DatesMisAjourSources, ResultatDeComparaison, ResultatEJ, ResultatSAN, ResultatSMS } from "../../../métier/entities/ResultatDeComparaison";
import { ComparaisonLoader } from "../../../métier/gateways/ComparaisonLoader";
import { combineProfils } from "../../../profileFiltersHelper";

type ComparaisonSMSTypeOrm = Readonly<{
  numero_finess: string;
  raison_sociale_courte: string;
  type: string;
  commune: string;
  departement: string;
  taux_realisation_activite: number | 'NA';
  file_active_personnes_accompagnees: number | 'NA';
  taux_occupation_en_hebergement_permanent: number | 'NA';
  taux_occupation_en_hebergement_temporaire: number | 'NA';
  taux_occupation_accueil_de_jour: number | 'NA';
  taux_de_caf: number | 'NA';
  taux_de_vetuste_construction: number | 'NA';
  fonds_de_roulement: number | 'NA';
  resultat_net_comptable: number | 'NA';
  taux_prestation_externes: number | 'NA';
  taux_rotation_personnel: number | 'NA';
  taux_etp_vacants: number | 'NA';
  taux_absenteisme_hors_formation: number | 'NA';
  capacite_total: number | 'NA';
}>;

type ComparaisonEJTypeOrm = Readonly<{
  numero_finess: string;
  raison_sociale_courte: string;
  type: string;
  commune: string;
  departement: string;
  statut_juridique: string;
  rattachement: string;
  resultat_net_comptable_san: number;
  taux_de_caf_nette_san: number;
  ratio_dependance_financiere: number;
  total_depenses_global: number;
  total_recettes_global: number;
  total_depenses_principales: number;
  total_recettes_principales: number;
  enveloppe_1: number;
  enveloppe_2: number;
  enveloppe_3: number;
}>;

type ComparaisonSANTypeOrm = Readonly<{
  numero_finess: string;
  raison_sociale_courte: string;
  type: string;
  commune: string;
  departement: string;
  total_hospt_medecine: number;
  total_hospt_obstetrique: number;
  total_hospt_chirurgie: number;
  total_hospt_ssr: number;
  total_hospt_psy: number;
  nombre_passages_urgences: number;
  nombre_sejours_had: number;
  nombre_journees_usld: number;
  enveloppe_1: number;
  enveloppe_2: number;
  enveloppe_3: number;
}>;

type EnveloppesResult = {
  [annee: number]: string[];
};

export class TypeOrmComparaisonLoader implements ComparaisonLoader {
  constructor(private readonly orm: Promise<DataSource>) { }
  private readonly NOMBRE_DE_RÉSULTATS_MAX_PAR_PAGE = 20;

  async listeAnnees(type: string, numerosFiness: string[]): Promise<string[]> {
    if (type === "Entité juridique") {
      const generateAnnees = `SELECT generate_series(
          CASE 
          WHEN maxannee = extract(year FROM current_date) THEN (maxannee - 4)::int
          ELSE (extract(year FROM current_date) - 5)::int
      END,
      CASE
          WHEN maxannee = extract(year FROM current_date) THEN maxannee::int
          ELSE (extract(year FROM current_date) - 1)::int
      END
      ) annee
				FROM (
					SELECT max(annee) maxannee FROM (
					Select annee from activite_medico_social ac where ac.numero_finess_etablissement_territorial in  (${numerosFiness.map((finess) => "'" + finess + "'")})
					UNION
					Select annee from ressources_humaines_medico_social rh where rh.numero_finess_etablissement_territorial in  (${numerosFiness.map((finess) => "'" + finess + "'")})
					UNION
					Select annee from budget_et_finances_medico_social budget where budget.numero_finess_etablissement_territorial in  (${numerosFiness.map((finess) => "'" + finess + "'")})
					  ) anc ) ang
            `;
      const generateAnneesResult = await (await this.orm).query(generateAnnees);
      return generateAnneesResult.map((item: any) => item.annee);
    } else if (type === "Médico-social") {
      const generateAnnees = `SELECT generate_series(
          CASE 
          WHEN maxannee = extract(year FROM current_date) THEN (maxannee - 4)::int
          ELSE (extract(year FROM current_date) - 5)::int
      END,
      CASE
          WHEN maxannee = extract(year FROM current_date) THEN maxannee::int
          ELSE (extract(year FROM current_date) - 1)::int
      END
      ) annee
				FROM (
					SELECT max(annee) maxannee FROM (
					Select annee from budget_et_finances_entite_juridique bg where bg.numero_finess_entite_juridique in  (${numerosFiness.map((finess) => "'" + finess + "'")})
			) anc ) ang`;
      const generateAnneesResult = await (await this.orm).query(generateAnnees);
      return generateAnneesResult.map((item: any) => item.annee);
    } else {
      const generateAnnees = `SELECT generate_series(
          CASE 
          WHEN maxannee = extract(year FROM current_date) THEN (maxannee - 4)::int
          ELSE (extract(year FROM current_date) - 5)::int
      END,
      CASE
          WHEN maxannee = extract(year FROM current_date) THEN maxannee::int
          ELSE (extract(year FROM current_date) - 1)::int
      END
      ) annee
				FROM (
					SELECT max(annee) maxannee FROM (
					Select annee from activite_sanitaire bg where bg.numero_finess_etablissement_territorial in  (${numerosFiness.map((finess) => "'" + finess + "'")})
			) anc ) ang`;
      const generateAnneesResult = await (await this.orm).query(generateAnnees);
      return generateAnneesResult.map((item: any) => item.annee);
    }

  }

  async getTopEnveloppes(): Promise<EnveloppesResult> {
    const query = `SELECT y.annee, c.enveloppe, c.total_value
                    FROM 
                        (SELECT DISTINCT annee FROM allocation_ressource_ej) y
                    CROSS JOIN LATERAL (
                        SELECT 
                            t.enveloppe,
                            SUM(t.montant) AS total_value
                        FROM allocation_ressource_ej t
                        WHERE t.annee = y.annee
                        GROUP BY t.enveloppe
                        ORDER BY total_value DESC
                        LIMIT 3
                    ) c
                    ORDER BY y.annee, c.total_value DESC`;
    const queryResult = await (await this.orm).query(query);
    const result: EnveloppesResult = {};

    queryResult.forEach((item: any) => {
      if (!result[item.annee]) {
        result[item.annee] = [];
      }
      if (!result[item.annee].includes(item.enveloppe)) {
        result[item.annee].push(item.enveloppe);
      }
    });
    return result;
  }

  async getDatesMisAJourSourcesComparaison(): Promise<DatesMisAjourSources> {
    const dateMAJFiness = await this.chargeLaDateDeMiseÀJourModel(FichierSource.FINESS_CS1400105);

    const dateMAJTdbperf = await this.chargeLaDateDeMiseÀJourModel(FichierSource.DIAMANT_ANN_MS_TDP_ET);

    const dateMAJCnsa = await this.chargeLaDateDeMiseÀJourModel(FichierSource.DIAMANT_ANN_ERRD_EJ);

    const dateMAJAncre = await this.chargeLaDateDeMiseÀJourModel(FichierSource.DIAMANT_QUO_SAN_FINANCE);

    const dateMAJHapi = await this.chargeLaDateDeMiseÀJourModel(FichierSource.DIAMANT_MEN_HAPI);

    return {
      date_mis_a_jour_finess: dateMAJFiness.dernièreMiseÀJour || "",
      date_mis_a_jour_tdbPerf: dateMAJTdbperf.dernièreMiseÀJour || "",
      date_mis_a_jour_cnsa: dateMAJCnsa.dernièreMiseÀJour || "",
      date_mis_a_jour_ancre: dateMAJAncre.dernièreMiseÀJour || "",
      date_mis_a_jour_hapi: dateMAJHapi.dernièreMiseÀJour || "",
    }
  }

  async compare(params: ParametresDeComparaison, profiles: ProfilModel[]): Promise<ResultatDeComparaison> {
    const { type } = params;
    if (type === "Entité juridique") {
      return await this.compareEJ(params);
    } else if (type === "Médico-social") {
      const profilesAutreRegValues = profiles.map((profile) => profile?.value.autreRegion.profilMédicoSocial)
      const autorisations = combineProfils(profilesAutreRegValues);
      return await this.compareSMS(params, autorisations);
    } else {
      return await this.compareSAN(params);
    }
  }

  private async compareEJ(params: ParametresDeComparaison): Promise<ResultatDeComparaison> {
    const { numerosFiness, annee, page, order, orderBy, forExport, enveloppe1, enveloppe2, enveloppe3 } = params;
    const compareEnveloppe1 = `(select SUM(public.allocation_ressource_ej.montant) as enveloppe_1,
        allocation_ressource_ej.numero_finess_entite_juridique
        FROM allocation_ressource_ej
        where annee = ${annee} and enveloppe = '${enveloppe1}'
        GROUP BY allocation_ressource_ej.numero_finess_entite_juridique) ar1`;

    const compareEnveloppe2 = `(select SUM(public.allocation_ressource_ej.montant) as enveloppe_2,
        allocation_ressource_ej.numero_finess_entite_juridique
        FROM allocation_ressource_ej
        where annee = ${annee} and enveloppe = '${enveloppe2}'
        GROUP BY allocation_ressource_ej.numero_finess_entite_juridique) ar2`;

    const compareEnveloppe3 = `(select SUM(public.allocation_ressource_ej.montant) as enveloppe_3,
        allocation_ressource_ej.numero_finess_entite_juridique
        FROM allocation_ressource_ej
        where annee = ${annee} and enveloppe = '${enveloppe3}'
        GROUP BY allocation_ressource_ej.numero_finess_entite_juridique) ar3`;

    const compareEjQueryBody = ` from recherche ej
    LEFT JOIN budget_et_finances_entite_juridique bg
    on ej.numero_finess = bg.numero_finess_entite_juridique and bg.annee = ${annee}
    LEFT JOIN etablissement_territorial et 
    on ej.numero_finess = et.numero_finess_entite_juridique
    LEFT JOIN ${compareEnveloppe1} on ej.numero_finess  = ar1.numero_finess_entite_juridique
    LEFT JOIN ${compareEnveloppe2} on ej.numero_finess  = ar2.numero_finess_entite_juridique
    LEFT JOIN ${compareEnveloppe3} on ej.numero_finess  = ar3.numero_finess_entite_juridique
    where ej.numero_finess IN(${numerosFiness.map((finess) => "'" + finess + "'")})
    group by ej.numero_finess, ej.raison_sociale_courte,
    ej.commune,
    ej.departement,
    ej.code_region,
    ej.type,
    ej.statut_juridique,
    bg.depenses_titre_i_global,
    bg.depenses_titre_ii_global,
    bg.depenses_titre_iii_global,
    bg.depenses_titre_iv_global,
    bg.recettes_titre_i_global, 
    bg.recettes_titre_ii_global, 
    bg.recettes_titre_iii_global, 
    bg.recettes_titre_iv_global,
    bg.depenses_titre_i_h,
    bg.depenses_titre_i_h,
    bg.depenses_titre_ii_h,
    bg.depenses_titre_iii_h,
    bg.depenses_titre_iv_h,
    bg.recettes_titre_i_h,
    bg.recettes_titre_ii_h,
    bg.recettes_titre_iii_h,
    bg.resultat_net_comptable_san,
    bg.taux_de_caf_nette_san,
    bg.ratio_dependance_financiere,
    ar1.enveloppe_1,
    ar2.enveloppe_2,
    ar3.enveloppe_3`

    const compareEjQuery = `SELECT *
    FROM ( Select ej.numero_finess,
    ej.raison_sociale_courte,
    ej.commune,
    ej.departement,
    ej.code_region,
    ej.type,
    ej.statut_juridique,
    CONCAT(
            'Sanitaire (', 
            COUNT(CASE WHEN et.domaine = 'Sanitaire' THEN et.numero_finess_entite_juridique END),
            '), SMS (',
            COUNT(CASE WHEN et.domaine = 'Médico-social' THEN et.numero_finess_entite_juridique END), ')'
          ) AS rattachement,
    bg.resultat_net_comptable_san,
    bg.taux_de_caf_nette_san,
    enveloppe_1,
    enveloppe_2,
    enveloppe_3,
    CASE
        WHEN bg.depenses_titre_i_global IS NULL AND bg.depenses_titre_ii_global IS NULL AND bg.depenses_titre_iii_global IS NULL AND bg.depenses_titre_iv_global IS NULL THEN NULL
        ELSE COALESCE(bg.depenses_titre_i_global, 0)  + COALESCE(bg.depenses_titre_ii_global, 0) + COALESCE(bg.depenses_titre_iii_global, 0) + COALESCE(bg.depenses_titre_iv_global, 0)
    END AS total_depenses_global,
     CASE
        WHEN bg.recettes_titre_i_global IS NULL AND bg.recettes_titre_ii_global IS NULL AND bg.recettes_titre_iii_global IS NULL AND bg.recettes_titre_iv_global IS NULL THEN NULL
        ELSE COALESCE(bg.recettes_titre_i_global, 0)  + COALESCE(bg.recettes_titre_ii_global, 0) + COALESCE(bg.recettes_titre_iii_global, 0) + COALESCE(bg.recettes_titre_iv_global, 0) 
    END AS total_recettes_global, 
     CASE
        WHEN bg.depenses_titre_i_h IS NULL AND bg.depenses_titre_ii_h IS NULL AND bg.depenses_titre_iii_h IS NULL AND bg.depenses_titre_iv_h IS NULL THEN NULL
        ELSE COALESCE(bg.depenses_titre_i_h, 0)  + COALESCE(bg.depenses_titre_ii_h, 0) + COALESCE(bg.depenses_titre_iii_h, 0) + COALESCE(bg.depenses_titre_iv_h, 0) 
    END AS total_depenses_principales,
     CASE
        WHEN bg.recettes_titre_i_h IS NULL AND bg.recettes_titre_ii_h IS NULL AND bg.recettes_titre_iii_h IS NULL THEN NULL
        ELSE COALESCE(bg.recettes_titre_i_h, 0)  + COALESCE(bg.recettes_titre_ii_h, 0) + COALESCE(bg.recettes_titre_iii_h, 0)
    END AS total_recettes_principales,
    bg.ratio_dependance_financiere ${compareEjQueryBody} ) as subquery`;

    const limitForExport = forExport ? "" : `LIMIT ${this.NOMBRE_DE_RÉSULTATS_MAX_PAR_PAGE} OFFSET ${this.NOMBRE_DE_RÉSULTATS_MAX_PAR_PAGE * (page - 1)}`;
    const paginatedCompareEJQuery =
      order && orderBy
        ? compareEjQuery +
        ` ORDER BY ${orderBy} ${order} ${limitForExport} `
        : compareEjQuery +
        ` ORDER BY
          CASE type
            WHEN 'Entité juridique' THEN 1
            WHEN 'Médico-social' THEN 2
            WHEN 'Sanitaire' THEN 3
            ELSE 4
  END, numero_finess ASC  ${limitForExport} `;

    const compareEJQueryResult = await (await this.orm).query(paginatedCompareEJQuery);
    return {
      nombreDeResultats: numerosFiness.length,
      resultat: this.contruitResultatEJ(compareEJQueryResult),
    };
  }

  private async chargeLaDateDeMiseÀJourModel(source: FichierSource): Promise<DateMiseÀJourFichierSourceModel> {
    return (await (await this.orm).getRepository(DateMiseÀJourFichierSourceModel).findOneBy({ fichier: source })) as DateMiseÀJourFichierSourceModel;
  }

  private async compareSMS(params: ParametresDeComparaison, autorisations: any): Promise<ResultatDeComparaison> {
    const { numerosFiness, annee, page, order, orderBy, forExport, codeRegion } = params;

    const compareSMSCapacite = `(select SUM(public.autorisation_medico_social.capacite_installee_totale) as capacite_total,
        autorisation_medico_social.numero_finess_etablissement_territorial
        FROM autorisation_medico_social
        GROUP BY autorisation_medico_social.numero_finess_etablissement_territorial) cp`;

    const compareSMSQueryBody = ` from recherche et 
    LEFT JOIN activite_medico_social ac
    on et.numero_finess = ac.numero_finess_etablissement_territorial and ac.annee = ${annee}
    LEFT JOIN budget_et_finances_medico_social bg
    on et.numero_finess = bg.numero_finess_etablissement_territorial and bg.annee = ${annee}
    LEFT JOIN ressources_humaines_medico_social rh
    on et.numero_finess = rh.numero_finess_etablissement_territorial and rh.annee = ${annee}
    LEFT JOIN ${compareSMSCapacite}
    on et.numero_finess = cp.numero_finess_etablissement_territorial
    where et.numero_finess IN(${numerosFiness.map((finess) => "'" + finess + "'")})`;

    const compareSMSQuery = `Select et.numero_finess,
    et.raison_sociale_courte,
    et.commune,
    et.departement,
    et.code_region,
    et.type,
    CASE
          WHEN et.code_region = CAST(${codeRegion} AS TEXT) OR $1 = 'ok' THEN CAST(ac.file_active_personnes_accompagnees AS TEXT)
    ELSE 'NA'
    END AS file_active_personnes_accompagnees,
    CASE
          WHEN et.code_region = CAST(${codeRegion} AS TEXT) OR $2 = 'ok' THEN CAST(ac.taux_realisation_activite AS TEXT)
    ELSE 'NA'
    END AS taux_realisation_activite,
    CASE
          WHEN et.code_region = CAST(${codeRegion} AS TEXT) OR $3 = 'ok' THEN CAST(ac.taux_occupation_en_hebergement_permanent AS TEXT)
    ELSE 'NA'
    END AS taux_occupation_en_hebergement_permanent,
    CASE
          WHEN et.code_region = CAST(${codeRegion} AS TEXT) OR $4 = 'ok' THEN CAST(ac.taux_occupation_en_hebergement_temporaire AS TEXT)
    ELSE 'NA'
    END AS taux_occupation_en_hebergement_temporaire,
    CASE
          WHEN et.code_region = CAST(${codeRegion} AS TEXT) OR $5 = 'ok' THEN CAST(ac.taux_occupation_accueil_de_jour AS TEXT)
    ELSE 'NA'
    END AS taux_occupation_accueil_de_jour,
    CASE
          WHEN et.code_region = CAST(${codeRegion} AS TEXT) OR $6 = 'ok' THEN CAST(bg.taux_de_caf AS TEXT)
    ELSE 'NA'
    END AS taux_de_caf,
    CASE
          WHEN et.code_region = CAST(${codeRegion} AS TEXT) OR $7 = 'ok' THEN CAST(bg.taux_de_vetuste_construction AS TEXT)
    ELSE 'NA'
    END AS taux_de_vetuste_construction,
    CASE
          WHEN et.code_region = CAST(${codeRegion} AS TEXT) OR $8 = 'ok' THEN CAST(bg.fonds_de_roulement AS TEXT)
    ELSE 'NA'
    END AS fonds_de_roulement,
    CASE
         WHEN et.code_region = CAST(${codeRegion} AS TEXT) OR $9 = 'ok' THEN CAST(bg.resultat_net_comptable AS TEXT)
    ELSE 'NA'
    END AS resultat_net_comptable,
    CASE
          WHEN et.code_region = CAST(${codeRegion} AS TEXT) OR $10 = 'ok' THEN CAST(rh.taux_prestation_externes AS TEXT)
    ELSE 'NA'
    END AS taux_prestation_externes,
    CASE
    WHEN et.code_region = CAST(${codeRegion} AS TEXT) OR $11 = 'ok' THEN CAST(rh.taux_etp_vacants AS TEXT)
    ELSE 'NA'
    END AS taux_etp_vacants,
    CASE
    WHEN et.code_region = CAST(${codeRegion} AS TEXT) OR $12 = 'ok' THEN CAST(rh.taux_rotation_personnel AS TEXT)
    ELSE 'NA'
    END AS taux_rotation_personnel,
    CASE
    WHEN et.code_region = CAST(${codeRegion} AS TEXT) OR $13 = 'ok' THEN CAST(rh.taux_absenteisme_hors_formation AS TEXT)
    ELSE 'NA'
    END AS taux_absenteisme_hors_formation,
    CASE
    WHEN et.code_region = CAST(${codeRegion} AS TEXT) OR $14 = 'ok' THEN CAST(cp.capacite_total AS TEXT)
    ELSE 'NA'
    END AS capacite_total` + compareSMSQueryBody;

    const limitForExport = forExport ? "" : `LIMIT ${this.NOMBRE_DE_RÉSULTATS_MAX_PAR_PAGE} OFFSET ${this.NOMBRE_DE_RÉSULTATS_MAX_PAR_PAGE * (page - 1)}`;
    const paginatedCompareSMSQuery =
      order && orderBy
        ? compareSMSQuery +
        ` ORDER BY ${orderBy} ${order} ${limitForExport} `
        : compareSMSQuery +
        ` ORDER BY
          CASE type
            WHEN 'Médico-social' THEN 1
            WHEN 'Entité juridique' THEN 2
            WHEN 'Sanitaire' THEN 3
            ELSE 4
  END, numero_finess ASC  ${limitForExport} `;

    const compareSMSQueryResult = await (await this.orm).query(paginatedCompareSMSQuery,
      [autorisations.activités.fileActivePersonnesAccompagnées,
      autorisations.activités.tauxRéalisationActivité,
      autorisations.activités.tauxOccupationHébergementPermanent,
      autorisations.activités.tauxOccupationHébergementTemporaire,
      autorisations.activités.tauxOccupationAccueilDeJour,
      autorisations.budgetEtFinances.tauxDeCafNette,
      autorisations.budgetEtFinances.tauxDeVétustéConstruction,
      autorisations.budgetEtFinances.fondsDeRoulement,
      autorisations.budgetEtFinances.résultatNetComptable,
      autorisations.ressourcesHumaines.tauxDePrestationsExternes,
      autorisations.ressourcesHumaines.nombreDEtpRéalisés,
      autorisations.ressourcesHumaines.tauxDeRotationDuPersonnel,
      autorisations.ressourcesHumaines.tauxDAbsentéisme,
      autorisations.autorisationsEtCapacités.capacités
      ]
    );

    return {
      nombreDeResultats: numerosFiness.length,
      resultat: this.contruitResultatSMS(compareSMSQueryResult),
    };
  }

  private async compareSAN(params: ParametresDeComparaison): Promise<ResultatDeComparaison> {
    const { numerosFiness, annee, page, order, orderBy, forExport, enveloppe1, enveloppe2, enveloppe3 } = params;
    const compareEnveloppe1 = `(select SUM(public.allocation_ressource_et.montant) as enveloppe_1,
        allocation_ressource_et.numero_finess_etablissement_territorial
        FROM allocation_ressource_et
        where annee = ${annee} and enveloppe = '${enveloppe1}'
        GROUP BY allocation_ressource_et.numero_finess_etablissement_territorial) ar1`;

    const compareEnveloppe2 = `(select SUM(public.allocation_ressource_et.montant) as enveloppe_2,
        allocation_ressource_et.numero_finess_etablissement_territorial
        FROM allocation_ressource_et
        where annee = ${annee} and enveloppe = '${enveloppe2}'
        GROUP BY allocation_ressource_et.numero_finess_etablissement_territorial) ar2`;

    const compareEnveloppe3 = `(select SUM(public.allocation_ressource_et.montant) as enveloppe_3,
        allocation_ressource_et.numero_finess_etablissement_territorial
        FROM allocation_ressource_et
        where annee = ${annee} and enveloppe = '${enveloppe3}'
        GROUP BY allocation_ressource_et.numero_finess_etablissement_territorial) ar3`;

    const compareEtSanQueryBody = ` from recherche et
    LEFT JOIN activite_sanitaire acs
    on et.numero_finess = acs.numero_finess_etablissement_territorial and acs.annee = ${annee}
    LEFT JOIN ${compareEnveloppe1} on et.numero_finess  = ar1.numero_finess_etablissement_territorial
    LEFT JOIN ${compareEnveloppe2} on et.numero_finess  = ar2.numero_finess_etablissement_territorial
    LEFT JOIN ${compareEnveloppe3} on et.numero_finess  = ar3.numero_finess_etablissement_territorial
    `
    const compareEtSanQuery = `Select et.numero_finess,
    et.raison_sociale_courte,
    et.commune,
    et.departement,
    et.code_region,
    et.type,
    CASE
        WHEN acs.nombre_sejours_partiels_medecine IS NULL AND acs.nombre_sejours_complets_medecine IS NULL THEN NULL
        ELSE COALESCE(acs.nombre_sejours_partiels_medecine , 0)  + COALESCE(acs.nombre_sejours_complets_medecine , 0)
    END AS total_hospt_medecine,
    CASE
        WHEN acs.nombre_sejours_partiels_obstetrique IS NULL AND acs.nombre_sejours_complets_obstetrique IS NULL THEN NULL
        ELSE COALESCE(acs.nombre_sejours_partiels_obstetrique , 0)  + COALESCE(acs.nombre_sejours_complets_obstetrique , 0)
    END AS total_hospt_obstetrique,
    CASE
        WHEN acs.nombre_sejours_partiels_chirurgie IS NULL AND acs.nombre_sejours_complets_chirurgie IS NULL THEN NULL
        ELSE COALESCE(acs.nombre_sejours_partiels_chirurgie , 0)  + COALESCE(acs.nombre_sejours_complets_chirurgie , 0)
    END AS total_hospt_chirurgie,
    CASE
        WHEN acs.nombre_journees_completes_ssr IS NULL AND acs.nombre_journees_partiels_ssr IS NULL THEN NULL
        ELSE COALESCE(acs.nombre_journees_completes_ssr , 0)  + COALESCE(acs.nombre_journees_partiels_ssr , 0)
    END AS total_hospt_ssr,
     CASE
        WHEN acs.nombre_journees_complete_psy IS NULL AND acs.nombre_journees_complete_psy IS NULL THEN NULL
        ELSE COALESCE(acs.nombre_journees_complete_psy , 0)  + COALESCE(acs.nombre_journees_complete_psy , 0)
    END AS total_hospt_psy,
    acs.nombre_passages_urgences,
    acs.nombre_sejours_had,
    acs.nombre_journees_usld,
    enveloppe_1,
    enveloppe_2,
    enveloppe_3 ${compareEtSanQueryBody}`;

    const limitForExport = forExport ? "" : `LIMIT ${this.NOMBRE_DE_RÉSULTATS_MAX_PAR_PAGE} OFFSET ${this.NOMBRE_DE_RÉSULTATS_MAX_PAR_PAGE * (page - 1)}`;
    const paginatedCompareETSanQuery =
      order && orderBy
        ? compareEtSanQuery +
        ` ORDER BY ${orderBy} ${order} ${limitForExport} `
        : compareEtSanQuery +
        ` ORDER BY
          CASE type
            WHEN 'Sanitaire' THEN 1
            WHEN 'Médico-social' THEN 2
            WHEN 'Entité juridique' THEN 3 
            ELSE 4
          END, numero_finess ASC  ${limitForExport} `;

    const compareEtSanQueryResult = await (await this.orm).query(paginatedCompareETSanQuery);
    return {
      nombreDeResultats: numerosFiness.length,
      resultat: this.contruitResultatEtSan(compareEtSanQueryResult)
    };
  }


  private makeNumberArrondi(value: any, num: number): number | null {
    // Convert value to a number and check if it's a valid number
    const numericValue = value !== null ? Number(value) : null;

    if (numericValue !== null && !isNaN(numericValue)) {
      // If numericValue is a valid number, return the rounded number
      if (num === 0) return Math.round(numericValue)
      return Math.round(numericValue * (10 * num)) / (10 * num)
    } else {
      // If it's not a valid number, return null
      return null;
    }
  }

  private transformInRate(number: number, chiffre: number): number | null {
    return number !== null ? this.makeNumberArrondi(number * 100, chiffre) : number;
  }

  private roundExpression(value1: any, value2: any, num: number): number | null {
    const numericValue1 = value1 !== null ? Number(value1) : null;
    const numericValue2 = value2 !== null ? Number(value2) : null;
    if (numericValue1 !== null && !isNaN(numericValue1) && numericValue2 !== null && !isNaN(numericValue2)) {
      // If numericValue is a valid number, return the rounded number
      if (num === 0) return Math.round(numericValue1) - Math.round(numericValue2)
      return (Math.round(numericValue1 * (10 * num)) / (10 * num)) - (Math.round(numericValue2 * (10 * num)) / (10 * num))
    } else {
      // If it's not a valid number, return null
      return null;
    }
  }

  private contruitResultatSMS(resultats: ComparaisonSMSTypeOrm[]): ResultatSMS[] {
    return resultats.map((resultat: ComparaisonSMSTypeOrm): ResultatSMS => {
      return {
        numéroFiness: resultat.numero_finess,
        socialReason: resultat.raison_sociale_courte,
        type: resultat.type,
        commune: resultat.commune,
        departement: resultat.departement,
        capacite: resultat.type !== "Médico-social" ? '' : resultat.capacite_total ? Number(resultat.capacite_total) : null,
        realisationActivite: resultat.type !== "Médico-social" ? '' : resultat.taux_realisation_activite === 'NA' ? 'NA' : this.transformInRate(resultat.taux_realisation_activite, 1),
        acceuilDeJour: resultat.type !== "Médico-social" ? '' : resultat.taux_occupation_accueil_de_jour === 'NA' ? 'NA' : this.transformInRate(resultat.taux_occupation_accueil_de_jour, 1),
        hebergementPermanent: resultat.type !== "Médico-social" ? '' : resultat.taux_occupation_en_hebergement_permanent === 'NA' ? 'NA' : this.transformInRate(resultat.taux_occupation_en_hebergement_permanent, 1),
        hebergementTemporaire: resultat.type !== "Médico-social" ? '' : resultat.taux_occupation_en_hebergement_temporaire === 'NA' ? 'NA' : this.transformInRate(resultat.taux_occupation_en_hebergement_temporaire, 1),
        fileActivePersonnesAccompagnes: resultat.type !== "Médico-social" ? '' : resultat.file_active_personnes_accompagnees ? Number(resultat.file_active_personnes_accompagnees) : null,
        rotationPersonnel: resultat.type !== "Médico-social" ? '' : resultat.taux_rotation_personnel === 'NA' ? 'NA' : this.transformInRate(resultat.taux_rotation_personnel, 1),
        absenteisme: resultat.type !== "Médico-social" ? '' : resultat.taux_absenteisme_hors_formation === 'NA' ? 'NA' : this.transformInRate(resultat.taux_absenteisme_hors_formation, 1),
        prestationExterne: resultat.type !== "Médico-social" ? '' : resultat.taux_prestation_externes === 'NA' ? 'NA' : this.transformInRate(resultat.taux_prestation_externes, 1),
        etpVacant: resultat.type !== "Médico-social" ? '' : resultat.taux_etp_vacants === 'NA' ? 'NA' : this.transformInRate(resultat.taux_etp_vacants, 1),
        tauxCaf: resultat.type !== "Médico-social" ? '' : resultat.taux_de_caf === 'NA' ? 'NA' : this.transformInRate(resultat.taux_de_caf, 1),
        vetusteConstruction: resultat.type !== "Médico-social" ? '' : resultat.taux_de_vetuste_construction === 'NA' ? 'NA' : this.transformInRate(resultat.taux_de_vetuste_construction, 1),
        roulementNetGlobal: resultat.type !== "Médico-social" ? '' : resultat.fonds_de_roulement === 'NA' ? 'NA' : this.makeNumberArrondi(resultat.fonds_de_roulement, 0),
        resultatNetComptable: resultat.type !== "Médico-social" ? '' : resultat.resultat_net_comptable === 'NA' ? 'NA' : this.makeNumberArrondi(resultat.resultat_net_comptable, 0),
      };
    });
  }

  private contruitResultatEJ(resultats: ComparaisonEJTypeOrm[]): ResultatEJ[] {
    return resultats.map((resultat: ComparaisonEJTypeOrm): ResultatEJ => {
      return {
        numéroFiness: resultat.numero_finess,
        socialReason: resultat.raison_sociale_courte,
        type: resultat.type,
        commune: resultat.commune,
        departement: resultat.departement,
        statutJuridique: resultat.type === "Entité juridique" ? resultat.statut_juridique : '',
        rattachements: resultat.type === "Entité juridique" ? resultat.rattachement : '',
        chargesPrincipaux: resultat.type === "Entité juridique" ? this.makeNumberArrondi(resultat.total_depenses_principales, 0) : '',
        chargesAnnexes: resultat.type === "Entité juridique" ? this.roundExpression(resultat.total_depenses_global, resultat.total_depenses_principales, 0) : '',
        produitsPrincipaux: resultat.type === "Entité juridique" ? this.makeNumberArrondi(resultat.total_recettes_principales, 0) : '',
        produitsAnnexes: resultat.type === "Entité juridique" ? this.roundExpression(resultat.total_recettes_global, resultat.total_recettes_principales, 0) : '',
        resultatNetComptableEj: resultat.type === "Entité juridique" ? resultat.resultat_net_comptable_san : '',
        tauxCafEj: resultat.type === "Entité juridique" ? resultat.taux_de_caf_nette_san : '',
        ratioDependanceFinanciere: resultat.type === "Entité juridique" ? resultat.ratio_dependance_financiere : '',
        enveloppe1: resultat.type === "Entité juridique" ? resultat.enveloppe_1 : '',
        enveloppe2: resultat.type === "Entité juridique" ? resultat.enveloppe_2 : '',
        enveloppe3: resultat.type === "Entité juridique" ? resultat.enveloppe_3 : '',
      };
    });
  }

  private contruitResultatEtSan(resultats: ComparaisonSANTypeOrm[]): ResultatSAN[] {
    return resultats.map((resultat: ComparaisonSANTypeOrm): ResultatSAN => {
      return {
        numéroFiness: resultat.numero_finess,
        socialReason: resultat.raison_sociale_courte,
        type: resultat.type,
        commune: resultat.commune,
        departement: resultat.departement,
        totalHosptMedecine: resultat.type === "Sanitaire" ? resultat.total_hospt_medecine : '',
        totalHosptObstetrique: resultat.type === "Sanitaire" ? resultat.total_hospt_obstetrique : '',
        totalHosptChirurgie: resultat.type === "Sanitaire" ? resultat.total_hospt_chirurgie : '',
        totalHosptSsr: resultat.type === "Sanitaire" ? resultat.total_hospt_ssr : '',
        totalHosptPsy: resultat.type === "Sanitaire" ? resultat.total_hospt_psy : '',
        passagesUrgences: resultat.type === "Sanitaire" ? resultat.nombre_passages_urgences : '',
        sejoursHad: resultat.type === "Sanitaire" ? resultat.nombre_sejours_had : '',
        journeesUsld: resultat.type === "Sanitaire" ? resultat.nombre_journees_usld : '',
        enveloppe1: resultat.type === "Sanitaire" ? resultat.enveloppe_1 : '',
        enveloppe2: resultat.type === "Sanitaire" ? resultat.enveloppe_2 : '',
        enveloppe3: resultat.type === "Sanitaire" ? resultat.enveloppe_3 : ''
      };
    });
  }
}
