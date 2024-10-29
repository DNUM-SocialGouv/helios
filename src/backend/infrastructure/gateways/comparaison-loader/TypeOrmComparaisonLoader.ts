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

    async compare(type: string, numerosFiness: string[]): Promise<ResultatDeComparaison> {
        try {
            if (type === 'Entité juridique') {
                return await this.compareEJ();
            } else {
                if (type === 'Médico-social') {
                    return await this.compareSMS(numerosFiness);
                } else {
                    return await this.compareSAN();
                }
            }
        } catch (err) {
            throw (err)
        }
    }

    private async compareEJ(): Promise<ResultatDeComparaison> {
        return [];
    }

    private async compareSMS(numerosFiness: string[]): Promise<ResultatDeComparaison> {
        const compareSMSQueryResult = await (await this.orm).query(`
        select 
        COALESCE(capacites.numero_finess, annual.numero_finess) as numero_finess,
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
        capacites.capacite_total
        From
        (select SUM(public.autorisation_medico_social.capacite_installee_totale) as capacite_total, 
        public.autorisation_medico_social.numero_finess_etablissement_territorial  as numero_finess
        FROM public.autorisation_medico_social
	    where public.autorisation_medico_social.numero_finess_etablissement_territorial 
	    IN ( ${numerosFiness.map((finess) => "'" + finess + "'")} )
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
        where etablissement.numero_finess_etablissement_territorial IN ( ${numerosFiness.map((finess) => "'" + finess + "'")} )) annual 
        on capacites.numero_finess = annual.numero_finess 
        `)

        return this.contruitResultatSMS(compareSMSQueryResult);
    }

    private async compareSAN(): Promise<ResultatDeComparaison> {
        return [];
    }

    private contruitResultatSMS(resultats: ComparaisonSMSTypeOrm[]): ResultatSMS[] {
        return resultats.map((resultat: ComparaisonSMSTypeOrm): ResultatSMS => {
            return {
                annee: resultat.annee,
                numeroFiness: resultat.numero_finess,
                raisonSociale: resultat.raison_sociale_courte,
                type: resultat.structure,
                capacite: resultat.capacite_total,
                realisationAcitivite: resultat.taux_realisation_activite,
                acceuilDeJour: resultat.taux_occupation_accueil_de_jour,
                hebergementPermanent: resultat.taux_occupation_en_hebergement_permanent,
                hebergementTemporaire: resultat.taux_occupation_en_hebergement_temporaire,
                fileActivePersonnesAccompagnes: resultat.file_active_personnes_accompagnees,
                rotationPersonnel: resultat.taux_rotation_personnel,
                absenteisme: resultat.taux_absenteisme_hors_formation,
                prestationExterne: resultat.taux_prestation_externes,
                etpVacant: resultat.taux_etp_vacants,
                tauxCaf: resultat.taux_de_caf,
                vetusteConstruction: resultat.taux_de_vetuste_construction,
                roulementNetGlobal: resultat.fonds_de_roulement,
                resultatNetComptable: resultat.resultat_net_comptable
            };
        })
    }
}
