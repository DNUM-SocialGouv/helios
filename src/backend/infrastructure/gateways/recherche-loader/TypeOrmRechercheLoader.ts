import { DataSource, SelectQueryBuilder } from 'typeorm'

import { RechercheModel } from '../../../../../database/models/RechercheModel'
import { Résultat, RésultatDeRecherche } from '../../../métier/entities/RésultatDeRecherche'
import { RechercheLoader } from '../../../métier/gateways/RechercheLoader'

type RechercheTypeOrm = Readonly<{
  commune: string
  departement: string
  numero_finess: string
  raison_sociale: string
  type: string
}>

export class TypeOrmRechercheLoader implements RechercheLoader {
  private readonly NOMBRE_DE_RÉSULTATS_MAX_PAR_PAGE = 12

  constructor(private readonly orm: Promise<DataSource>) {}

  async recherche(terme: string, page: number): Promise<RésultatDeRecherche> {
    const termeSansEspaces = terme.replaceAll(/\s/g, '')

    const requêteDeLaRecherche = (await this.orm).createQueryBuilder()
      .select('recherche.numero_finess', 'numero_finess')
      .addSelect('recherche.raison_sociale', 'raison_sociale')
      .addSelect('recherche.type', 'type')
      .addSelect('recherche.commune', 'commune')
      .addSelect('recherche.departement', 'departement')
      .addSelect("ts_rank_cd(recherche.termes, plainto_tsquery('unaccent_helios', :terme))", 'rank')
      .from(RechercheModel, 'recherche')
      .where("recherche.termes @@ plainto_tsquery('unaccent_helios', :terme)", { terme })
      .orWhere("recherche.termes @@ plainto_tsquery('unaccent_helios', :termeSansEspaces)", { termeSansEspaces })
      .orderBy('rank', 'DESC')
      .addOrderBy('type', 'ASC')
      .addOrderBy('numero_finess', 'ASC')
      .limit(this.NOMBRE_DE_RÉSULTATS_MAX_PAR_PAGE)
      .offset(this.NOMBRE_DE_RÉSULTATS_MAX_PAR_PAGE * (page - 1))

    const rechercheModelRésultats = await requêteDeLaRecherche.getRawMany<RechercheTypeOrm>()
    const nombreDeRésultats = await this.compteLeNombreDeRésultats(requêteDeLaRecherche)

    return this.construisLesRésultatsDeLaRecherche(rechercheModelRésultats, nombreDeRésultats)
  }

  private async compteLeNombreDeRésultats(requêteDeLaRecherche: SelectQueryBuilder<RechercheModel>): Promise<number> {
    return await requêteDeLaRecherche.getCount()
  }

  private construisLesRésultatsDeLaRecherche(résultats: RechercheTypeOrm[], nombreDeRésultats: number): RésultatDeRecherche {
    return {
      nombreDeRésultats,
      résultats: résultats.map((rechercheRésultat: RechercheTypeOrm): Résultat => {
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
