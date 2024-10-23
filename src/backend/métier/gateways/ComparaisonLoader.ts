import { ResultatDeComparaison } from "../entities/ResultatDeComparaison";

export interface ComparaisonLoader {
    compare(type: string, numerosFiness: string[]): Promise<ResultatDeComparaison>;
}
