import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

import { ÉtablissementTerritorialIdentitéModel } from './ÉtablissementTerritorialIdentitéModel'

@Entity({ name: 'autre_activite_sanitaire' })
export class AutreActivitéSanitaireModel {
  @PrimaryColumn({ length: 2, name: 'activite' })
  public activité!: string

  @Column({ name: 'date_autorisation', type: 'date' })
  public dateAutorisation!: string

  @Column({ name: 'date_fin', type: 'date' })
  public dateFin!: string

  @Column({ name: 'date_mise_en_oeuvre', type: 'date' })
  public dateMiseEnOeuvre!: string

  @ManyToOne(() => ÉtablissementTerritorialIdentitéModel, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'numero_finess_etablissement_territorial', referencedColumnName: 'numéroFinessÉtablissementTerritorial' })
  public établissementTerritorial!: ÉtablissementTerritorialIdentitéModel

  @PrimaryColumn({ length: 2, name: 'forme' })
  public forme!: string

  @Column({ length: 255, name: 'libelle_activite' })
  public libelléActivité!: string

  @Column({ length: 255, name: 'libelle_forme' })
  public libelléForme!: string

  @Column({ length: 255, name: 'libelle_modalite' })
  public libelléModalité!: string

  @PrimaryColumn({ length: 2, name: 'modalite' })
  public modalité!: string

  @PrimaryColumn({ length: 9, name: 'numero_finess_etablissement_territorial' })
  public numéroFinessÉtablissementTerritorial!: string
}
