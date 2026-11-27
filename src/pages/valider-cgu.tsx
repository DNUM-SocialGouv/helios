import Head from "next/head";
import { signOut, useSession } from "next-auth/react";

import { PageCgu } from "../frontend/ui/cgu/PageCgu";
import { useDependencies } from "../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../frontend/ui/commun/hooks/useBreadcrumb";
import { redirigerVers } from "../frontend/ui/commun/redirection";

export default function ValiderCgu() {
  const { wording } = useDependencies();
  const { update } = useSession();

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
      <div className="fr-btns-group fr-btns-group--inline-md fr-mt-4w">
        <button
          className="fr-btn"
          onClick={async () => {
            const response = await fetch("/api/utilisateurs/cgu", {
              body: JSON.stringify({ accepted: true }),
              headers: { "Content-Type": "application/json" },
              method: "POST",
            });
            if (!response.ok) return;
            await update({ cgu: true });
            redirigerVers("/");
          }}
          type="button"
        >
          Accepter
        </button>
        <button
          className="fr-btn fr-btn--secondary"
          onClick={async () => {
            await signOut({ callbackUrl: "/" });
          }}
          type="button"
        >
          Refuser
        </button>
      </div>
    </main>
  );
}
