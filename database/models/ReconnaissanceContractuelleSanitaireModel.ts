import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

import { ÉtablissementTerritorialIdentitéModel } from './ÉtablissementTerritorialIdentitéModel'

@Entity({ name: 'reconnaissance_contractuelle_sanitaire' })
export class ReconnaissanceContractuelleSanitaireModel {
  @Column({ length: 2, name: 'code_activite' })
  public codeActivité!: string

  @Column({ name: 'capacite_autorisee', type: 'integer' })
  public capacitéAutorisée!: number

  @Column({ name: 'date_effet_asr', type: 'date' })
  public dateEffetAsr!: string

  @Column({ name: 'date_effet_cpom', type: 'date' })
  public dateEffetCpom!: string

  @Column({ name: 'date_fin_cpom', type: 'date' })
  public dateFinCpom!: string

  @ManyToOne(() => ÉtablissementTerritorialIdentitéModel, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'numero_finess_etablissement_territorial', referencedColumnName: 'numéroFinessÉtablissementTerritorial' })
  public établissementTerritorial!: ÉtablissementTerritorialIdentitéModel

  @Column({ length: 2, name: 'code_forme' })
  public codeForme!: string

  @Column({ length: 12, name: 'numero_cpom' })
  public numéroCpom!: string

  @Column({ length: 255, name: 'libelle_activite' })
  public libelléActivité!: string

  @Column({ length: 255, name: 'libelle_forme' })
  public libelléForme!: string

  @Column({ length: 255, name: 'libelle_modalite' })
  public libelléModalité!: string

  @Column({ length: 2, name: 'code_modalite' })
  public codeModalité!: string

  @PrimaryColumn({ length: 31, name: 'numero_autorisation_arhgos' })
  public numéroAutorisationArhgos!: string

  @PrimaryColumn({ length: 9, name: 'numero_finess_etablissement_territorial' })
  public numéroFinessÉtablissementTerritorial!: string
}
