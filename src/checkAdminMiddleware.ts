import { NextApiRequest, NextApiResponse } from 'next';

import { checkIfAdminEndpoint } from './backend/infrastructure/controllers/checkIfAdminEndpoint';
import { dependencies } from "./backend/infrastructure/dependencies";

export async function checkAdminRole(req: NextApiRequest, res: NextApiResponse): Promise<boolean> {
    let userId = "";
    if (req.method === "GET") {
        userId = req.query["userId"] as string;
    } else {
        userId = req.body.userId;
    }

    const isAdmin = await checkIfAdminEndpoint(dependencies, userId);

    if (isAdmin) {
        return true;
    } else {
        res.status(401).json({ error: 'Non autorisé' });
        return false;
    }
}