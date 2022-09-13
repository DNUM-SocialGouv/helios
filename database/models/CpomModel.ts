import { Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm'

import { ÉtablissementTerritorialIdentitéModel } from './ÉtablissementTerritorialIdentitéModel'

@Entity({ name: 'cpom' })
export class CpomModel {
  @PrimaryColumn({ name: 'numero_finess_etablissement_territorial', type: 'string' })
  public numero_finess_etablissement_territorial!: string

  @OneToOne(() => ÉtablissementTerritorialIdentitéModel)
  @JoinColumn({ name: 'numero_finess_etablissement_territorial' })
  public etablissement_territorial!: ÉtablissementTerritorialIdentitéModel
}
