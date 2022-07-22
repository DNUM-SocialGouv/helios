import { ViewColumn, ViewEntity } from 'typeorm'

@ViewEntity({
  expression: `CREATE OR REPLACE VIEW recherche AS
    SELECT
      numero_finess_entite_juridique AS numero_finess,
      raison_sociale,
      'Entité juridique' AS type,
      to_tsvector('unaccent_helios', raison_sociale || ' ' || numero_finess_entite_juridique) AS termes,
      commune,
      departement
    FROM entite_juridique
    UNION ALL
    SELECT
      numero_finess_etablissement_territorial AS numero_finess,
      raison_sociale,
      domaine::text AS type,
      to_tsvector('unaccent_helios', raison_sociale || ' ' || numero_finess_etablissement_territorial) AS termes,
      commune,
      departement
    FROM etablissement_territorial;`,
  name: 'recherche',
})
export class RechercheModel {
  @ViewColumn({ name: 'commune' })
  public commune!: string

  @ViewColumn({ name: 'departement' })
  public département!: string

  @ViewColumn({ name: 'numero_finess' })
  public numeroFiness!: string

  @ViewColumn({ name: 'raison_sociale' })
  public raisonSociale!: string

  @ViewColumn({ name: 'type' })
  public type!: string
}
