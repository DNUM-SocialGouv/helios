import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm'

import { DomaineÉtablissementTerritorial } from '../../datacrawler/legacy/métier/entities/DomaineÉtablissementTerritorial'
import { EntitéJuridiqueModel } from './EntitéJuridiqueModel'

@Entity({ name: 'etablissement_territorial' })
export class ÉtablissementTerritorialIdentitéModel {
  @Column({ length: 255, name: 'adresse_acheminement' })
  public adresseAcheminement!: string

  @Column({ length: 5, name: 'adresse_numero_voie' })
  public adresseNuméroVoie!: string

  @Column({ length: 4, name: 'adresse_type_voie' })
  public adresseTypeVoie!: string

  @Column({ length: 255, name: 'adresse_voie' })
  public adresseVoie!: string

  @Column({ length: 3, name: 'cat_etablissement' })
  public catégorieÉtablissement!: string

  @Column({ length: 255, name: 'commune' })
  public commune!: string

  @Column({ length: 255, name: 'courriel' })
  public courriel!: string

  @Column({ length: 255, name: 'departement' })
  public département!: string

  @Column({
    enum: DomaineÉtablissementTerritorial,
    enumName: 'domaine_et',
    type: 'enum',
  })
  public domaine!: DomaineÉtablissementTerritorial

  @ManyToOne(() => EntitéJuridiqueModel, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'numero_finess_entite_juridique', referencedColumnName: 'numéroFinessEntitéJuridique' })
  public entitéJuridique!: EntitéJuridiqueModel

  @Column({ length: 255, name: 'libelle_categorie_etablissement' })
  public libelléCatégorieÉtablissement!: string

  @Column({ length: 9, name: 'numero_finess_entite_juridique' })
  public numéroFinessEntitéJuridique!: string

  @Column({ length: 9, name: 'numero_finess_etablissement_principal' })
  public numéroFinessÉtablissementPrincipal!: string

  @PrimaryColumn({ length: 9, name: 'numero_finess_etablissement_territorial' })
  public numéroFinessÉtablissementTerritorial!: string

  @Column({ length: 255, name: 'raison_sociale' })
  public raisonSociale!: string

  @Column({ length: 10, name: 'telephone' })
  public téléphone!: string

  @Column({ length: 1, name: 'type_etablissement' })
  public typeÉtablissement!: string
}
