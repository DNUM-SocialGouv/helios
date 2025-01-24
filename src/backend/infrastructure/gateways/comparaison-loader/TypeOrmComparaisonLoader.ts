import { DataSource } from "typeorm";

import { DateMiseÀJourFichierSourceModel, FichierSource } from "../../../../../database/models/DateMiseÀJourFichierSourceModel";
import { ProfilModel } from "../../../../../database/models/ProfilModel";
import { DatesMisAjourSources, ResultatDeComparaison, ResultatSMS } from "../../../métier/entities/ResultatDeComparaison";
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

export class TypeOrmComparaisonLoader implements ComparaisonLoader {
  constructor(private readonly orm: Promise<DataSource>) { }
  private readonly NOMBRE_DE_RÉSULTATS_MAX_PAR_PAGE = 20;

  async listeAnnees(type: string, numerosFiness: string[]): Promise<string[]> {
    if (type === "Entité juridique") {
      return [];
    } else {
      if (type === "Médico-social") {
        const generateAnnees = `SELECT generate_series(
          CASE 
          WHEN maxannee = extract(year FROM current_date) THEN (maxannee - 2)::int
          ELSE (extract(year FROM current_date) - 3)::int
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
      } else {
        return [];
      }
    }
  }

  async getDatesMisAJourSourcesComparaison(): Promise<DatesMisAjourSources> {
    const dateMAJFiness = (await this.chargeLaDateDeMiseÀJourModel(
      FichierSource.FINESS_CS1400105
    )) as DateMiseÀJourFichierSourceModel;

    const dateMAJTdbperf = (await this.chargeLaDateDeMiseÀJourModel(
      FichierSource.DIAMANT_ANN_MS_TDP_ET
    )) as DateMiseÀJourFichierSourceModel;

    const dateMAJCnsa = (await this.chargeLaDateDeMiseÀJourModel(
      FichierSource.DIAMANT_ANN_ERRD_EJ
    )) as DateMiseÀJourFichierSourceModel;

    return { date_mis_a_jour_finess: dateMAJFiness.dernièreMiseÀJour || "", date_mis_a_jour_tdbPerf: dateMAJTdbperf.dernièreMiseÀJour || "", date_mis_a_jour_cnsa: dateMAJCnsa.dernièreMiseÀJour || "" }
  }

  async compare(type: string, numerosFiness: string[], annee: string, page: number, order: string, orderBy: string, forExport: boolean, codeRegion: string, profiles: ProfilModel[]): Promise<ResultatDeComparaison> {
    try {
      if (type === "Entité juridique") {
        return await this.compareEJ();
      } else {
        if (type === "Médico-social") {
          const profilesAutreRegValues = profiles.map((profile) => profile?.value.autreRegion.profilMédicoSocial)
          const autorisations = combineProfils(profilesAutreRegValues);
          return await this.compareSMS(numerosFiness, page, order, orderBy, annee, forExport, codeRegion, autorisations);
        } else {
          return await this.compareSAN();
        }
      }
    } catch (err) {
      throw err;
    }
  }

  private async compareEJ(): Promise<ResultatDeComparaison> {
    return { nombreDeResultats: 0, resultat: [] };
  }

  private async chargeLaDateDeMiseÀJourModel(source: FichierSource): Promise<DateMiseÀJourFichierSourceModel> {
    return (await (await this.orm).getRepository(DateMiseÀJourFichierSourceModel).findOneBy({ fichier: source })) as DateMiseÀJourFichierSourceModel;
  }

  private async compareSMS(numerosFiness: string[], page: number, order: string, orderBy: string, annee: string, forExport: boolean, codeRegion: string, autorisations: any): Promise<ResultatDeComparaison> {

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

    // const averageSubQuery = ` FROM (Select et.code_region,
    // CASE
    //       WHEN et.code_region = CAST(${codeRegion} AS TEXT) OR $1 = 'ok' THEN ac.file_active_personnes_accompagnees
    // ELSE null
    // END AS file_active_personnes_accompagnees,
    // CASE
    //       WHEN et.code_region = CAST(${codeRegion} AS TEXT) OR $2 = 'ok' THEN ac.taux_realisation_activite
    // ELSE null
    // END AS taux_realisation_activite,
    // CASE
    //       WHEN et.code_region = CAST(${codeRegion} AS TEXT) OR $3 = 'ok' THEN ac.taux_occupation_en_hebergement_permanent
    // ELSE null
    // END AS taux_occupation_en_hebergement_permanent,
    // CASE
    //       WHEN et.code_region = CAST(${codeRegion} AS TEXT) OR $4 = 'ok' THEN ac.taux_occupation_en_hebergement_temporaire
    // ELSE null
    // END AS taux_occupation_en_hebergement_temporaire,
    // CASE
    //       WHEN et.code_region = CAST(${codeRegion} AS TEXT) OR $5 = 'ok' THEN ac.taux_occupation_accueil_de_jour
    // ELSE null
    // END AS taux_occupation_accueil_de_jour,
    // CASE
    //       WHEN et.code_region = CAST(${codeRegion} AS TEXT) OR $6 = 'ok' THEN bg.taux_de_caf
    // ELSE null
    // END AS taux_de_caf,
    // CASE
    //       WHEN et.code_region = CAST(${codeRegion} AS TEXT) OR $7 = 'ok' THEN bg.taux_de_vetuste_construction
    // ELSE null
    // END AS taux_de_vetuste_construction,
    // CASE
    //       WHEN et.code_region = CAST(${codeRegion} AS TEXT) OR $8 = 'ok' THEN bg.fonds_de_roulement
    // ELSE null
    // END AS fonds_de_roulement,
    // CASE
    //      WHEN et.code_region = CAST(${codeRegion} AS TEXT) OR $9 = 'ok' THEN bg.resultat_net_comptable
    // ELSE null
    // END AS resultat_net_comptable,
    // CASE
    //       WHEN et.code_region = CAST(${codeRegion} AS TEXT) OR $10 = 'ok' THEN rh.taux_prestation_externes
    // ELSE null
    // END AS taux_prestation_externes,
    // CASE
    // WHEN et.code_region = CAST(${codeRegion} AS TEXT) OR $11 = 'ok' THEN rh.taux_etp_vacants
    // ELSE null
    // END AS taux_etp_vacants,
    // CASE
    // WHEN et.code_region = CAST(${codeRegion} AS TEXT) OR $12 = 'ok' THEN rh.taux_rotation_personnel
    // ELSE null
    // END AS taux_rotation_personnel,
    // CASE
    // WHEN et.code_region = CAST(${codeRegion} AS TEXT) OR $13 = 'ok' THEN rh.taux_absenteisme_hors_formation
    // ELSE null
    // END AS taux_absenteisme_hors_formation,
    // CASE
    // WHEN et.code_region = CAST(${codeRegion} AS TEXT) OR $14 = 'ok' THEN cp.capacite_total
    // ELSE null
    // END AS capacite_total` + compareSMSQueryBody + `) D`;

    const paginatedCompareSMSQuery =
      order && orderBy
        ? compareSMSQuery +
        `ORDER BY ${orderBy} ${order} ${forExport ? "" : `LIMIT ${this.NOMBRE_DE_RÉSULTATS_MAX_PAR_PAGE} OFFSET ${this.NOMBRE_DE_RÉSULTATS_MAX_PAR_PAGE * (page - 1)}`} `
        : compareSMSQuery +
        `ORDER BY numero_finess_etablissement_territorial ASC ${forExport ? "" : `LIMIT ${this.NOMBRE_DE_RÉSULTATS_MAX_PAR_PAGE} OFFSET ${this.NOMBRE_DE_RÉSULTATS_MAX_PAR_PAGE * (page - 1)}`} `;

    // const averagesCompareSMSQuery = `select
    //         AVG(ROUND(D.taux_realisation_activite::NUMERIC , 3)) as realisationAcitiviteMoyenne,
    //         AVG(D.file_active_personnes_accompagnees) as fileActivePersonnesAccompagnesMoyenne,
    //         AVG(ROUND(D.taux_occupation_en_hebergement_permanent::NUMERIC , 3)) as hebergementPermanentMoyenne,
    //         AVG(ROUND(D.taux_occupation_en_hebergement_temporaire::NUMERIC , 3)) as hebergementTemporaireMoyenne ,
    //         AVG(ROUND(D.taux_occupation_accueil_de_jour::NUMERIC , 3)) as acceuilDeJourMoyenne,
    //         AVG(ROUND(D.taux_de_caf::NUMERIC , 3)) as tauxCafMoyenne,
    //         AVG(ROUND(D.taux_de_vetuste_construction::NUMERIC , 3)) as vetusteConstructionMoyenne,
    //         AVG(ROUND(D.fonds_de_roulement::NUMERIC , 2)) as roulementNetGlobalMoyenne,
    //         AVG(ROUND(D.resultat_net_comptable::NUMERIC , 2)) as resultatNetComptableMoyenne,
    //         AVG(ROUND(D.taux_prestation_externes::NUMERIC , 3)) as prestationExterneMoyenne,
    //         AVG(ROUND(D.taux_rotation_personnel::NUMERIC , 3)) as rotationPersonnelMoyenne,
    //         AVG(ROUND(D.taux_etp_vacants::NUMERIC , 3)) as etpVacantMoyenne,
    //         AVG(ROUND(D.taux_absenteisme_hors_formation::NUMERIC , 3)) as absenteismeMoyenne,
    //         AVG(D.capacite_total) as capaciteMoyenne
    //     ` + averageSubQuery;


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
    // const moyennesCompareSMSQueryResult = await (await this.orm).query(averagesCompareSMSQuery,
    //   [autorisations.activités.fileActivePersonnesAccompagnées,
    //   autorisations.activités.tauxRéalisationActivité,
    //   autorisations.activités.tauxOccupationHébergementPermanent,
    //   autorisations.activités.tauxOccupationHébergementTemporaire,
    //   autorisations.activités.tauxOccupationAccueilDeJour,
    //   autorisations.budgetEtFinances.tauxDeCafNette,
    //   autorisations.budgetEtFinances.tauxDeVétustéConstruction,
    //   autorisations.budgetEtFinances.fondsDeRoulement,
    //   autorisations.budgetEtFinances.résultatNetComptable,
    //   autorisations.ressourcesHumaines.tauxDePrestationsExternes,
    //   autorisations.ressourcesHumaines.nombreDEtpRéalisés,
    //   autorisations.ressourcesHumaines.tauxDeRotationDuPersonnel,
    //   autorisations.ressourcesHumaines.tauxDAbsentéisme,
    //   autorisations.autorisationsEtCapacités.capacités
    //   ]
    // );

    return {
      nombreDeResultats: numerosFiness.length,
      resultat: this.contruitResultatSMS(compareSMSQueryResult),
      // moyennes: this.contruitMoyennesSMS(moyennesCompareSMSQueryResult[0]),
    };
  }

  private async compareSAN(): Promise<ResultatDeComparaison> {
    return { nombreDeResultats: 0, resultat: [] };
  }

  // private contruitMoyennesSMS(moyenne: any): MoyenneSMS {
  //   return {
  //     capaciteMoyenne: moyenne.capacitemoyenne ? this.makeNumberArrondi(Number(moyenne.capacitemoyenne), 2) : null,
  //     realisationAcitiviteMoyenne: moyenne.realisationacitivitemoyenne !== null ? this.transformInRate(moyenne.realisationacitivitemoyenne, 1) : null,
  //     acceuilDeJourMoyenne: moyenne.acceuildejourmoyenne !== null ? this.transformInRate(moyenne.acceuildejourmoyenne, 1) : null,
  //     hebergementPermanentMoyenne: moyenne.hebergementpermanentmoyenne !== null ? this.transformInRate(moyenne.hebergementpermanentmoyenne, 1) : null,
  //     hebergementTemporaireMoyenne: moyenne.hebergementtemporairemoyenne !== null ? this.transformInRate(moyenne.hebergementtemporairemoyenne, 1) : null,
  //     fileActivePersonnesAccompagnesMoyenne: moyenne.fileactivepersonnesaccompagnesmoyenne ? this.makeNumberArrondi(Number(moyenne.fileactivepersonnesaccompagnesmoyenne), 2) : null,
  //     rotationPersonnelMoyenne: moyenne.rotationpersonnelmoyenne !== null ? this.transformInRate(moyenne.rotationpersonnelmoyenne, 1) : null,
  //     absenteismeMoyenne: moyenne.absenteismemoyenne !== null ? this.transformInRate(moyenne.absenteismemoyenne, 1) : null,
  //     prestationExterneMoyenne: moyenne.prestationexternemoyenne !== null ? this.transformInRate(moyenne.prestationexternemoyenne, 1) : null,
  //     etpVacantMoyenne: moyenne.etpvacantmoyenne !== null ? this.transformInRate(moyenne.etpvacantmoyenne, 1) : null,
  //     tauxCafMoyenne: moyenne.tauxcafmoyenne !== null ? this.transformInRate(moyenne.tauxcafmoyenne, 1) : null,
  //     vetusteConstructionMoyenne: moyenne.vetusteconstructionmoyenne !== null ? this.transformInRate(moyenne.vetusteconstructionmoyenne, 1) : null,
  //     roulementNetGlobalMoyenne: moyenne.roulementnetglobalmoyenne !== null ? this.makeNumberArrondi(moyenne.roulementnetglobalmoyenne, 0) : null,
  //     resultatNetComptableMoyenne: moyenne.resultatnetcomptablemoyenne !== null ? this.makeNumberArrondi(moyenne.resultatnetcomptablemoyenne, 0) : null
  //   };
  // }

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
}
