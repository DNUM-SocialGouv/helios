import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";

import { VigieRhRefProfessionFiliereModel } from "./referentiel/VigieRhRefProfessionFiliereModel";

@Entity("vigierh_profession_filiere")
export class VigieRhProfessionFiliereModel {
  @PrimaryColumn({ type: "varchar", length: 9, name: "numero_finess" })
  public numeroFiness!: string;

  @PrimaryColumn({ type: "int", name: "annee" })
  public annee!: number;

  @PrimaryColumn({ type: "int", name: "mois" })
  public mois!: number;

  @ManyToOne(() => VigieRhRefProfessionFiliereModel, { eager: true })
  @JoinColumn({ name: "profession_code", referencedColumnName: "code" })
  public readonly profession!: VigieRhRefProfessionFiliereModel;

  @Column({ type: "float", nullable: true, name: "turnover" })
  public turnover!: number | null;

  @Column({ type: "float", nullable: true, name: "taux_entrees" })
  public tauxEntrees!: number | null;

  @Column({ type: "float", nullable: true, name: "taux_sorties" })
  public tauxSorties!: number | null;

  @Column({ type: "int", nullable: true, name: "nombre_entrees" })
  public nombreEntrees!: number | null;

  @Column({ type: "int", nullable: true, name: "nombre_sorties" })
  public nombreSorties!: number | null;

  @Column({ type: "float", nullable: true, name: "region_turnover" })
  public regionTurnover!: number | null;

  @Column({ type: "float", nullable: true, name: "nation_turnover" })
  public nationTurnover!: number | null;

  @Column({ type: "float", nullable: true, name: "groupe_turnover" })
  public groupeTurnover!: number | null;
}
