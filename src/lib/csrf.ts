import crypto from "crypto";

const CSRF_SECRET = process.env["CSRF_SECRET"]!;
const TOKEN_EXPIRY_MS = 3600_000; // 1 hour

export function generateCsrfToken(): string {
  const nonce = crypto.randomBytes(32).toString("hex");
  const expires = Date.now() + TOKEN_EXPIRY_MS;
  const payload = `${nonce}.${expires}`;
  const signature = crypto
    .createHmac("sha256", CSRF_SECRET)
    .update(payload)
    .digest("hex");

  return `${payload}.${signature}`;
}

export function verifyCsrfToken(token?: string): boolean {
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [nonce, expires, signature] = parts;
  if (!nonce || !expires || !signature) return false;

  const expiresNum = Number(expires);
  if (Number.isNaN(expiresNum) || Date.now() > expiresNum) return false;

  const payload = `${nonce}.${expires}`;
  const expectedSignature = crypto
    .createHmac("sha256", CSRF_SECRET)
    .update(payload)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature),
    Buffer.from(signature)
  );
}