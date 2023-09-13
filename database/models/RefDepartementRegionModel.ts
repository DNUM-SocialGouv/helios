import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "referentiel_departement_region" })
export class RefDepartementRegionModel {
    @PrimaryGeneratedColumn({ name: "ref_id" })
    public id!: number;

    @Column({ name: "ref_code_dep" })
    public codeDepartement!: string;

    @Column({ name: "ref_libelle_dep" })
    public libelleDepartement!: string;

    @Column({ name: "ref_code_region" })
    public codeRegion!: string;
}
