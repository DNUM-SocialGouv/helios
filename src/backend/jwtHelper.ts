import jwt from 'jsonwebtoken';


const JWT_SECRET_KEY = process.env['JWT_SECRET_KEY'] as string;

export const checkToken = (token: string): { email: string } | null => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET_KEY) as { email: string } ;
        return decoded;
    } catch (error) {
        return null;
      }
};

export const generateToken = (payload : string, timeout : string) :string => {
    return jwt.sign({email : payload}, JWT_SECRET_KEY, { expiresIn:  timeout });
  }

