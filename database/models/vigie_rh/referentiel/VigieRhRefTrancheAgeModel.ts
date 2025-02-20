import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("vigierh_referentiel_tranche_age")
export class VigieRhRefTrancheAgeModel {
    @PrimaryColumn({ type: "int", name: "code_tranche_age" })
    public codeTrancheAge!: number;

    @Column({ type: "varchar", length: 20, nullable: true, name: "tranche_age" })
    public trancheAge!: string | null;
}