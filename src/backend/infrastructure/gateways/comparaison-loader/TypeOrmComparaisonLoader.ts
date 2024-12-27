import { DataSource } from "typeorm";

import { DateMiseÀJourFichierSourceModel, FichierSource } from "../../../../../database/models/DateMiseÀJourFichierSourceModel";
import { DatesMisAjourSources, MoyenneSMS, ResultatDeComparaison, ResultatSMS } from "../../../métier/entities/ResultatDeComparaison";
import { ComparaisonLoader } from "../../../métier/gateways/ComparaisonLoader";

type ComparaisonSMSTypeOrm = Readonly<{
  numero_finess_etablissement_territorial: string;
  raison_sociale_courte: string;
  domaine: string;
  commune: string;
  departement: string;
  taux_realisation_activite: number;
  file_active_personnes_accompagnees: number;
  taux_occupation_en_hebergement_permanent: number;
  taux_occupation_en_hebergement_temporaire: number;
  taux_occupation_accueil_de_jour: number;
  taux_de_caf: number;
  taux_de_vetuste_construction: number;
  fonds_de_roulement: number;
  resultat_net_comptable: number;
  taux_prestation_externes: number;
  taux_rotation_personnel: number;
  taux_etp_vacants: number;
  taux_absenteisme_hors_formation: number;
  capacite_total: number;
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

  async compare(type: string, numerosFiness: string[], annee: string, page: number, order: string, orderBy: string): Promise<ResultatDeComparaison> {
    try {
      if (type === "Entité juridique") {
        return await this.compareEJ();
      } else {
        if (type === "Médico-social") {
          return await this.compareSMS(numerosFiness, page, order, orderBy, annee);
        } else {
          return await this.compareSAN();
        }
      }
    } catch (err) {
      throw err;
    }
  }

  private async compareEJ(): Promise<ResultatDeComparaison> {
    return { nombreDeResultats: 0, resultat: [], moyennes: [] };
  }

  private async chargeLaDateDeMiseÀJourModel(source: FichierSource): Promise<DateMiseÀJourFichierSourceModel> {
    return (await (await this.orm).getRepository(DateMiseÀJourFichierSourceModel).findOneBy({ fichier: source })) as DateMiseÀJourFichierSourceModel;
  }

  private async compareSMS(numerosFiness: string[], page: number, order: string, orderBy: string, annee: string): Promise<ResultatDeComparaison> {
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
    ac.taux_realisation_activite,
    ac.file_active_personnes_accompagnees,
    ac.taux_occupation_en_hebergement_permanent,
    ac.taux_occupation_en_hebergement_temporaire,
    ac.taux_occupation_accueil_de_jour,
    bg.taux_de_caf,
    bg.taux_de_vetuste_construction,
    bg.fonds_de_roulement,
    bg.resultat_net_comptable,
    rh.taux_prestation_externes,
    rh.taux_rotation_personnel,
    rh.taux_etp_vacants,
    rh.taux_absenteisme_hors_formation,
    cp.capacite_total` + compareSMSQueryBody;

    const paginatedCompareSMSQuery =
      order && orderBy
        ? compareSMSQuery +
        `ORDER BY ${orderBy} ${order} LIMIT ${this.NOMBRE_DE_RÉSULTATS_MAX_PAR_PAGE} OFFSET ${this.NOMBRE_DE_RÉSULTATS_MAX_PAR_PAGE * (page - 1)} `
        : compareSMSQuery +
        `ORDER BY numero_finess_etablissement_territorial ASC LIMIT ${this.NOMBRE_DE_RÉSULTATS_MAX_PAR_PAGE} OFFSET ${this.NOMBRE_DE_RÉSULTATS_MAX_PAR_PAGE * (page - 1)} `;

    const averagesCompareSMSQuery = `select
            AVG(ROUND(ac.taux_realisation_activite::NUMERIC , 3)) as realisationAcitiviteMoyenne,
            AVG(ac.file_active_personnes_accompagnees) as fileActivePersonnesAccompagnesMoyenne,
            AVG(ROUND(ac.taux_occupation_en_hebergement_permanent::NUMERIC , 3)) as hebergementPermanentMoyenne,
            AVG(ROUND(ac.taux_occupation_en_hebergement_temporaire::NUMERIC , 3)) as hebergementTemporaireMoyenne ,
            AVG(ROUND(ac.taux_occupation_accueil_de_jour::NUMERIC , 3)) as acceuilDeJourMoyenne,
            AVG(ROUND(bg.taux_de_caf::NUMERIC , 3)) as tauxCafMoyenne,
            AVG(ROUND(bg.taux_de_vetuste_construction::NUMERIC , 3)) as vetusteConstructionMoyenne,
            AVG(ROUND(bg.fonds_de_roulement::NUMERIC , 2)) as roulementNetGlobalMoyenne,
            AVG(ROUND(bg.resultat_net_comptable::NUMERIC , 2)) as resultatNetComptableMoyenne,
            AVG(ROUND(rh.taux_prestation_externes::NUMERIC , 3)) as prestationExterneMoyenne,
            AVG(ROUND(rh.taux_rotation_personnel::NUMERIC , 3)) as rotationPersonnelMoyenne,
            AVG(ROUND(rh.taux_etp_vacants::NUMERIC , 3)) as etpVacantMoyenne,
            AVG(ROUND(rh.taux_absenteisme_hors_formation::NUMERIC , 3)) as absenteismeMoyenne,
            AVG(cp.capacite_total) as capaciteMoyenne
        ` +
      compareSMSQueryBody;


    const compareSMSQueryResult = await (await this.orm).query(paginatedCompareSMSQuery);
    const moyennesCompareSMSQueryResult = await (await this.orm).query(averagesCompareSMSQuery);

    return {
      nombreDeResultats: numerosFiness.length,
      resultat: this.contruitResultatSMS(compareSMSQueryResult),
      moyennes: this.contruitMoyennesSMS(moyennesCompareSMSQueryResult[0]),
    };
  }

  private async compareSAN(): Promise<ResultatDeComparaison> {
    return { nombreDeResultats: 0, resultat: [], moyennes: [] };
  }

  private contruitMoyennesSMS(moyenne: any): MoyenneSMS {
    return {
      capaciteMoyenne: moyenne.capacitemoyenne ? this.makeNumberArrondi(Number(moyenne.capacitemoyenne), 2) : null,
      realisationAcitiviteMoyenne: moyenne.realisationacitivitemoyenne !== null ? this.transformInRate(moyenne.realisationacitivitemoyenne, 1) : null,
      acceuilDeJourMoyenne: moyenne.acceuildejourmoyenne !== null ? this.transformInRate(moyenne.acceuildejourmoyenne, 1) : null,
      hebergementPermanentMoyenne: moyenne.hebergementpermanentmoyenne !== null ? this.transformInRate(moyenne.hebergementpermanentmoyenne, 1) : null,
      hebergementTemporaireMoyenne: moyenne.hebergementtemporairemoyenne !== null ? this.transformInRate(moyenne.hebergementtemporairemoyenne, 1) : null,
      fileActivePersonnesAccompagnesMoyenne: moyenne.fileactivepersonnesaccompagnesmoyenne,
      rotationPersonnelMoyenne: moyenne.rotationpersonnelmoyenne !== null ? this.transformInRate(moyenne.rotationpersonnelmoyenne, 1) : null,
      absenteismeMoyenne: moyenne.absenteismemoyenne !== null ? this.transformInRate(moyenne.absenteismemoyenne, 1) : null,
      prestationExterneMoyenne: moyenne.prestationexternemoyenne !== null ? this.transformInRate(moyenne.prestationexternemoyenne, 1) : null,
      etpVacantMoyenne: moyenne.etpvacantmoyenne !== null ? this.transformInRate(moyenne.etpvacantmoyenne, 1) : null,
      tauxCafMoyenne: moyenne.tauxcafmoyenne !== null ? this.transformInRate(moyenne.tauxcafmoyenne, 1) : null,
      vetusteConstructionMoyenne: moyenne.vetusteconstructionmoyenne !== null ? this.transformInRate(moyenne.vetusteconstructionmoyenne, 1) : null,
      roulementNetGlobalMoyenne: moyenne.roulementnetglobalmoyenne !== null ? this.makeNumberArrondi(moyenne.roulementnetglobalmoyenne, 0) : null,
      resultatNetComptableMoyenne: moyenne.resultatnetcomptablemoyenne !== null ? this.makeNumberArrondi(moyenne.resultatnetcomptablemoyenne, 0) : null
    };
  }

  private makeNumberArrondi(value: any, num: number): number | null {
    // Convert value to a number and check if it's a valid number
    const numericValue = value !== null ? Number(value) : null;

    if (numericValue !== null && !isNaN(numericValue)) {
      // If numericValue is a valid number, return the rounded number
      return Number(numericValue.toFixed(num));
    } else {
      // If it's not a valid number, return null or handle as needed
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
        capacite: resultat.capacite_total,
        realisationActivite: this.transformInRate(resultat.taux_realisation_activite, 1),
        acceuilDeJour: this.transformInRate(resultat.taux_occupation_accueil_de_jour, 1),
        hebergementPermanent: this.transformInRate(resultat.taux_occupation_en_hebergement_permanent, 1),
        hebergementTemporaire: this.transformInRate(resultat.taux_occupation_en_hebergement_temporaire, 1),
        fileActivePersonnesAccompagnes: resultat.file_active_personnes_accompagnees,
        rotationPersonnel: this.transformInRate(resultat.taux_rotation_personnel, 1),
        absenteisme: this.transformInRate(resultat.taux_absenteisme_hors_formation, 1),
        prestationExterne: this.transformInRate(resultat.taux_prestation_externes, 1),
        etpVacant: this.transformInRate(resultat.taux_etp_vacants, 1),
        tauxCaf: this.transformInRate(resultat.taux_de_caf, 1),
        vetusteConstruction: this.transformInRate(resultat.taux_de_vetuste_construction, 1),
        roulementNetGlobal: this.makeNumberArrondi(resultat.fonds_de_roulement, 0),
        resultatNetComptable: this.makeNumberArrondi(resultat.resultat_net_comptable, 0),
      };
    });
  }
}
