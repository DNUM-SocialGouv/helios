import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

import { ÉtablissementTerritorialIdentitéModel } from './ÉtablissementTerritorialIdentitéModel'

@Entity({ name: 'activite_medico_social' })
export class ActivitéMédicoSocialModel {
  @PrimaryColumn({ name: 'annee', type: 'int' })
  public année!: number

  @PrimaryColumn({ length: 9, name: 'numero_finess_etablissement_territorial' })
  public numéroFinessÉtablissementTerritorial!: string

  @ManyToOne(() => ÉtablissementTerritorialIdentitéModel, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'numero_finess_etablissement_territorial', referencedColumnName: 'numéroFinessÉtablissementTerritorial' })
  public établissementTerritorial!: ÉtablissementTerritorialIdentitéModel

  @Column({ name: 'taux_occupation_accueil_de_jour', nullable: true, type: 'float' })
  public tauxOccupationAccueilDeJour!: number

  @Column({ name: 'taux_occupation_en_hebergement_temporaire', nullable: true, type: 'float' })
  public tauxOccupationHébergementTemporaire!: number

  @Column({ name: 'taux_occupation_en_hebergement_permanent', nullable: true, type: 'float' })
  public tauxOccupationHébergementPermanent!: number

  @Column({ name: 'taux_realisation_activite', nullable: true, type: 'float' })
  public tauxRéalisationActivité!: number

  @Column({ name: 'file_active_personnes_accompagnees', nullable: true, type: 'float' })
  public fileActivePersonnesAccompagnées!: number

  @Column({ name: 'nombre_moyen_journees_absence_personnes_accompagnees', nullable: true, type: 'float' })
  public nombreMoyenJournéesAbsencePersonnesAccompagnées!: number

  @Column({ name: 'duree_moyenne_sejour_accompagnement_personnes_sorties', nullable: true, type: 'float' })
  public duréeMoyenneSéjourAccompagnementPersonnesSorties!: number
}
