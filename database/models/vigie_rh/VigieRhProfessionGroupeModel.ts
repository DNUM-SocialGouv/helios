import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";

import { VigieRhRefMasqueModel } from "./referentiel/VigieRhRefMasqueModel";
import { VigieRhRefProfessionGroupeModel } from "./referentiel/VigieRhRefProfessionGroupeModel";
import { VigieRhRefQualiteModel } from "./referentiel/VigieRhRefQualiteModel";
import { VigieRhRefRedressementModel } from "./referentiel/VigieRhRefRedressementModel";

@Entity("vigierh_profession_groupe")
export class VigieRhProfessionGroupeModel {
  @PrimaryColumn({ type: "varchar", length: 9, name: "numero_finess" })
  public numeroFiness!: string;

  @PrimaryColumn({ type: "int", name: "annee" })
  public annee!: number;

  @PrimaryColumn({ type: "int", name: "mois" })
  public mois!: number;

  @ManyToOne(() => VigieRhRefProfessionGroupeModel, { eager: true })
  @JoinColumn({ name: "profession_code", referencedColumnName: "code" })
  public readonly profession!: VigieRhRefProfessionGroupeModel;

  @Column({ type: "int", nullable: true, name: "effectif" })
  public effectif!: number | null;

  @ManyToOne(() => VigieRhRefQualiteModel, { eager: true, nullable: true })
  @JoinColumn({ name: "indic_qualite_effectif_code", referencedColumnName: "code" })
  public readonly indicQualiteEffectif!: VigieRhRefQualiteModel | null;

  @ManyToOne(() => VigieRhRefRedressementModel, { eager: true, nullable: true })
  @JoinColumn({ name: "indic_redressement_effectif_code", referencedColumnName: "code" })
  public readonly indicRedressementEffectif!: VigieRhRefRedressementModel | null;

  @ManyToOne(() => VigieRhRefMasqueModel, { eager: true, nullable: true })
  @JoinColumn({ name: "indic_masque_secret_effectif_code", referencedColumnName: "code" })
  public readonly indicMasqueSecretEffectif!: VigieRhRefMasqueModel | null;

  @Column({ type: "date", default: () => "CURRENT_DATE", name: "dt_creation" })
  public dtCreation!: Date;
}