import { NextApiRequest, NextApiResponse } from "next";

import { getUserSessionBack } from "./frontend/utils/getUserSessionBack";

export async function checkAdminRole(req: NextApiRequest, res: NextApiResponse): Promise<boolean> {
  const userSession = await getUserSessionBack(req);

  // eslint-disable-next-line no-console
  console.log('userSession', userSession, userSession?.user, userSession?.user?.role, (userSession?.user?.role === 1 || userSession?.user?.role === 2));

  if (userSession && (userSession?.user?.role === 1 || userSession?.user?.role === 2)) {
    // eslint-disable-next-line no-console
    console.log('it is admin');
    return true;
  } else {
    // eslint-disable-next-line no-console
    console.log('it is not admin');
    res.status(401).json({ error: "Non autorisé" });
    return false;
  }
}
