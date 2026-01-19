import { GetServerSidePropsContext, GetStaticPropsResult } from "next";
import Head from "next/head";
import { getSession } from "next-auth/react";

import { InstitutionModel } from "../../../../database/models/InstitutionModel";
import { ProfilModel } from "../../../../database/models/ProfilModel";
import { RoleModel } from "../../../../database/models/RoleModel";
import { UtilisateurModel } from "../../../../database/models/UtilisateurModel";
import { getAllProfilesEndpoint } from "../../../backend/infrastructure/controllers/getAllProfilesEndpoint";
import { getAllRolesEndpoint } from "../../../backend/infrastructure/controllers/getAllRolesEndpoint";
import { getInstitutionsEndpoint } from "../../../backend/infrastructure/controllers/getInstitutionsEndpoint";
import { getUserByCodeEndpoint } from "../../../backend/infrastructure/controllers/getUserByCodeEndpoint";
import { dependencies } from "../../../backend/infrastructure/dependencies";
import { useDependencies } from "../../../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../../../frontend/ui/commun/hooks/useBreadcrumb";
import { EditUser } from "../../../frontend/ui/parametrage-utilisateurs/EditUser/EditUser";

type RouterProps = Readonly<{
  sessionUser: any;
  user: UtilisateurModel;
  institutions: InstitutionModel[];
  profiles: ProfilModel[];
  roles: RoleModel[];
}>;

export default function Router({ user, institutions, profiles, roles }: RouterProps) {
  const { wording } = useDependencies();

  useBreadcrumb([
    {
      label: wording.PAGE_UTILISATEUR_TITRE,
      path: "/settings/users",
    },
    {
      label: `${user.prenom} ${user.nom}`,
      path: "",
    },
  ]);
  return (
    <main className="fr-container" id="content">
      <Head>
        <title>{wording.PAGE_UTILISATEUR_TITRE} - {user.prenom} {user.nom}</title>
      </Head>
      <EditUser institutions={institutions} profiles={profiles} roles={roles} user={user} />
    </main>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<GetStaticPropsResult<RouterProps>> {
  try {
    const { params } = context;
    const session = await getSession(context);

    // if current user has role 'utilisateur' redirect to page inaccessible
    if (session?.user?.role === 3) {
      return {
        redirect: {
          permanent: false,
          destination: "/inaccessible",
        },
      };
    }

    if (!params) {
      return {
        notFound: true,
      };
    }

    const user = await getUserByCodeEndpoint(dependencies, params['userCode'] as string);

    if (!user) {
      return {
        notFound: true,
      };
    }

    const institutions = await getInstitutionsEndpoint(dependencies);
    const profiles = await getAllProfilesEndpoint(dependencies);
    const roles = await getAllRolesEndpoint(dependencies);

    return {
      props: {
        sessionUser: JSON.parse(JSON.stringify(session?.user)),
        user: JSON.parse(JSON.stringify(user)),
        institutions: JSON.parse(JSON.stringify(institutions)),
        profiles: JSON.parse(JSON.stringify(profiles)),
        roles: JSON.parse(JSON.stringify(roles)),
      },
    };
  } catch (error) {
    throw error;
  }
}
