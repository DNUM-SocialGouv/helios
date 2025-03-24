import { ProfilModel } from "../../../../database/models/ProfilModel";
import { ParametresDeComparaison } from "../entities/ParametresDeComparaison";
import { DatesMisAjourSources, ResultatDeComparaison } from "../entities/ResultatDeComparaison";

export interface ComparaisonLoader {
  listeAnnees(type: string, numerosFiness: string[]): Promise<string[]>;
  getDatesMisAJourSourcesComparaison(): Promise<DatesMisAjourSources>;
  compare(params: ParametresDeComparaison, codeProfiles: ProfilModel[]): Promise<ResultatDeComparaison>;
}
