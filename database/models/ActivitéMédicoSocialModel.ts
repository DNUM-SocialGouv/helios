import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'

import { ÉtablissementTerritorialIdentitéModel } from './ÉtablissementTerritorialIdentitéModel'

@Entity({ name: 'activitéMédicoSocial' })
export class ActivitéMédicoSocialModel {
  @Column({ name: 'année', type: 'int' })
  public année!: number

  @ManyToOne(() => ÉtablissementTerritorialIdentitéModel, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'numérofinessÉtablissementterritorial', referencedColumnName: 'numérofinessÉtablissementterritorial' })
  @Column({ length: 9, name: 'numérofinessÉtablissementterritorial' })
  public numéroFinessÉtablissementTerritorial!: string

  @Column({ name: 'tauxDOccupationDesLitsAutorisésEnAccueil', type: 'float' })
  public tauxDOccupationDesLitsAutorisésEnAccueil: number | undefined

  @Column({ name: 'tauxDOccupationDesLitsAutorisésEnHébergementTemporaire', type: 'float' })
  public tauxDOccupationDesLitsAutorisésEnHébergementTemporaire: number | undefined
  @Column({ name: 'tauxDOccupationDesPlacesAutoriséesEnHébergementPermanent', type: 'float' })
  public tauxDOccupationDesPlacesAutoriséesEnHébergementPermanent: number | undefined
}
