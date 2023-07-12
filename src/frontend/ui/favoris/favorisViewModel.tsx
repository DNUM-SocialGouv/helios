
export class FavorisViewModel {
    public finessNumber: string;
    public type: string;
    public userId: string;

    constructor(favNumber: string, favType: string, favUserId: string) {
        this.finessNumber = favNumber;
        this.type = favType;
        this.userId = favUserId;
    }

}
