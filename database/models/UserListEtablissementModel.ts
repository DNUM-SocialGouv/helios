import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn, CreateDateColumn } from "typeorm";

import { UserListModel } from "./UserListModel";

@Entity({ name: "user_list_etablissement" })
export class UserListEtablissementModel {
    @PrimaryColumn({ name: "list_id" })
    public listId!: number;

    @PrimaryColumn({ name: "numero_finess" })
    public finessNumber!: string;

    @Column({ name: 'type_etablissement' })
    public typeEtablissement!: string;

    @CreateDateColumn({ name: "date_creation" })
    public dateCreation!: Date;

    @ManyToOne(() => UserListModel, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'list_id', referencedColumnName: 'id' })
    public userList!: UserListModel;

}
