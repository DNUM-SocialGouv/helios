import { GetServerSidePropsContext, GetStaticPropsResult } from "next";
import { getSession } from "next-auth/react";

import { checkPasswordStatusEndpoint } from "../backend/infrastructure/controllers/checkPasswordStatusEndpoint";
import { dependencies } from "../backend/infrastructure/dependencies";
import { PasswordStatus } from "../backend/métier/entities/Utilisateur/RésultatLogin";
import { useBreadcrumb } from "../frontend/ui/commun/hooks/useBreadcrumb";
import { PageRecherche } from "../frontend/ui/home/PageRecherche";


type RouterProps = Readonly<{ passwordStatus: PasswordStatus }>;

export default function Router({ passwordStatus }: RouterProps) {
  useBreadcrumb([]);

  return <PageRecherche passwordStatus={passwordStatus} />;
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<GetStaticPropsResult<RouterProps>> {
  const session = await getSession(context);
  const email = session?.user.email as string;
  const passwordStatus = await checkPasswordStatusEndpoint(dependencies, email);

  return {
    props: { passwordStatus },
  };
}
