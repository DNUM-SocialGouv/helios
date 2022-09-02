import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm'

import { ÉtablissementTerritorialIdentitéModel } from './ÉtablissementTerritorialIdentitéModel'

@Entity({ name: 'capacite_autorisation_sanitaire' })
export class CapacitéAutorisationSanitaireModel {
  @ManyToOne(() => ÉtablissementTerritorialIdentitéModel, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'numero_finess_etablissement_territorial', referencedColumnName: 'numéroFinessÉtablissementTerritorial' })
  public établissementTerritorial!: ÉtablissementTerritorialIdentitéModel

  @Column({ name: 'nombre_lits_chirurgie', nullable: true, type: 'integer' })
  public nombreDeLitsEnChirurgie!: number | null

  @Column({ name: 'nombre_lits_médecine', nullable: true, type: 'integer' })
  public nombreDeLitsEnMédecine!: number | null

  @Column({ name: 'nombre_lits_obstétrique', nullable: true, type: 'integer' })
  public nombreDeLitsEnObstétrique!: number | null

  @Column({ name: 'nombre_lits_ssr', nullable: true, type: 'integer' })
  public nombreDeLitsEnSsr!: number | null

  @Column({ name: 'nombre_places_chirurgie', nullable: true, type: 'integer' })
  public nombreDePlacesEnChirurgie!: number | null

  @Column({ name: 'nombre_places_médecine', nullable: true, type: 'integer' })
  public nombreDePlacesEnMédecine!: number | null

  @Column({ name: 'nombre_places_obstétrique', nullable: true, type: 'integer' })
  public nombreDePlacesEnObstétrique!: number | null

  @Column({ name: 'nombre_places_ssr', nullable: true, type: 'integer' })
  public nombreDePlacesEnSsr!: number | null

  @PrimaryColumn({ length: 9, name: 'numero_finess_etablissement_territorial' })
  public numéroFinessÉtablissementTerritorial!: string
}
