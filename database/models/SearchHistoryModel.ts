import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";

import { UtilisateurModel } from "./UtilisateurModel";

@Entity({ name: "search_history" })
export class SearchHistoryModel {
    @PrimaryGeneratedColumn({ name: "id" })
    public id!: number;

    @Column({ name: "title" })
    public title!: string;

    @Column({ name: "finess_number" })
    public finessNumber!: string;

    @Column({ name: "type" })
    public type!: string;

    @Column({ name: "date" })
    public date!: Date;

    @Column({ name: 'user_id' })
    public userId!: string;

    @ManyToOne(() => UtilisateurModel)
    @JoinColumn({ name: "user_id", referencedColumnName: "id" })
    public user!: UtilisateurModel;

}