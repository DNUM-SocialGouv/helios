import { DataSource } from "typeorm";

import { ÉtablissementTerritorialIdentitéModel } from "../../../../../database/models/ÉtablissementTerritorialIdentitéModel";
import { ResultatDeComparaison } from "../../../métier/entities/ResultatDeComparaison";
import { ComparaisonLoader } from "../../../métier/gateways/ComparaisonLoader";

export class TypeOrmComparaisonLoader implements ComparaisonLoader {
    constructor(private readonly orm: Promise<DataSource>) { }

    async compare(type: string, numerosFiness: string[]): Promise<ResultatDeComparaison> {
        try {
            if (type === 'Entité juridique') {
                return { nombreDeRésultats: 0, résultats: [] };
            } else {
                if (type === 'Médico-social') {
                    return await this.compareSMS(numerosFiness);
                } else {
                    return { nombreDeRésultats: 0, résultats: [] };
                }
            }
        } catch (err) {
            throw (err)
        }
    }

    private async compareSMS(numerosFiness: string[]): Promise<ResultatDeComparaison> {
        const compareSMSQuery = (await this.orm)
            .createQueryBuilder()
            .select("etablissement.numero_finess_etablissement_territorial", "numero_finess")
            .addSelect("etablissement.raison_sociale", "raison_sociale_courte")
            .addSelect("etablissement.domaine", "structure")
            .from(ÉtablissementTerritorialIdentitéModel, "etablissement")
            .where("etablissement.numero_finess_etablissement_territorial IN (:...numerosFiness)", { numerosFiness });

        const compareSMSResults = await compareSMSQuery.getRawMany();

        // eslint-disable-next-line no-console
        console.log("compareSMSResults", compareSMSResults);

        return { nombreDeRésultats: 0, résultats: [] };
    }
}
