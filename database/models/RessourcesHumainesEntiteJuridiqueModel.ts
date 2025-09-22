import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "ressources_humaines_entite_juridique" })
export class RessourcesHumainesEntiteJuridiqueModel {

  @PrimaryColumn({ name: "annee", type: "int" })
  public annee!: number;

  @PrimaryColumn({ length: 9, name: "numero_finess_entite_juridique" })
  public numeroFinessEntiteJuridique!: string;

  @Column({ name: "nombre_etp_pm", nullable: true, type: "float" })
  public nombreEtpPm!: number | null;

  @Column({ name: "nombre_etp_pnm", nullable: true, type: "float" })
  public nombreEtpPnm!: number | null;

  @Column({ name: "depenses_interim_pm", nullable: true, type: "float" })
  public depensesInterimPm!: number | null;

  @Column({ name: "jours_absenteisme_pm", nullable: true, type: "float" })
  public joursAbsenteismePm!: number | null;

  @Column({ name: "jours_absenteisme_pnm", nullable: true, type: "float" })
  public joursAbsenteismePnm!: number | null;

}
