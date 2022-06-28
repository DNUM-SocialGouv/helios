import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

import { ÉtablissementTerritorialIdentitéModel } from './ÉtablissementTerritorialIdentitéModel'

@Entity({ name: 'activitémédicosocial' })
export class ActivitéMédicoSocialModel {
  @PrimaryColumn({ name: 'année', type: 'int' })
  public année!: number

  @PrimaryColumn({ length: 9, name: 'numérofinessÉtablissementterritorial' })
  public numéroFinessÉtablissementTerritorial!: string

  @ManyToOne(() => ÉtablissementTerritorialIdentitéModel, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'numérofinessÉtablissementterritorial', referencedColumnName: 'numéroFinessÉtablissementTerritorial' })
  public établissementTerritorial!: ÉtablissementTerritorialIdentitéModel

  @Column({ name: 'tauxoccupationaccueildejour', nullable: true, type: 'float' })
  public tauxOccupationAccueilDeJour!: number

  @Column({ name: 'tauxoccupationhébergementtemporaire', nullable: true, type: 'float' })
  public tauxOccupationHébergementTemporaire!: number

  @Column({ name: 'tauxoccupationhébergementpermanent', nullable: true, type: 'float' })
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
