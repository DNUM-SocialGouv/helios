import { ResultatDeComparaison } from "../entities/ResultatDeComparaison";

export interface ComparaisonLoader {
    compare(type: string, numerosFiness: string[], page: number): Promise<ResultatDeComparaison>;
}
