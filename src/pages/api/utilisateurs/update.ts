/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { getUserByCodeEndpoint } from "../../../backend/infrastructure/controllers/getUserByCodeEndpoint";
import { updateUserEndpoint } from "../../../backend/infrastructure/controllers/updateUserEndpoint";
import { dependencies } from "../../../backend/infrastructure/dependencies";
import { checkAdminRole } from "../../../checkAdminMiddleware";
import { Role, RoleLabel } from "../../../commons/Role";
import { authOptions } from "../auth/[...nextauth]";

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  try {
    if (request.method !== "POST") {
      response.status(405).send("Method not allowed");
    }
    const { userCode, roleCode, institutionCode, profilsCode, firstname, lastname } = request.body;

    const userBeforeChange = await getUserByCodeEndpoint(dependencies, userCode);

    if (userBeforeChange) {
      const userSession = await getServerSession(request, response, authOptions);

      if (
        // Un admin central n’a aucun droit sur ce endpoint
        (userSession?.user?.role as number) === Role.ADMIN_CENTR ||
        // Un utilisateur n’a aucun droit sur ce endpoint
        (userSession?.user?.role as number) === Role.USER ||
        // Seul admin national peut se mettre à jour lui même
        (userSession?.user?.idUser === userCode && userSession?.user?.role !== Role.ADMIN_NAT) ||
        // Un admin regional ne peut pas mettre à jour un admin national ou un admin central
        ((userSession?.user?.role as number) === Role.ADMIN_REG && (Number.parseInt(userBeforeChange.roleId) === Role.ADMIN_NAT || Number.parseInt(userBeforeChange.roleId) === Role.ADMIN_CENTR)) ||
        // Un admin régional ne peut pas attribuer le rôle d'admin national ou d'admin central
        (userSession?.user?.role as number) === Role.ADMIN_REG && (roleCode === RoleLabel.ADMIN_NAT || roleCode === RoleLabel.ADMIN_CENTR) ||
        // Un admin régional ne peut pas attribuer une institution nationale ou centrale, mais la mise à jour n’est pas bloquée si l’institution n’est pas modifiée
        (userSession?.user?.role as number) === Role.ADMIN_REG && (institutionCode === "SCN" || institutionCode === "ADMIN_CENTR") && institutionCode !== userBeforeChange.institution?.code
      ) {
        return response.status(403).send("Forbidden");
      }

      const recherche = await updateUserEndpoint(dependencies, userCode, roleCode, institutionCode, profilsCode, firstname, lastname);

      dependencies.logger.audit(`${userSession?.user?.email}: Modification de l'utilisateur "${userBeforeChange.email}"`);

      return response.status(200).json(recherche);
    } else {
      response.status(404).send("User not found");
    }
  } catch {
    return response.status(500);
  }
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (await checkAdminRole(req, res)) {
    await handler(req, res);
  }
};
