import Head from "next/head";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";

import { PageCgu } from "../frontend/ui/cgu/PageCgu";
import { useDependencies } from "../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../frontend/ui/commun/hooks/useBreadcrumb";

export default function ValiderCgu() {
  const { wording } = useDependencies();
  const router = useRouter();
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
            await fetch("/api/utilisateurs/cgu", {
              body: JSON.stringify({ accepted: true }),
              headers: { "Content-Type": "application/json" },
              method: "POST",
            });
            await update({ cgu: true });
            await router.replace("/");
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
