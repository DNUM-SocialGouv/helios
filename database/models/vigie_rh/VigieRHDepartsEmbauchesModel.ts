import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("vigierh_mouvements")
export class VigieRhDepartsEmbauchesModel {
  @PrimaryColumn({ type: "varchar", length: 9, name: "numero_finess_etablissement_territorial" })
  public numeroFinessET!: string;

  @PrimaryColumn({ type: "int", name: "annee" })
  public annee!: number;

  @Column({ type: "int", nullable: true, name: "nouveaux_contrats" })
  public embauche!: number;

  @Column({ type: "int", nullable: true, name: "fins_contrats" })
  public depart!: number;

  @Column({ type: "int", nullable: true, name: "nouveaux_contrats_ref" })
  public embaucheRef!: number;

  @Column({ type: "int", nullable: true, name: "fins_contrats_ref" })
  public departRef!: number;
}
