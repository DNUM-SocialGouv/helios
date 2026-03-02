import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { Role } from "./commons/Role";
import { authOptions } from "./pages/api/auth/[...nextauth]";

export async function checkAdminRole(req: NextApiRequest, res: NextApiResponse): Promise<boolean> {
  const userSession = await getServerSession(req, res, authOptions);

  if (userSession && (userSession?.user?.role === Role.ADMIN_NAT || userSession?.user?.role === Role.ADMIN_REG)) {
    return true;
  } else {
    res.status(401).json({ error: "Non autorisé" });
    return false;
  }
}
