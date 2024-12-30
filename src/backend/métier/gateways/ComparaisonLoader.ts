import { DatesMisAjourSources, ResultatDeComparaison } from "../entities/ResultatDeComparaison";

export interface ComparaisonLoader {
    listeAnnees(type: string, numerosFiness: string[]): Promise<string[]>;
    getDatesMisAJourSourcesComparaison(): Promise<DatesMisAjourSources>;
    compare(type: string, numerosFiness: string[], annee: string, page: number, orderBy: string, order: string, forExport: boolean): Promise<ResultatDeComparaison>;
}
