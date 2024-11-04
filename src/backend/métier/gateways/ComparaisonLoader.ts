import { ResultatDeComparaison } from "../entities/ResultatDeComparaison";

export interface ComparaisonLoader {
    compare(type: string, numerosFiness: string[], page: number, orderBy: string, order: string): Promise<ResultatDeComparaison>;
}
