import { DataSource } from "typeorm";

import { MoyenneSMS, ResultatDeComparaison, ResultatSMS } from "../../../métier/entities/ResultatDeComparaison";
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
  constructor(private readonly orm: Promise<DataSource>) {}
  private readonly NOMBRE_DE_RÉSULTATS_MAX_PAR_PAGE = 20;

  async compare(type: string, numerosFiness: string[], page: number, order: string, orderBy: string): Promise<ResultatDeComparaison> {
    try {
      if (type === "Entité juridique") {
        return await this.compareEJ();
      } else {
        if (type === "Médico-social") {
          return await this.compareSMS(numerosFiness, page, order, orderBy);
        } else {
          return await this.compareSAN();
        }
      }
    } catch (err) {
      throw err;
    }
  }

  private async compareEJ(): Promise<ResultatDeComparaison> {
    return { nombreDeResultats: [{ annee: 2020, total: 0 }], resultat: [], moyennes: [] };
  }

  private async compareSMS(numerosFiness: string[], page: number, order: string, orderBy: string): Promise<ResultatDeComparaison> {
    const compareSMSQueryBody = ` From
            (select SUM(public.autorisation_medico_social.capacite_installee_totale) as capacite_total,
                public.autorisation_medico_social.numero_finess_etablissement_territorial as numero_finess
        FROM public.autorisation_medico_social
	    where public.autorisation_medico_social.numero_finess_etablissement_territorial 
	    IN(${numerosFiness.map((finess) => "'" + finess + "'")})
	    GROUP BY public.autorisation_medico_social.numero_finess_etablissement_territorial
            ) capacites 
        FULL JOIN
            (SELECT etablissement.numero_finess_etablissement_territorial as numero_finess,
                etablissement.raison_sociale as raison_sociale_courte,
                etablissement.domaine as structure,
                activite.taux_realisation_activite,
                activite.file_active_personnes_accompagnees,
                activite.taux_occupation_en_hebergement_permanent,
                activite.taux_occupation_en_hebergement_temporaire,
                activite.taux_occupation_accueil_de_jour,
                budget.taux_de_caf,
                budget.taux_de_vetuste_construction,
                budget.fonds_de_roulement,
                budget.resultat_net_comptable,
                rh.taux_prestation_externes,
                rh.taux_rotation_personnel,
                rh.taux_etp_vacants,
                rh.taux_absenteisme_hors_formation,
                COALESCE(activite.annee, budget.annee, rh.annee) as annee
        FROM ressources_humaines_medico_social rh
        FULL JOIN 
        budget_et_finances_medico_social budget
        ON rh.numero_finess_etablissement_territorial = budget.numero_finess_etablissement_territorial
        AND rh.annee = budget.annee
        FULL JOIN 
        activite_medico_social activite
        ON activite.numero_finess_etablissement_territorial = COALESCE(budget.numero_finess_etablissement_territorial, rh.numero_finess_etablissement_territorial)
        AND activite.annee = COALESCE(budget.annee, rh.annee)
        left JOIN 
        etablissement_territorial etablissement
        ON etablissement.numero_finess_etablissement_territorial = COALESCE(activite.numero_finess_etablissement_territorial, budget.numero_finess_etablissement_territorial, rh.numero_finess_etablissement_territorial)
        where etablissement.numero_finess_etablissement_territorial IN(${numerosFiness.map((finess) => "'" + finess + "'")})) annual 
        on capacites.numero_finess = annual.numero_finess `;

    const compareSMSQuery =
      `select COALESCE(capacites.numero_finess, annual.numero_finess) as numero_finess,
            annual.annee,
            annual.raison_sociale_courte,
            annual.structure,
            annual.taux_realisation_activite,
            annual.file_active_personnes_accompagnees,
            annual.taux_occupation_en_hebergement_permanent,
            annual.taux_occupation_en_hebergement_temporaire,
            annual.taux_occupation_accueil_de_jour,
            annual.taux_de_caf,
            annual.taux_de_vetuste_construction,
            annual.fonds_de_roulement,
            annual.resultat_net_comptable,
            annual.taux_prestation_externes,
            annual.taux_rotation_personnel,
            annual.taux_etp_vacants,
            annual.taux_absenteisme_hors_formation,
            capacites.capacite_total ` + compareSMSQueryBody;

    const paginatedCompareSMSQuery =
      order && orderBy
        ? compareSMSQuery +
          `ORDER BY ${orderBy} ${order} LIMIT ${this.NOMBRE_DE_RÉSULTATS_MAX_PAR_PAGE} OFFSET ${this.NOMBRE_DE_RÉSULTATS_MAX_PAR_PAGE * (page - 1)} `
        : compareSMSQuery +
          `ORDER BY numero_finess ASC LIMIT ${this.NOMBRE_DE_RÉSULTATS_MAX_PAR_PAGE} OFFSET ${this.NOMBRE_DE_RÉSULTATS_MAX_PAR_PAGE * (page - 1)} `;

    const averagesCompareSMSQuery =
      `
        select
            annual.annee,
            AVG(annual.taux_realisation_activite) as realisationAcitiviteMoyenne,
            AVG(annual.file_active_personnes_accompagnees) as fileActivePersonnesAccompagnesMoyenne,
            AVG(annual.taux_occupation_en_hebergement_permanent) as hebergementPermanentMoyenne,
            AVG(annual.taux_occupation_en_hebergement_temporaire) as hebergementTemporaireMoyenne ,
            AVG(annual.taux_occupation_accueil_de_jour) as acceuilDeJourMoyenne,
            AVG(annual.taux_de_caf) as tauxCafMoyenne,
            AVG(annual.taux_de_vetuste_construction) as vetusteConstructionMoyenne,
            AVG(annual.fonds_de_roulement) as roulementNetGlobalMoyenne,
            AVG(annual.resultat_net_comptable) as resultatNetComptableMoyenne,
            AVG(annual.taux_prestation_externes) as prestationExterneMoyenne,
            AVG(annual.taux_rotation_personnel) as rotationPersonnelMoyenne,
            AVG(annual.taux_etp_vacants) as etpVacantMoyenne,
            AVG(annual.taux_absenteisme_hors_formation) as absenteismeMoyenne,
            AVG(capacites.capacite_total) as capaciteMoyenne
        ` +
      compareSMSQueryBody +
      " GROUP BY annee";

    const countCompareSMSQuery = `
        SELECT COUNT(*) AS total, annee
        FROM(${compareSMSQuery}) AS subquery
        GROUP BY annee
      `;

    const compareSMSQueryResult = await (await this.orm).query(paginatedCompareSMSQuery);
    const moyennesCompareSMSQueryResult = await (await this.orm).query(averagesCompareSMSQuery);
    const nombreDeResultats = await (await this.orm).query(countCompareSMSQuery);

    return {
      nombreDeResultats: nombreDeResultats,
      resultat: this.contruitResultatSMS(compareSMSQueryResult),
      moyennes: this.contruitMoyennesSMS(moyennesCompareSMSQueryResult),
    };
  }

  private async compareSAN(): Promise<ResultatDeComparaison> {
    return { nombreDeResultats: [{ annee: 2020, total: 0 }], resultat: [], moyennes: [] };
  }

  private contruitMoyennesSMS(moyennes: any[]): MoyenneSMS[] {
    return moyennes.map((moyenne: any): MoyenneSMS => {
      return {
        annee: moyenne.annee,
        capaciteMoyenne: moyenne.capacitemoyenne ? Number(moyenne.capacitemoyenne) : null,
        realisationAcitiviteMoyenne: moyenne.realisationacitivitemoyenne,
        acceuilDeJourMoyenne: moyenne.realisationacitivitemoyenne,
        hebergementPermanentMoyenne: moyenne.hebergementpermanentmoyenne,
        hebergementTemporaireMoyenne: moyenne.hebergementtemporairemoyenne,
        fileActivePersonnesAccompagnesMoyenne: moyenne.fileactivepersonnesaccompagnesmoyenne,
        rotationPersonnelMoyenne: moyenne.rotationpersonnelmoyenne,
        absenteismeMoyenne: moyenne.absenteismemoyenne,
        prestationExterneMoyenne: moyenne.prestationexternemoyenne,
        etpVacantMoyenne: moyenne.etpvacantmoyenne,
        tauxCafMoyenne: moyenne.tauxcafmoyenne,
        vetusteConstructionMoyenne: moyenne.vetusteconstructionmoyenne,
        roulementNetGlobalMoyenne: moyenne.roulementnetglobalmoyenne,
        resultatNetComptableMoyenne: moyenne.resultatnetcomptablemoyenne,
      };
    });
  }

  private makeNumberArrondi(value: number, num: number): number {
    return value ? Number(value.toFixed(num)) : value;
  }

  private transformInRate(number: number, chiffre: number): number {
    return number ? this.makeNumberArrondi(number * 100, chiffre) : number;
  }

  private contruitResultatSMS(resultats: ComparaisonSMSTypeOrm[]): ResultatSMS[] {
    return resultats.map((resultat: ComparaisonSMSTypeOrm): ResultatSMS => {
      return {
        annee: resultat.annee,
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
