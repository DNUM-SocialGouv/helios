import Head from "next/head";

import { useDependencies } from "../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../frontend/ui/commun/hooks/useBreadcrumb";

export default function Accessibilité() {
  const { wording } = useDependencies();
  useBreadcrumb([
    {
      label: wording.ACCESSIBILITÉ,
      path: "",
    },
  ]);

  return (
    <main className="fr-container">
      <Head>
        <title>{wording.TITRE_PAGE_ACCESSIBILITÉ}</title>
      </Head>
      <h1>{`${wording.ACCESSIBILITÉ} : ${wording.NON_CONFORME}`}</h1>
      <p>{wording.AUDIT_EN_COURS}</p>
    </main>
  );
}
