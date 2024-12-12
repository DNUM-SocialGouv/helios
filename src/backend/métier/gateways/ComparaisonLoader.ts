import { ResultatDeComparaison } from "../entities/ResultatDeComparaison";

export interface ComparaisonLoader {
    listeAnnees(type: string, numerosFiness: string[]): Promise<string[]>;
    compare(type: string, numerosFiness: string[], annee: string, page: number, orderBy: string, order: string): Promise<ResultatDeComparaison>;
}
