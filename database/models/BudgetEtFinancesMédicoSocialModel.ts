import { Column, Entity, PrimaryColumn } from 'typeorm'

export enum CadreBudgétaire {
  ERRD = 'ERRD',
  CA_PA = 'CA_PA',
  CA_PH = 'CA_PH'
}

@Entity({ name: 'budget_et_finances_medico_social' })
export class BudgetEtFinancesMédicoSocialModel {
  @PrimaryColumn({ name: 'annee', type: 'int' })
  public année!: number

  @Column({
    enum: CadreBudgétaire,
    enumName: 'cadre_budgetaire',
    name: 'cadre_budgetaire',
    type: 'enum',
  })
  public cadreBudgétaire!: CadreBudgétaire

  @Column({ name: 'charges', nullable: true, type: 'float' })
  public charges!: number | null

  @Column({ name: 'contribution_frais_de_siege_groupement', nullable: true, type: 'float' })
  public contributionFraisDeSiègeGroupement!: number | null

  @Column({ name: 'depenses_groupe_i', nullable: true, type: 'float' })
  public dépensesGroupe1!: number | null

  @Column({ name: 'depenses_groupe_ii', nullable: true, type: 'float' })
  public dépensesGroupe2!: number | null

  @Column({ name: 'depenses_groupe_iii', nullable: true, type: 'float' })
  public dépensesGroupe3!: number | null

  @Column({ name: 'fonds_de_roulement', nullable: true, type: 'float' })
  public fondsDeRoulement!: number | null

  @PrimaryColumn({ length:9, name: 'numero_finess_etablissement_territorial' })
  public numéroFinessÉtablissementTerritorial!: string

  @Column({ name: 'produits', nullable: true, type: 'float' })
  public produits!: number | null

  @Column({ name: 'recettes_groupe_i', nullable: true, type: 'float' })
  public recettesGroupe1!: number | null

  @Column({ name: 'recettes_groupe_ii', nullable: true, type: 'float' })
  public recettesGroupe2!: number | null

  @Column({ name: 'recettes_groupe_iii', nullable: true, type: 'float' })
  public recettesGroupe3!: number | null

  @Column({ name: 'resultat_net_comptable', type: 'float' })
  public résultatNetComptable!: number

  @Column({ name: 'taux_de_caf', nullable: true, type: 'float' })
  public tauxDeCaf!: number | null

  @Column({ name: 'taux_de_vetuste_construction', nullable: true, type: 'float' })
  public tauxDeVétustéConstruction!: number | null
}
