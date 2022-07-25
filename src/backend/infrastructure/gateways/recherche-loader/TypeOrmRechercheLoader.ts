import { DataSource } from 'typeorm'

import { RechercheModel } from '../../../../../database/models/RechercheModel'
import { Résultat, RésultatDeRecherche } from '../../../métier/entities/RésultatDeRecherche'
import { RechercheLoader } from '../../../métier/gateways/RechercheLoader'

export class TypeOrmRechercheLoader implements RechercheLoader {
  private readonly NOMBRE_DE_RÉSULTATS_MAX = 12

  constructor(private readonly orm: Promise<DataSource>) {}

  async recherche(terme: string): Promise<RésultatDeRecherche> {
    const termeSansCaractèresSpéciaux = this.enlèveLesCaractèresSpéciauxDesTermes(terme)
    const résultats = await (await this.orm).getRepository(RechercheModel).query(
      `SELECT
        numero_finess,
        raison_sociale,
        type,
        ts_rank_cd(termes, plainto_tsquery('unaccent_helios', '${termeSansCaractèresSpéciaux}')) AS rank,
        commune,
        departement
      FROM recherche
      WHERE termes @@ plainto_tsquery('unaccent_helios', '${termeSansCaractèresSpéciaux}}')
      ORDER BY rank DESC
      LIMIT ${this.NOMBRE_DE_RÉSULTATS_MAX};`
    )

    return this.construisLesRésultatsDeLaRecherche(résultats)
  }

  private enlèveLesCaractèresSpéciauxDesTermes(terme: string) {
    return terme.replace(/[^0-9a-z]/gi, ' ')
  }

  private construisLesRésultatsDeLaRecherche(résultats: any): RésultatDeRecherche {
    return {
      nombreDeRésultats: résultats.length,
      résultats: résultats.map((rechercheRésultat: any): Résultat => {
        return {
          commune: rechercheRésultat.commune,
          département: rechercheRésultat.departement,
          numéroFiness: rechercheRésultat.numero_finess,
          raisonSociale: rechercheRésultat.raison_sociale,
          type: rechercheRésultat.type,
        }
      }),
    }
  }
}
