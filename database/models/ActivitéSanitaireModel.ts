import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

import { ÉtablissementTerritorialIdentitéModel } from './ÉtablissementTerritorialIdentitéModel'

@Entity({ name: 'activite_sanitaire' })
export class ActivitéSanitaireModel {
  @PrimaryColumn({ name: 'annee', type: 'int' })
  public année!: number

  @PrimaryColumn({ length: 9, name: 'numero_finess_etablissement_territorial' })
  public numéroFinessÉtablissementTerritorial!: string

  @ManyToOne(() => ÉtablissementTerritorialIdentitéModel, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'numero_finess_etablissement_territorial', referencedColumnName: 'numéroFinessÉtablissementTerritorial' })
  public établissementTerritorial!: ÉtablissementTerritorialIdentitéModel

  @Column({ name: 'nombre_sejours_partiels_medecine', nullable: true, type: 'float' })
  public nombreSéjoursPartielsMédecine!: number

  @Column({ name: 'nombre_sejours_partiels_obstetrique', nullable: true, type: 'float' })
  public NombreSéjoursPartielsObstétrique!: number

  @Column({ name: 'nombre_sejours_partiels_chirurgie', nullable: true, type: 'float' })
  public NombreSéjoursPartielsChirurgie!: number

  @Column({ name: 'nombre_sejours_complets_medecine', nullable: true, type: 'float' })
  public NombreSéjoursCompletsMédecine!: number

  @Column({ name: 'nombre_sejours_complets_obstetrique', nullable: true, type: 'float' })
  public NombreSéjoursCompletsObstétrique!: number

  @Column({ name: 'nombre_sejours_complets_chirurgie', nullable: true, type: 'float' })
  public NombreSéjoursCompletsChirurgie!: number

  @Column({ name: 'nombre_journees_completes_ssr', nullable: true, type: 'float' })
  public NombreJournéesCompletesSsr!: number

  @Column({ name: 'nombre_journees_partiels_ssr', nullable: true, type: 'float' })
  public NombreJournéesPartielsSsr!: number

  @Column({ name: 'nombre_journees_complete_psy', nullable: true, type: 'float' })
  public NombreJournéesCompletePsy!: number

  @Column({ name: 'nombre_journées_partielles_psy', nullable: true, type: 'float' })
  public NombreJournéesPartiellesPsy!: number

}
