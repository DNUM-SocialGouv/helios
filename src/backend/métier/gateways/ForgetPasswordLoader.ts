export interface ForgetPasswordLoader {
  forgetPassword(email: string): Promise<object | null>;
}
