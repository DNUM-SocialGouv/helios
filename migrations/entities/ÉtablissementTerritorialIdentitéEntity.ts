import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm'

import { EntitéJuridiqueEntity } from './EntitéJuridiqueEntity'

@Entity({ name: 'Établissementterritorialidentité' })
export class ÉtablissementTerritorialIdentitéEntity {
  @Column({ length: 255, name: 'adresseacheminement' })
  public adresseAcheminement!: string

  @Column({ length: 5, name: 'adressenumérovoie' })
  public adresseNuméroVoie!: string

  @Column({ length: 4, name: 'adressetypevoie' })
  public adresseTypeVoie!: string

  @Column({ length: 255, name: 'adressevoie' })
  public adresseVoie!: string

  @Column({ length: 3, name: 'catégorieÉtablissement' })
  public catégorieÉtablissement!: string

  @Column({ length: 255, name: 'courriel' })
  public courriel!: string

  @ManyToOne(() => EntitéJuridiqueEntity, (entitéJuridiqueEntity) => entitéJuridiqueEntity.établissementTerritorialIdentitéEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'numérofinessentitéjuridique', referencedColumnName: 'numéroFinessEntitéJuridique' })
  public numéroFinessEntitéJuridique!: EntitéJuridiqueEntity

  @Column({ length: 9, name: 'numérofinessÉtablissementprincipal' })
  public numéroFinessÉtablissementPrincipal!: string

  @PrimaryColumn({ length: 9, name: 'numérofinessÉtablissementterritorial' })
  public numéroFinessÉtablissementTerritorial!: string

  @Column({ length: 255, name: 'raisonsociale' })
  public raisonSociale!: string

  @Column({ length: 10, name: 'téléphone' })
  public téléphone!: string

  @Column({ length: 1, name: 'typeÉtablissement' })
  public typeÉtablissement!: string
}
