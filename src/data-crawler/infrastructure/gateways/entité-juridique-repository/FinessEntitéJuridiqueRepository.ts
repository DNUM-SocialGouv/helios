import { EntitéJuridique } from '../../../métier/entities/EntitéJuridique'
import { EntitéJuridiqueRepository } from '../../../métier/gateways/EntitéJuridiqueRepository'

export class FinessEntitéJuridiqueRepository implements EntitéJuridiqueRepository {
  constructor(private readonly database: any) {}

  async save(entitésJuridiques: EntitéJuridique[]): Promise<void> {
    //TODO: une requête par ligne pas top => à optimiser (multi VALUES)
    for (const entitéJuridique of entitésJuridiques) {
      await this.database.raw('INSERT INTO EntitéJuridique (adresseAcheminement, adresseNuméroVoie, adresseTypeVoie, adresseVoie, numéroFinessEntitéJuridique, raisonSociale, libelléStatutJuridique, téléphone) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT (numéroFinessEntitéJuridique) DO UPDATE SET adresseAcheminement = EXCLUDED.adresseAcheminement, adresseNuméroVoie = EXCLUDED.adresseNuméroVoie, adresseTypeVoie = EXCLUDED.adresseTypeVoie, adresseVoie = EXCLUDED.adresseVoie, numéroFinessEntitéJuridique = EXCLUDED.numéroFinessEntitéJuridique, raisonSociale = EXCLUDED.raisonSociale, libelléStatutJuridique = EXCLUDED.libelléStatutJuridique, téléphone = EXCLUDED.téléphone',
        [
          entitéJuridique.adresseAcheminement,
          entitéJuridique.adresseNuméroVoie,
          entitéJuridique.adresseTypeVoie,
          entitéJuridique.adresseVoie,
          entitéJuridique.numéroFinessEntitéJuridique,
          entitéJuridique.raisonSociale,
          entitéJuridique.libelléStatutJuridique,
          entitéJuridique.téléphone,
        ])
    }
  }
}
