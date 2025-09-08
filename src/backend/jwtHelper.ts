import jwt from "jsonwebtoken";

const JWT_SECRET_KEY = process.env["JWT_SECRET_KEY"];

export const checkToken = (token: string): { email: string } | null => {
  try {
    if (JWT_SECRET_KEY) {
      const decoded = jwt.verify(token, JWT_SECRET_KEY) as { email: string };
      return decoded;
    }
    return null;

  } catch (error) { // NOSONAR l’erreur est gérée dans le catch via le « return null ». Aucune autre action à faire ici
    return null;
  }
};

export const generateToken = (payload: string, timeout: string): string | null => {
  if (JWT_SECRET_KEY) {
    return jwt.sign({ email: payload }, JWT_SECRET_KEY, { expiresIn: timeout });
  }
  return null;
};
