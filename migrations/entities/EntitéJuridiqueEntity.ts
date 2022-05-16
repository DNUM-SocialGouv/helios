import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm'

import { ÉtablissementTerritorialIdentitéEntity } from './ÉtablissementTerritorialIdentitéEntity'

@Entity({ name: 'entitéjuridique' })
export class EntitéJuridiqueEntity {
  @Column({ length: 255, name: 'adresseacheminement' })
  public adresseAcheminement!: string

  @Column({ length: 5, name: 'adressenumérovoie' })
  public adresseNuméroVoie!: string

  @Column({ length: 4, name: 'adressetypevoie' })
  public adresseTypeVoie!: string

  @Column({ length: 255, name: 'adressevoie' })
  public adresseVoie!: string

  @Column({ length: 255, name: 'libelléstatutjuridique' })
  public libelléStatutJuridique!: string

  @PrimaryColumn({ length: 9, name: 'numérofinessentitéjuridique' })
  public numéroFinessEntitéJuridique!: string

  @Column({ length: 255, name: 'raisonsociale' })
  public raisonSociale!: string

  @Column({ length: 10, name: 'téléphone' })
  public téléphone!: string

  @OneToMany(
    () => ÉtablissementTerritorialIdentitéEntity,
    (établissementTerritorialIdentitéEntity) => établissementTerritorialIdentitéEntity.numéroFinessEntitéJuridique
  )
  public établissementTerritorialIdentitéEntity!: ÉtablissementTerritorialIdentitéEntity[]
}
