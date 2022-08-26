import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { ÉtablissementTerritorialIdentitéModel } from './ÉtablissementTerritorialIdentitéModel'

@Entity({ name: 'autorisation_medico_social' })
export class AutorisationMédicoSocialModel {
  @PrimaryGeneratedColumn({ name: '_autorisation_id' })
  public id!: number

  @Column({ length: 2, name: 'activite', type: 'varchar' })
  public activité!: string

  @Column({ name: 'capacite_autorisee_totale', nullable: true, type: 'integer' })
  public capacitéAutoriséeTotale!: number | null

  @Column({ name: 'capacite_installee_totale', nullable: true, type: 'integer' })
  public capacitéInstalléeTotale!: number | null

  @Column({ length: 3, name: 'clientele', type: 'varchar' })
  public clientèle!: string

  @Column({ name: 'date_autorisation', nullable: true, type: 'date' })
  public dateDAutorisation!: string | null

  @Column({ name: 'date_derniere_installation', nullable: true, type: 'date' })
  public dateDeDernièreInstallation!: string | null

  @Column({ name: 'date_mise_a_jour_autorisation', nullable: true, type: 'date' })
  public dateDeMiseÀJourDAutorisation!: string | null

  @Column({ length: 3, name: 'discipline_equipement', type: 'varchar' })
  public disciplineDÉquipement!: string

  @Column({ name: 'est_installee', type: 'boolean' })
  public estInstallée!: boolean

  @ManyToOne(() => ÉtablissementTerritorialIdentitéModel, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'numero_finess_etablissement_territorial', referencedColumnName: 'numéroFinessÉtablissementTerritorial' })
  public établissementTerritorial!: ÉtablissementTerritorialIdentitéModel

  @Column({ length: 255, name: 'libelle_activite', type: 'varchar' })
  public libelléActivité!: string

  @Column({ length: 255, name: 'libelle_clientele', type: 'varchar' })
  public libelléClientèle!: string

  @Column({ length: 255, name: 'libelle_discipline_equipement', type: 'varchar' })
  public libelléDisciplineDÉquipement!: string

  @Column({ length: 9, name: 'numero_finess_etablissement_territorial' })
  public numéroFinessÉtablissementTerritorial!: string
}
