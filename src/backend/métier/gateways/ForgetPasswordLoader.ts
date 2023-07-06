export interface ForgetPasswordLoader {
    forgetPassword(email: string): Promise<Object>;
    test() :any;
}
