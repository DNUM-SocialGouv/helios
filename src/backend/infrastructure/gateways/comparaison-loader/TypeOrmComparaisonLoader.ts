import { DataSource } from "typeorm";

import { MoyenneSMS, ResultatDeComparaison, ResultatSMS } from "../../../métier/entities/ResultatDeComparaison";
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
        const generateAnnees = `SELECT generate_series(maxannee - 2,maxannee) annee
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

  private async compareSMS(numerosFiness: string[], page: number, order: string, orderBy: string, annee: string): Promise<ResultatDeComparaison> {
    const compareSMSCapacite = `(select SUM(public.autorisation_medico_social.capacite_installee_totale) as capacite_total,
        autorisation_medico_social.numero_finess_etablissement_territorial
        FROM autorisation_medico_social
        GROUP BY autorisation_medico_social.numero_finess_etablissement_territorial) cp`;

    const compareSMSActivite = `(Select activite.taux_realisation_activite,
      activite.file_active_personnes_accompagnees,
      activite.taux_occupation_en_hebergement_permanent,
      activite.taux_occupation_en_hebergement_temporaire,
      activite.taux_occupation_accueil_de_jour,
      activite.numero_finess_etablissement_territorial
      FROM activite_medico_social activite
      where activite.annee = ${annee}) ac`;

    const compareSMSRH = `(Select  rhms.taux_prestation_externes,
    	rhms.taux_rotation_personnel,
    	rhms.taux_etp_vacants,
    	rhms.taux_absenteisme_hors_formation,
    	rhms.numero_finess_etablissement_territorial
    	from ressources_humaines_medico_social rhms
    	where rhms.annee = ${annee}) rh`;

    const compareIdentite = `(Select etablissement.raison_sociale_courte,
      etablissement.commune,
      etablissement.departement,
      etablissement.domaine,
      etablissement.numero_finess_etablissement_territorial
      from  etablissement_territorial etablissement) id `;

    const compareSMSBudget = `(Select budget.taux_de_caf,
    	budget.taux_de_vetuste_construction,
    	budget.fonds_de_roulement,
    	budget.resultat_net_comptable,
    	budget.numero_finess_etablissement_territorial
    	from budget_et_finances_medico_social budget
   		where budget.annee = ${annee}) bg`;

    const compareSMSQueryBody = ` from ${compareIdentite} 
    LEFT JOIN ${compareSMSActivite}
    on id.numero_finess_etablissement_territorial = ac.numero_finess_etablissement_territorial
    LEFT JOIN ${compareSMSBudget}
    on id.numero_finess_etablissement_territorial = bg.numero_finess_etablissement_territorial
    LEFT JOIN ${compareSMSRH}
    on id.numero_finess_etablissement_territorial = rh.numero_finess_etablissement_territorial
    LEFT JOIN ${compareSMSCapacite}
    on id.numero_finess_etablissement_territorial = cp.numero_finess_etablissement_territorial
    where id.numero_finess_etablissement_territorial IN(${numerosFiness.map((finess) => "'" + finess + "'")})`;

    const compareSMSQuery = `Select id.numero_finess_etablissement_territorial,
    id.raison_sociale_courte,
    id.domaine,
    id.commune,
    id.departement,
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
            AVG(ac.taux_realisation_activite) as realisationAcitiviteMoyenne,
            AVG(ac.file_active_personnes_accompagnees) as fileActivePersonnesAccompagnesMoyenne,
            AVG(ac.taux_occupation_en_hebergement_permanent) as hebergementPermanentMoyenne,
            AVG(ac.taux_occupation_en_hebergement_temporaire) as hebergementTemporaireMoyenne ,
            AVG(ac.taux_occupation_accueil_de_jour) as acceuilDeJourMoyenne,
            AVG(bg.taux_de_caf) as tauxCafMoyenne,
            AVG(bg.taux_de_vetuste_construction) as vetusteConstructionMoyenne,
            AVG(bg.fonds_de_roulement) as roulementNetGlobalMoyenne,
            AVG(bg.resultat_net_comptable) as resultatNetComptableMoyenne,
            AVG(rh.taux_prestation_externes) as prestationExterneMoyenne,
            AVG(rh.taux_rotation_personnel) as rotationPersonnelMoyenne,
            AVG(rh.taux_etp_vacants) as etpVacantMoyenne,
            AVG(rh.taux_absenteisme_hors_formation) as absenteismeMoyenne,
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
      realisationAcitiviteMoyenne: this.transformInRate(moyenne.realisationacitivitemoyenne, 1),
      acceuilDeJourMoyenne: this.transformInRate(moyenne.realisationacitivitemoyenne, 1),
      hebergementPermanentMoyenne: this.transformInRate(moyenne.hebergementpermanentmoyenne, 1),
      hebergementTemporaireMoyenne: this.transformInRate(moyenne.hebergementtemporairemoyenne, 1),
      fileActivePersonnesAccompagnesMoyenne: moyenne.fileactivepersonnesaccompagnesmoyenne,
      rotationPersonnelMoyenne: this.transformInRate(moyenne.rotationpersonnelmoyenne, 1),
      absenteismeMoyenne: this.transformInRate(moyenne.absenteismemoyenne, 1),
      prestationExterneMoyenne: this.transformInRate(moyenne.prestationexternemoyenne, 1),
      etpVacantMoyenne: this.transformInRate(moyenne.etpvacantmoyenne, 1),
      tauxCafMoyenne: this.transformInRate(moyenne.tauxcafmoyenne, 1),
      vetusteConstructionMoyenne: this.transformInRate(moyenne.vetusteconstructionmoyenne, 1),
      roulementNetGlobalMoyenne: this.makeNumberArrondi(moyenne.roulementnetglobalmoyenne, 2),
      resultatNetComptableMoyenne: this.makeNumberArrondi(moyenne.resultatnetcomptablemoyenne, 2)
    };
  }

  private makeNumberArrondi(value: any, num: number): number | null {
    // Convert value to a number and check if it's a valid number
    const numericValue = value ? Number(value) : null;

    if (numericValue && !isNaN(numericValue)) {
      // If numericValue is a valid number, return the rounded number
      return Number(numericValue.toFixed(num));
    } else {
      // If it's not a valid number, return null or handle as needed
      return null;
    }
  }

  private transformInRate(number: number, chiffre: number): number | null {
    return number ? this.makeNumberArrondi(number * 100, chiffre) : number;
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
        roulementNetGlobal: this.makeNumberArrondi(resultat.fonds_de_roulement, 2),
        resultatNetComptable: this.makeNumberArrondi(resultat.resultat_net_comptable, 2),
      };
    });
  }
}
