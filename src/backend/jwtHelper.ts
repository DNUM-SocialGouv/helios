import jwt, { VerifyErrors } from 'jsonwebtoken';


const JWT_SECRET_KEY = "just a key for test";

export const checkToken = (token: string): { email: string } | null => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET_KEY) as { email: string } ;
        return decoded;
    } catch (error) {
        console.error('Failed to verify JWT:', error as VerifyErrors);
        return null;
      }
};

export const generateToken = (payload : string, timeout : string) :string => {
    return jwt.sign({email : payload}, JWT_SECRET_KEY, { expiresIn:  timeout });
  }

