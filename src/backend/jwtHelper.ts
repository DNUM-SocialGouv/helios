import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET_KEY = process.env["JWT_SECRET_KEY"];

export const checkToken = (token: string): { email: string } | null => {
  try {
    if (JWT_SECRET_KEY) {
      const decoded = jwt.verify(token, JWT_SECRET_KEY) as { email: string };
      return decoded;
    }
    return null;

  } catch {
    return null;
  }
};

export const generateToken = (payload: string, timeout: string): string | null => {
  if (JWT_SECRET_KEY) {
    const options: SignOptions = { expiresIn: timeout as unknown as SignOptions["expiresIn"] };
    return jwt.sign({ email: payload }, JWT_SECRET_KEY, options);
  }
  return null;
};
