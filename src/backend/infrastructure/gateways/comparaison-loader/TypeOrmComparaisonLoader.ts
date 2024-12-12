import { DataSource } from "typeorm";

import { ResultatDeComparaison, ResultatSMS } from "../../../métier/entities/ResultatDeComparaison";
import { ComparaisonLoader } from "../../../métier/gateways/ComparaisonLoader";

type ComparaisonSMSTypeOrm = Readonly<{
  numero_finess: string;
  annee: number;
  raison_sociale_courte: string;
  structure: string;
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
        const generateAnnees = `SELECT generate_series(minannee,maxannee) annee
				FROM (
					SELECT min(annee) minannee, max(annee) maxannee FROM (
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
     etablissement.numero_finess_etablissement_territorial
      from  etablissement_territorial etablissement) id `;

    const compareSMSBudget = `(Select budget.taux_de_caf,
    	budget.taux_de_vetuste_construction,
    	budget.fonds_de_roulement,
    	budget.resultat_net_comptable,
    	budget.numero_finess_etablissement_territorial
    	from budget_et_finances_medico_social budget
   		where budget.annee = ${annee}) bg`;


    const compareSMSQuery = `Select id.numero_finess_etablissement_territorial,
    id.raison_sociale_courte,
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
    cp.capacite_total
    from ${compareIdentite} 
    LEFT JOIN ${compareSMSActivite}
    on id.numero_finess_etablissement_territorial = ac.numero_finess_etablissement_territorial
    LEFT JOIN ${compareSMSBudget}
    on id.numero_finess_etablissement_territorial = bg.numero_finess_etablissement_territorial
    LEFT JOIN ${compareSMSRH}
    on id.numero_finess_etablissement_territorial = rh.numero_finess_etablissement_territorial
    LEFT JOIN ${compareSMSCapacite}
    on id.numero_finess_etablissement_territorial = cp.numero_finess_etablissement_territorial
    where id.numero_finess_etablissement_territorial IN(${numerosFiness.map((finess) => "'" + finess + "'")})`;

    const paginatedCompareSMSQuery =
      order && orderBy
        ? compareSMSQuery +
        `ORDER BY ${orderBy} ${order} LIMIT ${this.NOMBRE_DE_RÉSULTATS_MAX_PAR_PAGE} OFFSET ${this.NOMBRE_DE_RÉSULTATS_MAX_PAR_PAGE * (page - 1)} `
        : compareSMSQuery +
        `ORDER BY numero_finess_etablissement_territorial ASC LIMIT ${this.NOMBRE_DE_RÉSULTATS_MAX_PAR_PAGE} OFFSET ${this.NOMBRE_DE_RÉSULTATS_MAX_PAR_PAGE * (page - 1)} `;

    // const averagesCompareSMSQuery =
    //   `
    //     select
    //         annual.annee,
    //         AVG(annual.taux_realisation_activite) as realisationAcitiviteMoyenne,
    //         AVG(annual.file_active_personnes_accompagnees) as fileActivePersonnesAccompagnesMoyenne,
    //         AVG(annual.taux_occupation_en_hebergement_permanent) as hebergementPermanentMoyenne,
    //         AVG(annual.taux_occupation_en_hebergement_temporaire) as hebergementTemporaireMoyenne ,
    //         AVG(annual.taux_occupation_accueil_de_jour) as acceuilDeJourMoyenne,
    //         AVG(annual.taux_de_caf) as tauxCafMoyenne,
    //         AVG(annual.taux_de_vetuste_construction) as vetusteConstructionMoyenne,
    //         AVG(annual.fonds_de_roulement) as roulementNetGlobalMoyenne,
    //         AVG(annual.resultat_net_comptable) as resultatNetComptableMoyenne,
    //         AVG(annual.taux_prestation_externes) as prestationExterneMoyenne,
    //         AVG(annual.taux_rotation_personnel) as rotationPersonnelMoyenne,
    //         AVG(annual.taux_etp_vacants) as etpVacantMoyenne,
    //         AVG(annual.taux_absenteisme_hors_formation) as absenteismeMoyenne,
    //         AVG(capacites.capacite_total) as capaciteMoyenne
    //     ` +
    //   compareSMSQueryBody +
    //   " GROUP BY annee";


    const compareSMSQueryResult = await (await this.orm).query(paginatedCompareSMSQuery);
    // const moyennesCompareSMSQueryResult = await (await this.orm).query(averagesCompareSMSQuery);

    return {
      nombreDeResultats: numerosFiness.length,
      resultat: this.contruitResultatSMS(compareSMSQueryResult),
      moyennes: [],
    };
  }

  private async compareSAN(): Promise<ResultatDeComparaison> {
    return { nombreDeResultats: 0, resultat: [], moyennes: [] };
  }

  // private contruitMoyennesSMS(moyennes: any[]): MoyenneSMS[] {
  //   return moyennes.map((moyenne: any): MoyenneSMS => {
  //     return {
  //       annee: moyenne.annee,
  //       capaciteMoyenne: moyenne.capacitemoyenne ? Number(moyenne.capacitemoyenne) : null,
  //       realisationAcitiviteMoyenne: moyenne.realisationacitivitemoyenne,
  //       acceuilDeJourMoyenne: moyenne.realisationacitivitemoyenne,
  //       hebergementPermanentMoyenne: moyenne.hebergementpermanentmoyenne,
  //       hebergementTemporaireMoyenne: moyenne.hebergementtemporairemoyenne,
  //       fileActivePersonnesAccompagnesMoyenne: moyenne.fileactivepersonnesaccompagnesmoyenne,
  //       rotationPersonnelMoyenne: moyenne.rotationpersonnelmoyenne,
  //       absenteismeMoyenne: moyenne.absenteismemoyenne,
  //       prestationExterneMoyenne: moyenne.prestationexternemoyenne,
  //       etpVacantMoyenne: moyenne.etpvacantmoyenne,
  //       tauxCafMoyenne: moyenne.tauxcafmoyenne,
  //       vetusteConstructionMoyenne: moyenne.vetusteconstructionmoyenne,
  //       roulementNetGlobalMoyenne: moyenne.roulementnetglobalmoyenne,
  //       resultatNetComptableMoyenne: moyenne.resultatnetcomptablemoyenne,
  //     };
  //   });
  // }

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
        numéroFiness: resultat.numero_finess,
        socialReason: resultat.raison_sociale_courte,
        type: resultat.structure,
        capacite: resultat.capacite_total,
        realisationActivite: this.transformInRate(resultat.taux_realisation_activite, 1),
        acceuilDeJour: this.transformInRate(resultat.taux_occupation_accueil_de_jour, 1),
        hebergementPermanent: this.transformInRate(resultat.taux_occupation_en_hebergement_permanent, 1),
        hebergementTemporaire: this.transformInRate(resultat.taux_occupation_en_hebergement_temporaire, 1),
        fileActivePersonnesAccompagnes: this.transformInRate(resultat.file_active_personnes_accompagnees, 1),
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
