import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

import { ÉtablissementTerritorialIdentitéModel } from './ÉtablissementTerritorialIdentitéModel'

@Entity({ name: 'activitéMédicoSocial' })
export class ActivitéMédicoSocialModel {
  @PrimaryColumn({ name: 'année', type: 'int' })
  public année!: number

  @ManyToOne(() => ÉtablissementTerritorialIdentitéModel, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'numérofinessÉtablissementterritorial', referencedColumnName: 'numérofinessÉtablissementterritorial' })
  @PrimaryColumn({ length: 9, name: 'numérofinessÉtablissementterritorial' })
  public numéroFinessÉtablissementTerritorial!: string

  @Column({ name: 'tauxOccupationAccueilDeJour', nullable: true, type: 'float' })
  public tauxOccupationAccueilDeJour!: number

  @Column({ name: 'tauxOccupationHébergementTemporaire', nullable: true, type: 'float' })
  public tauxOccupationHébergementTemporaire!: number

  @Column({ name: 'tauxOccupationHébergementPermanent', nullable: true, type: 'float' })
  public tauxOccupationHébergementPermanent!: number

  @Column({ name: 'tauxRéalisationActivité', nullable: true, type: 'float' })
  public tauxRéalisationActivité!: number

  @Column({ name: 'fileActivePersonnesAccompagnées', nullable: true, type: 'float' })
  public fileActivePersonnesAccompagnées!: number

  @Column({ name: 'nombreMoyenJournéesAbsencePersonnesAccompagnées', nullable: true, type: 'float' })
  public nombreMoyenJournéesAbsencePersonnesAccompagnées!: number

  @Column({ name: 'duréeMoyenneSéjourAccompagnementPersonnesSorties', nullable: true, type: 'float' })
  public duréeMoyenneSéjourAccompagnementPersonnesSorties!: number
}
