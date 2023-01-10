import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity({ name: 'ressources_humaines_medico_social' })
export class RessourcesHumainesMédicoSocialModel {
  @PrimaryColumn({ name: 'annee', type: 'int' })
  public année!: number

  @Column({ name: 'nombre_cdd_remplacement', nullable: true, type: 'float' })
  public nombreDeCddDeRemplacement!: number | null

  @Column({ name: 'nombre_etp_realises', nullable: true, type: 'float' })
  public nombreDEtpRéalisés!: number | null

  @PrimaryColumn({ length: 9, name: 'numero_finess_etablissement_territorial' })
  public numéroFinessÉtablissementTerritorial!: string

  @Column({ name: 'taux_absenteisme_maladie_courte_duree', nullable: true, type: 'float' })
  public tauxDAbsentéismePourMaladieCourteDurée!: number | null

  @Column({ name: 'taux_absenteisme_maladie_moyenne_duree', nullable: true, type: 'float' })
  public tauxDAbsentéismePourMaladieMoyenneDurée!: number | null

  @Column({ name: 'taux_absenteisme_maladie_longue_duree', nullable: true, type: 'float' })
  public tauxDAbsentéismePourMaladieLongueDurée!: number | null

  @Column({ name: 'taux_absenteisme_maternite_paternite', nullable: true, type: 'float' })
  public tauxDAbsentéismePourMaternitéPaternité!: number | null

  @Column({ name: 'taux_absenteisme_accident_maladie_professionnelle', type: 'float' })
  public tauxDAbsentéismePourAccidentEtMaladieProfessionelle!: number

  @Column({ name: 'taux_absenteisme_conges_speciaux', nullable: true, type: 'float' })
  public tauxDAbsentéismePourCongésSpéciaux!: number | null

  @Column({ name: 'taux_absenteisme_hors_formation', nullable: true, type: 'float' })
  public tauxDAbsentéismeHorsFormation!: number | null

  @Column({ name: 'taux_etp_vacants', nullable: true, type: 'float' })
  public tauxDEtpVacants!: number | null

  @Column({ name: 'taux_prestation_externes', nullable: true, type: 'float' })
  public tauxDePrestationsExternes!: number | null

  @Column({ name: 'taux_rotation_personnel', nullable: true, type: 'float' })
  public tauxDeRotationDuPersonnel!: number | null
}
