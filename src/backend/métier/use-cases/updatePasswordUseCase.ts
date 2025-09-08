import { ChangePasswordLoader } from "../gateways/ChangePasswordLoader";

export class UpdatePasswordUseCase {
    constructor(private readonly changePasswordLoader: ChangePasswordLoader) { }

    async exécute(email: string, password: string, oldPassword: string): Promise<string> {
        return this.changePasswordLoader.updatePassword(email, password, oldPassword);
    }
}