export class UserListViewModel {
    public id!: number;
    public nom!: string;
    public isFavoris!: boolean;
    public dateCreation!: Date;
    public userListEtablissements!: UserListEtablissementViewModel[];
}

export class UserListEtablissementViewModel {
    public finessNumber!: string;
    public dateCreation!: Date;
}