export interface ChangePasswordLoader {
  changePassword(loginToken: string, password: string): Promise<boolean>;
}