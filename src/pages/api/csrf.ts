import { generateCsrfToken } from "../../lib/csrf";
import type { NextApiRequest, NextApiResponse } from "next";


export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  const csrfToken = generateCsrfToken();

  res.status(200).json({ csrfToken });
}