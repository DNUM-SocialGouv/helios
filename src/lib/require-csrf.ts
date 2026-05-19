import { verifyCsrfToken } from "./csrf";
import type { NextApiRequest, NextApiResponse } from "next";

export function requireCsrf(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const csrfHeader = req.headers["x-csrf-token"];

  const valid = verifyCsrfToken(
    typeof csrfHeader === "string" ? csrfHeader : undefined
  );

  if (!valid) {
    res.status(403).json({
      error: "Invalid CSRF token",
    });

    return false;
  }

  return true;
}