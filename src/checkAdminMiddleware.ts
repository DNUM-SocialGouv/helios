import { NextApiRequest, NextApiResponse } from "next";

import { getUserSessionBack } from "./frontend/utils/getUserSessionBack";

export async function checkAdminRole(req: NextApiRequest, res: NextApiResponse): Promise<boolean> {
  const userSession = await getUserSessionBack(req);

  if (userSession && (userSession?.user?.role === 1 || userSession?.user?.role === 2)) {
    return true;
  } else {
    res.status(401).json({ error: "Non autorisé" });
    return false;
  }
}
