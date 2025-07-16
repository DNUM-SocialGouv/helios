import { DataSource } from "typeorm";

import { DateMiseÀJourFichierSourceModel, FichierSource } from "../../../../../database/models/DateMiseÀJourFichierSourceModel";
import { ProfilModel } from "../../../../../database/models/ProfilModel";
import { ParametresDeComparaison } from "../../../métier/entities/ParametresDeComparaison";
import { DatesMisAjourSources, ResultatDeComparaison, ResultatEJ, ResultatSMS } from "../../../métier/entities/ResultatDeComparaison";
import { ComparaisonLoader } from "../../../métier/gateways/ComparaisonLoader";
import { combineProfils } from "../../../profileFiltersHelper";

type ComparaisonSMSTypeOrm = Readonly<{
  numero_finess_etablissement_territorial: string;
  raison_sociale_courte: string;
  domaine: string;
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
}>;

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
      return [];
    }

  }

  async getDatesMisAJourSourcesComparaison(): Promise<DatesMisAjourSources> {
    const dateMAJFiness = await this.chargeLaDateDeMiseÀJourModel(FichierSource.FINESS_CS1400105);

    const dateMAJTdbperf = await this.chargeLaDateDeMiseÀJourModel(FichierSource.DIAMANT_ANN_MS_TDP_ET);

    const dateMAJCnsa = await this.chargeLaDateDeMiseÀJourModel(FichierSource.DIAMANT_ANN_ERRD_EJ);

    return { date_mis_a_jour_finess: dateMAJFiness.dernièreMiseÀJour || "", date_mis_a_jour_tdbPerf: dateMAJTdbperf.dernièreMiseÀJour || "", date_mis_a_jour_cnsa: dateMAJCnsa.dernièreMiseÀJour || "" }
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
      return await this.compareSAN();
    }
  }

  private async compareEJ(params: ParametresDeComparaison): Promise<ResultatDeComparaison> {
    const { numerosFiness, annee, page, order, orderBy, forExport } = params;

    const compareEjQueryBody = ` from recherche ej
    LEFT JOIN budget_et_finances_entite_juridique bg
    on ej.numero_finess = bg.numero_finess_entite_juridique and bg.annee = ${annee}
    LEFT JOIN etablissement_territorial et 
    on ej.numero_finess = et.numero_finess_entite_juridique
    where ej.numero_finess IN(${numerosFiness.map((finess) => "'" + finess + "'")})
    group by ej.numero_finess, ej.raison_sociale_courte,
    ej.commune,
    ej.departement,
    ej.code_region,
    ej.type,
    ej.statut_juridique,
    bg.resultat_net_comptable_san,
    bg.taux_de_caf_nette_san,
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
    bg.ratio_dependance_financiere`

    const compareEjQuery = `Select ej.numero_finess,
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
    bg.ratio_dependance_financiere` + compareEjQueryBody;

    const limitForExport = forExport ? "" : `LIMIT ${this.NOMBRE_DE_RÉSULTATS_MAX_PAR_PAGE} OFFSET ${this.NOMBRE_DE_RÉSULTATS_MAX_PAR_PAGE * (page - 1)}`;
    const paginatedCompareEJQuery =
      order && orderBy
        ? compareEjQuery +
        ` ORDER BY ${orderBy} ${order} ${limitForExport} `
        : compareEjQuery +
        ` ORDER BY numero_finess ASC ${limitForExport} `;

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

    const compareSMSQueryBody = ` from etablissement_territorial et 
    LEFT JOIN activite_medico_social ac
    on et.numero_finess_etablissement_territorial = ac.numero_finess_etablissement_territorial and ac.annee = ${annee}
    LEFT JOIN budget_et_finances_medico_social bg
    on et.numero_finess_etablissement_territorial = bg.numero_finess_etablissement_territorial and bg.annee = ${annee}
    LEFT JOIN ressources_humaines_medico_social rh
    on et.numero_finess_etablissement_territorial = rh.numero_finess_etablissement_territorial and rh.annee = ${annee}
    LEFT JOIN ${compareSMSCapacite}
    on et.numero_finess_etablissement_territorial = cp.numero_finess_etablissement_territorial
    where et.numero_finess_etablissement_territorial IN(${numerosFiness.map((finess) => "'" + finess + "'")})`;

    const compareSMSQuery = `Select et.numero_finess_etablissement_territorial,
    et.raison_sociale_courte,
    et.domaine,
    et.commune,
    et.departement,
    et.code_region,
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
        ` ORDER BY numero_finess_etablissement_territorial ASC ${limitForExport} `;

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

  private async compareSAN(): Promise<ResultatDeComparaison> {
    return { nombreDeResultats: 0, resultat: [] };
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
        numéroFiness: resultat.numero_finess_etablissement_territorial,
        socialReason: resultat.raison_sociale_courte,
        type: resultat.domaine,
        commune: resultat.commune,
        departement: resultat.departement,
        capacite: resultat.capacite_total ? Number(resultat.capacite_total) : null,
        realisationActivite: resultat.taux_realisation_activite === 'NA' ? 'NA' : this.transformInRate(resultat.taux_realisation_activite, 1),
        acceuilDeJour: resultat.taux_occupation_accueil_de_jour === 'NA' ? 'NA' : this.transformInRate(resultat.taux_occupation_accueil_de_jour, 1),
        hebergementPermanent: resultat.taux_occupation_en_hebergement_permanent === 'NA' ? 'NA' : this.transformInRate(resultat.taux_occupation_en_hebergement_permanent, 1),
        hebergementTemporaire: resultat.taux_occupation_en_hebergement_temporaire === 'NA' ? 'NA' : this.transformInRate(resultat.taux_occupation_en_hebergement_temporaire, 1),
        fileActivePersonnesAccompagnes: resultat.file_active_personnes_accompagnees ? Number(resultat.file_active_personnes_accompagnees) : null,
        rotationPersonnel: resultat.taux_rotation_personnel === 'NA' ? 'NA' : this.transformInRate(resultat.taux_rotation_personnel, 1),
        absenteisme: resultat.taux_absenteisme_hors_formation === 'NA' ? 'NA' : this.transformInRate(resultat.taux_absenteisme_hors_formation, 1),
        prestationExterne: resultat.taux_prestation_externes === 'NA' ? 'NA' : this.transformInRate(resultat.taux_prestation_externes, 1),
        etpVacant: resultat.taux_etp_vacants === 'NA' ? 'NA' : this.transformInRate(resultat.taux_etp_vacants, 1),
        tauxCaf: resultat.taux_de_caf === 'NA' ? 'NA' : this.transformInRate(resultat.taux_de_caf, 1),
        vetusteConstruction: resultat.taux_de_vetuste_construction === 'NA' ? 'NA' : this.transformInRate(resultat.taux_de_vetuste_construction, 1),
        roulementNetGlobal: resultat.fonds_de_roulement === 'NA' ? 'NA' : this.makeNumberArrondi(resultat.fonds_de_roulement, 0),
        resultatNetComptable: resultat.resultat_net_comptable === 'NA' ? 'NA' : this.makeNumberArrondi(resultat.resultat_net_comptable, 0),
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
        statutJuridique: resultat.statut_juridique,
        rattachements: resultat.rattachement,
        chargesPrincipaux: this.makeNumberArrondi(resultat.total_depenses_principales, 0),
        chargesAnnexes: this.roundExpression(resultat.total_depenses_global, resultat.total_depenses_principales, 0),
        produitsPrincipaux: this.makeNumberArrondi(resultat.total_recettes_principales, 0),
        produitsAnnexes: this.roundExpression(resultat.total_recettes_global, resultat.total_recettes_principales, 0),
        resultatNetComptable: resultat.resultat_net_comptable_san,
        tauxCaf: resultat.taux_de_caf_nette_san,
        ratioDependanceFinanciere: resultat.ratio_dependance_financiere,
      };
    });
  }
}
