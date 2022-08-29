import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

import { ÉtablissementTerritorialIdentitéModel } from './ÉtablissementTerritorialIdentitéModel'

@Entity({ name: 'reconnaissance_contractuelle_sanitaire' })
export class ReconnaissanceContractuelleSanitaireModel {
  @PrimaryColumn({ length: 2, name: 'activite' })
  public activité!: string

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

  @PrimaryColumn({ length: 2, name: 'forme' })
  public forme!: string

  @Column({ length: 12, name: 'id_cpom' })
  public numéroCpom!: string

  @Column({ length: 255, name: 'libelle_activite' })
  public libelléActivité!: string

  @Column({ length: 255, name: 'libelle_forme' })
  public libelléForme!: string

  @Column({ length: 255, name: 'libelle_modalite' })
  public libelléModalité!: string

  @PrimaryColumn({ length: 2, name: 'modalite' })
  public modalité!: string

  @Column({ length: 31, name: 'numero_autorisation_arhgos' })
  public numéroAutorisationArhgos!: string

  @PrimaryColumn({ length: 9, name: 'numero_finess_etablissement_territorial' })
  public numéroFinessÉtablissementTerritorial!: string
}
