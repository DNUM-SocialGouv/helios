import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm'

import { ÉtablissementTerritorialIdentitéModel } from './ÉtablissementTerritorialIdentitéModel'

@Entity({ name: 'capacite_autorisation_sanitaire' })
export class CapacitéAutorisationSanitaireModel {
  @ManyToOne(() => ÉtablissementTerritorialIdentitéModel, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'numero_finess_etablissement_territorial', referencedColumnName: 'numéroFinessÉtablissementTerritorial' })
  public établissementTerritorial!: ÉtablissementTerritorialIdentitéModel

  @Column({ name: 'nombre_lits_chirurgie', nullable: true, type: 'float' })
  public nombreDeLitsEnChirurgie!: number | null

  @Column({ name: 'nombre_lits_médecine', nullable: true, type: 'float' })
  public nombreDeLitsEnMédecine!: number | null

  @Column({ name: 'nombre_lits_obstétrique', nullable: true, type: 'float' })
  public nombreDeLitsEnObstétrique!: number | null

  @Column({ name: 'nombre_lits_ssr', nullable: true, type: 'float' })
  public nombreDeLitsEnSsr!: number | null

  @Column({ name: 'nombre_places_chirurgie', nullable: true, type: 'float' })
  public nombreDePlacesEnChirurgie!: number | null

  @Column({ name: 'nombre_places_médecine', nullable: true, type: 'float' })
  public nombreDePlacesEnMédecine!: number | null

  @Column({ name: 'nombre_places_obstétrique', nullable: true, type: 'float' })
  public nombreDePlacesEnObstétrique!: number | null

  @Column({ name: 'nombre_places_ssr', nullable: true, type: 'float' })
  public nombreDePlacesEnSsr!: number | null

  @PrimaryColumn({ length: 9, name: 'numero_finess_etablissement_territorial' })
  public numéroFinessÉtablissementTerritorial!: string
}
