import { ResultatDeComparaison } from "../entities/ResultatDeComparaison";
import { ComparaisonLoader } from "../gateways/ComparaisonLoader";

export class ComparaisonEtablissementsUseCase {
    constructor(private comparaisonLoader: ComparaisonLoader) { }

    async exécute(
        type: string,
        numerosFiness: string[],
        annee: string,
        page: number,
        order: string,
        orderBy: string
    ): Promise<ResultatDeComparaison> {
        return await this.comparaisonLoader.compare(type, numerosFiness, annee, page, order, orderBy);
    }

    async getAnneesComparaison(
        type: string,
        numerosFiness: string[],
    ): Promise<string[]> {
        return await this.comparaisonLoader.listeAnnees(type, numerosFiness);
    }

}
