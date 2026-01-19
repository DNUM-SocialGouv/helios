import Head from "next/head";

import { useDependencies } from "../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../frontend/ui/commun/hooks/useBreadcrumb";
import { ProfilePage } from "../frontend/ui/profile/ProfilePage";

export default function Profile() {
  const { wording } = useDependencies();
  useBreadcrumb([
    {
      label: wording.MON_COMPTE,
      path: "",
    },
  ]);

  return (
    <main className="fr-container" id="content">
      <Head>
        <title>{wording.MON_COMPTE}</title>
      </Head>
      <ProfilePage />
    </main>
  );
}
