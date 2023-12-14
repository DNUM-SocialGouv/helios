export interface ChangePasswordLoader {
  updatePassword(email: string, password: string, oldPassword: string): Promise<string>;
}