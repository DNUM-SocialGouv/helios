import { Column, Entity, PrimaryColumn } from 'typeorm'

export enum CadreBudgétaire {
  ERRD = 'ERRD',
  CA_PA = 'CA_PA',
  CA_PH = 'CA_PH'
}

@Entity({ name: 'cpom' })
export class BudgetEtFinancesMédicoSocialModel {
  @PrimaryColumn({ name: 'annee', type: 'int' })
  public année!: number

  @PrimaryColumn({ length:9, name: 'numero_finess_etablissement_territorial' })
  public numéroFinessÉtablissementTerritorial!: string

  @Column({ name: 'contribution_frais_de_siege_groupement', type: 'float' })
  public contributionFraisDeSiègeGroupement!: number

  @Column({ name: 'depenses_groupe_i', type: 'float' })
  public dépensesGroupe1!: number

  @Column({ name: 'depenses_groupe_ii', type: 'float' })
  public dépensesGroupe2!: number

  @Column({ name: 'depenses_groupe_iii', type: 'float' })
  public dépensesGroupe3!: number

  @Column({ name: 'recettes_groupe_i', type: 'float' })
  public recettesGroupe1!: number

  @Column({ name: 'recettes_groupe_ii', type: 'float' })
  public recettesGroupe2!: number

  @Column({ name: 'recettes_groupe_iii', type: 'float' })
  public recettesGroupe3!: number

  @Column({ name: 'resultat_net_comptable', type: 'float' })
  public résultatNetComptable!: number

  @Column({ name: 'produits', type: 'float' })
  public produits!: number

  @Column({ name: 'charges', type: 'float' })
  public charges!: number

  @Column({
    enum: CadreBudgétaire,
    enumName: 'cadre_budgetaire',
    type: 'enum',
  })
  public cadreBudgétaire!: number

  @Column({ name: 'taux_de_caf', type: 'float' })
  public tauxDeCaf!: number

  @Column({ name: 'taux_de_vetuste', type: 'float' })
  public tauxDeVétusté!: number
}
