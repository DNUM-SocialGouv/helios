import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity({ name: 'entitéjuridique' })
export class EntitéJuridiqueModel {
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

}
