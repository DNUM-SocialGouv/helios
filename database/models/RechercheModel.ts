import { ViewColumn, ViewEntity } from 'typeorm'

@ViewEntity({
  expression: `CREATE VIEW recherche AS
  SELECT
    numero_finess_entite_juridique AS numero_finess,
    raison_sociale,
    'Entité juridique' AS domaine,
    to_tsvector('unaccent_helios', raison_sociale || ' ' || numero_finess_entite_juridique) AS termes
  FROM entite_juridique
  UNION ALL
  SELECT
    numero_finess_etablissement_territorial AS numero_finess,
    raison_sociale,
    domaine::text,
    to_tsvector('unaccent_helios', raison_sociale || ' ' || numero_finess_etablissement_territorial) AS termes
  FROM etablissement_territorial;`,
  name: 'recherche',
})
export class RechercheModel {
  @ViewColumn({ name: 'numero_finess' })
  public numeroFiness!: string

  @ViewColumn({ name: 'raison_sociale' })
  public raisonSociale!: string

  @ViewColumn({ name: 'domaine' })
  public type!: string
}
