import { ÉtablissementTerritorialIdentité } from '../../../métier/entities/ÉtablissementTerritorialIdentité'
import { ÉtablissementTerritorialRepository } from '../../../métier/gateways/ÉtablissementTerritorialRepository'

export class FinessÉtablissementTerritorialRepository implements ÉtablissementTerritorialRepository {
  constructor(private readonly database: any) {}

  async save(établissementsTerritoriauxIdentité: ÉtablissementTerritorialIdentité[]): Promise<void> {
    //TODO: une requête par ligne pas top => à optimiser (multi VALUES)
    for (const établissementTerritorialIdentité of établissementsTerritoriauxIdentité) {
      await this.database.raw('INSERT INTO ÉtablissementTerritorialIdentité (adresseAcheminement, adresseNuméroVoie, adresseTypeVoie, adresseVoie, catégorieÉtablissement, courriel, numéroFinessEntitéJuridique, numéroFinessÉtablissementPrincipal, numéroFinessÉtablissementTerritorial, raisonSociale, téléphone, typeÉtablissement) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT (numéroFinessÉtablissementTerritorial) DO UPDATE SET adresseAcheminement = EXCLUDED.adresseAcheminement, adresseNuméroVoie = EXCLUDED.adresseNuméroVoie, adresseTypeVoie = EXCLUDED.adresseTypeVoie, adresseVoie = EXCLUDED.adresseVoie, catégorieÉtablissement = EXCLUDED.catégorieÉtablissement, courriel = EXCLUDED.courriel, numéroFinessEntitéJuridique = EXCLUDED.numéroFinessEntitéJuridique, numéroFinessÉtablissementPrincipal = EXCLUDED.numéroFinessÉtablissementPrincipal, numéroFinessÉtablissementTerritorial = EXCLUDED.numéroFinessÉtablissementTerritorial, raisonSociale = EXCLUDED.raisonSociale, téléphone = EXCLUDED.téléphone, typeÉtablissement = EXCLUDED.typeÉtablissement',
        [
          établissementTerritorialIdentité.adresseAcheminement,
          établissementTerritorialIdentité.adresseNuméroVoie,
          établissementTerritorialIdentité.adresseTypeVoie,
          établissementTerritorialIdentité.adresseVoie,
          établissementTerritorialIdentité.catégorieÉtablissement,
          établissementTerritorialIdentité.courriel,
          établissementTerritorialIdentité.numéroFinessEntitéJuridique,
          établissementTerritorialIdentité.numéroFinessÉtablissementPrincipal,
          établissementTerritorialIdentité.numéroFinessÉtablissementTerritorial,
          établissementTerritorialIdentité.raisonSociale,
          établissementTerritorialIdentité.téléphone,
          établissementTerritorialIdentité.typeÉtablissement,
        ])
    }

    await this.database.raw('INSERT INTO DateMiseÀJourSource (dernièreMiseÀJour, source) VALUES (?, ?) ON CONFLICT (source) DO UPDATE SET dernièreMiseÀJour = EXCLUDED.dernièreMiseÀJour',
      [
        établissementsTerritoriauxIdentité[0].dateMiseAJourSource,
        'FINESS',
      ])
  }
}
