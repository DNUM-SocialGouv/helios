import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

import { ÉtablissementTerritorialIdentitéModel } from './ÉtablissementTerritorialIdentitéModel'

@Entity({ name: 'activitémédicosocial' })
export class ActivitéMédicoSocialModel {
  @PrimaryColumn({ name: 'année', type: 'int' })
  public année!: number

  @PrimaryColumn({ length: 9, name: 'numerofiness' })
  public numéroFinessÉtablissementTerritorial!: string

  @ManyToOne(() => ÉtablissementTerritorialIdentitéModel, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'numerofiness', referencedColumnName: 'numéroFinessÉtablissementTerritorial' })
  public établissementTerritorial!: ÉtablissementTerritorialIdentitéModel

  @Column({ name: 'tauxoccupationaccueildejour', nullable: true, type: 'float' })
  public tauxOccupationAccueilDeJour!: number

  @Column({ name: 'tauxoccupationhebergementtemporaire', nullable: true, type: 'float' })
  public tauxOccupationHébergementTemporaire!: number

  @Column({ name: 'tauxoccupationhebergementpermanent', nullable: true, type: 'float' })
  public tauxOccupationHébergementPermanent!: number

  @Column({ name: 'tauxréalisationactivité', nullable: true, type: 'float' })
  public tauxRéalisationActivité!: number

  @Column({ name: 'fileactivepersonnesaccompagnées', nullable: true, type: 'float' })
  public fileActivePersonnesAccompagnées!: number

  @Column({ name: 'nombremoyenjournéesabsencepersonnesaccompagnées', nullable: true, type: 'float' })
  public nombreMoyenJournéesAbsencePersonnesAccompagnées!: number

  @Column({ name: 'duréemoyenneséjouraccompagnementpersonnessorties', nullable: true, type: 'float' })
  public duréeMoyenneSéjourAccompagnementPersonnesSorties!: number
}
