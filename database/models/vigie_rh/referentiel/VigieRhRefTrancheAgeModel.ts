import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("referentiel_tranche_age_vigierh")
export class VigieRhRefTrancheAgeModel {
    @PrimaryColumn({ type: "int", name: "code_tranche_age" })
    public codeTrancheAge!: number;

    @Column({ type: "varchar", length: 20, nullable: true, name: "tranche_age" })
    public trancheAge!: string | null;
}