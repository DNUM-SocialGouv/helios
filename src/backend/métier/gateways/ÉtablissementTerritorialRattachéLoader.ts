import { ÉtablissementTerritorialRattaché } from '../entities/entité-juridique/ÉtablissementTerritorialRattaché'

export interface ÉtablissementTerritorialRattachéLoader {
  chargeLesÉtablissementsDeLEntitéJuridiqueDeRattachement(numéroFinessEntitéJuridique: string): Promise<ÉtablissementTerritorialRattaché[]>
}
