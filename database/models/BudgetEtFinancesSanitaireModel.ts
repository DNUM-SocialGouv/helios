import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "budget_et_finances_sanitaire" })
export class BudgetEtFinancesSanitaireModel {
  @PrimaryColumn({ name: "annee", type: "int" })
  public année!: number;

  @PrimaryColumn({ length: 9, name: "numero_finess_etablissement_territorial" })
  public numéroFinessEtablissementTerritorial!: string;

  @Column({ name: "depenses_titre_i_global", nullable: true, type: "float" })
  public depensesTitreIGlobal!: number;

  @Column({ name: "depenses_titre_ii_global", nullable: true, type: "float" })
  public depensesTitreIIGlobal!: number;

  @Column({ name: "depenses_titre_iii_global", nullable: true, type: "float" })
  public depensesTitreIIIGlobal!: number;

  @Column({ name: "depenses_titre_iv_global", nullable: true, type: "float" })
  public depensesTitreIVGlobal!: number;

  @Column({ name: "recettes_titre_i_global", nullable: true, type: "float" })
  public recettesTitreIGlobal!: number;

  @Column({ name: "recettes_titre_ii_global", nullable: true, type: "float" })
  public recettesTitreIIGlobal!: number;

  @Column({ name: "recettes_titre_iii_global", nullable: true, type: "float" })
  public recettesTitreIIIGlobal!: number;

  @Column({ name: "recettes_titre_iv_global", nullable: true, type: "float" })
  public recettesTitreIVGlobal!: number;

  @Column({ name: "depenses_titre_i_h", nullable: true, type: "float" })
  public depensesTitreIH!: number;

  @Column({ name: "depenses_titre_ii_h", nullable: true, type: "float" })
  public depensesTitreIIH!: number;

  @Column({ name: "depenses_titre_iii_h", nullable: true, type: "float" })
  public depensesTitreIIIH!: number;

  @Column({ name: "depenses_titre_iv_h", nullable: true, type: "float" })
  public depensesTitreIVH!: number;

  @Column({ name: "recettes_titre_i_h", nullable: true, type: "float" })
  public recettesTitreIH!: number;

  @Column({ name: "recettes_titre_ii_h", nullable: true, type: "float" })
  public recettesTitreIIH!: number;

  @Column({ name: "recettes_titre_iii_h", nullable: true, type: "float" })
  public recettesTitreIIIH!: number;

  @Column({ name: "resultat_net_comptable_san", nullable: true, type: "float" })
  public resultatNetComptableSan!: number;

  @Column({ name: "taux_de_caf_nette_san", nullable: true, type: "float" })
  public tauxDeCafNetteSan!: number;

  @Column({ name: "ratio_dependance_financiere", nullable: true, type: "float" })
  public ratioDependanceFinanciere!: number;
}
