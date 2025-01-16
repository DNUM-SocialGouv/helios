import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn, CreateDateColumn } from "typeorm";

import { UserListModel } from "./UserListModel";

@Entity({ name: "UserList" })
export class UserListEtablissementModel {
    @PrimaryColumn({ name: "list_id" })
    public listId!: number;

    @PrimaryColumn({ name: "numero_finess" })
    public finessNumber!: string;

    @Column({ name: 'type_etablissement' })
    public typeEtablissement!: boolean;

    @CreateDateColumn({ name: "date_creation" })
    public dateCreation!: Date;

    @ManyToOne(() => UserListModel, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'list_id', referencedColumnName: 'listId' })
    public userList!: UserListModel;

}
