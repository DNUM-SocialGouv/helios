import { ViewColumn, ViewEntity } from "typeorm";

@ViewEntity({
  expression: `CREATE OR REPLACE VIEW recherche AS
    SELECT
      numero_finess_entite_juridique AS numero_finess,
      raison_sociale_courte,
      'Entité juridique' AS type,
      termes_de_recherche AS termes,
      categorisation AS statut_juridique,
      commune,
      departement
    FROM entite_juridique
    UNION ALL
    SELECT
      numero_finess_etablissement_territorial AS numero_finess,
      raison_sociale_courte,
      domaine::text AS type,
      termes_de_recherche AS termes,
      commune,
      departement
    FROM etablissement_territorial;`,
  name: "recherche",
})
export class RechercheModel {
  @ViewColumn({ name: "commune" })
  public commune!: string;

  @ViewColumn({ name: "departement" })
  public département!: string;

  @ViewColumn({ name: "numero_finess" })
  public numeroFiness!: string;

  @ViewColumn({ name: "raison_sociale_courte" })
  public raisonSocialeCourte!: string;

  @ViewColumn({ name: "type" })
  public type!: string;

  @ViewColumn({ name: "statut_juridique" })
  public statut_juridique!: string;
}
