import Link from "next/link";
import { useState } from "react";
import "@gouvfr/dsfr/dist/component/alert/alert.min.css";

export const PasswordWarnningNotice = ({ daysLeft }: { daysLeft: number }) => {
  const [removeNotice, setRemoveNotice] = useState(false);
  return (
    removeNotice ? null :
      <div className="fr-alert fr-alert--warning fr-mb-1w">
        <p>Votre mot de passe ne sera plus valide dans {daysLeft} jours. Pensez à le modifier <Link href="/mon-compte">en cliquant ici</Link></p>
        <button className="fr-btn--close fr-btn" onClick={() => setRemoveNotice(true)} title="Masquer le message" />
      </div>
  );
};
