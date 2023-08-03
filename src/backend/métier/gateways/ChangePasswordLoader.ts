export interface ChangePasswordLoader {
  changePassword(loginToken: string, password: string): Promise<boolean>;
  updatePassword(email: string, password: string, oldPassword: string): Promise<string>;
}