import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity({ name: 'entite_juridique' })
export class EntitéJuridiqueModel {
  @Column({ length: 255, name: 'adresse_acheminement' })
  public adresseAcheminement!: string

  @Column({ length: 5, name: 'adresse_numero_voie' })
  public adresseNuméroVoie!: string

  @Column({ length: 4, name: 'adresse_type_voie' })
  public adresseTypeVoie!: string

  @Column({ length: 255, name: 'adresse_voie' })
  public adresseVoie!: string

  @Column({ length: 255, name: 'libelle_statut_juridique' })
  public libelléStatutJuridique!: string

  @PrimaryColumn({ length: 9, name: 'numero_finess_entite_juridique' })
  public numéroFinessEntitéJuridique!: string

  @Column({ length: 255, name: 'raison_sociale' })
  public raisonSociale!: string

  @Column({ length: 10, name: 'telephone' })
  public téléphone!: string

}
