import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { authOptions } from "./pages/api/auth/[...nextauth]";

export async function checkNationalAdminRole(req: NextApiRequest, res: NextApiResponse): Promise<boolean> {
    const userSession = await getServerSession(req, res, authOptions);

    if (userSession && (userSession?.user?.role === 1)) {
        return true;
    } else {
        res.status(401).json({ error: "Non autorisé" });
        return false;
    }
}