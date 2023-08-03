export interface ChangePasswordLoader {
  changePassword(loginToken: string, password: string): Promise<string>;
  updatePassword(email: string, password: string, oldPassword: string): Promise<string>;
}