import { ResultatDeComparaison } from "../entities/ResultatDeComparaison";
import { ComparaisonLoader } from "../gateways/ComparaisonLoader";

export class ComparaisonEtablissementsUseCase {
    constructor(private comparaisonLoader: ComparaisonLoader) { }

    async exécute(
        type: string,
        numerosFiness: string[],
    ): Promise<ResultatDeComparaison> {
        return await this.comparaisonLoader.compare(type, numerosFiness);
    }
}
