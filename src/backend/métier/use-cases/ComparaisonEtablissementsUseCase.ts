import { ProfilModel } from "../../../../database/models/ProfilModel";
import { ParametresDeComparaison } from "../entities/ParametresDeComparaison";
import { DatesMisAjourSources, EnveloppesResult, ResultatDeComparaison } from "../entities/ResultatDeComparaison";
import { ComparaisonLoader } from "../gateways/ComparaisonLoader";

export class ComparaisonEtablissementsUseCase {
  constructor(private readonly comparaisonLoader: ComparaisonLoader) { }

  async exécute(params: ParametresDeComparaison,
    profiles: ProfilModel[]
  ): Promise<ResultatDeComparaison> {
    return await this.comparaisonLoader.compare(params, profiles);
  }

  async getAnneesComparaison(
    type: string,
    numerosFiness: string[],
  ): Promise<string[]> {
    return await this.comparaisonLoader.listeAnnees(type, numerosFiness);
  }

  async getDatesMisAJourSourcesComparaison(): Promise<DatesMisAjourSources> {
    return await this.comparaisonLoader.getDatesMisAJourSourcesComparaison();
  }
  async getTopEnveloppes(): Promise<EnveloppesResult> {
    return await this.comparaisonLoader.getTopEnveloppes();
  }

  async getTopEnveloppes(): Promise<EnveloppesResult> {
    return await this.comparaisonLoader.getTopEnveloppes();
  }

  async getTypesFromFiness(numerosFiness: string[]): Promise<string[]> {
    return await this.comparaisonLoader.getTypesFromFiness(numerosFiness);
  }

}
