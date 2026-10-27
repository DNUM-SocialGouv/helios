import Head from "next/head";

import { PageCgu } from "../frontend/ui/cgu/PageCgu";
import { useDependencies } from "../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../frontend/ui/commun/hooks/useBreadcrumb";

export default function Cgu() {
  const { wording } = useDependencies();

  useBreadcrumb([
    {
      label: wording.CGU,
      path: "",
    },
  ]);

  return (
    <main className="fr-container" id="content">
      <Head>
        <title>{wording.TITRE_PAGE_CGU}</title>
      </Head>
      <PageCgu />
    </main>
  );
}
