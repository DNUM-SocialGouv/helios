import { useSession } from "next-auth/react";

import { useDependencies } from "../commun/contexts/useDependencies";
import styles from "./Profile.module.css";

export const ProfilePage = () => {
  const { wording } = useDependencies();
  const { data } = useSession();

  return (
    <main className="fr-container">
      <div className="fr-grid-row fr-grid-row--center">
        <section className="fr-col-8 fr-mt-5w">
          <h1 className={styles["title"]}>{wording.USER_PROFILE}</h1>
          <div className="fr-mt-4w">
            <label className="fr-label">{wording.FIRSTNAME}</label>
            <input className="fr-input" readOnly type="text" value={data?.user?.firstname || ""} />
          </div>
          <div className="fr-mt-4w">
            <label className="fr-label">{wording.LASTNAME}</label>
            <input className="fr-input" readOnly type="text" value={data?.user?.name || ""} />
          </div>
          <div className="fr-mt-4w">
            <label className="fr-label">{wording.EMAIL}</label>
            <input className="fr-input" readOnly type="text" value={data?.user?.email || ""} />
          </div>
          <div className="fr-mt-4w">
            <label className="fr-label">{wording.ORGANIZATION}</label>
            <input className="fr-input" readOnly type="text" value={data?.user?.institution || ""} />
          </div>
          <fieldset className="fr-fieldset fr-mt-4w">
            <legend className="fr-fieldset__legend--regular fr-fieldset__legend">{wording.ROLE}</legend>
            <div className="fr-fieldset__element">
              <input checked={data?.user?.role === 1} readOnly type="checkbox" value={wording.SUPER_ADMIN} />
              <label> {wording.SUPER_ADMIN}</label>
            </div>
            <div className="fr-fieldset__element">
              <input checked={data?.user?.role === 2} readOnly type="checkbox" value={wording.ADMIN} />
              <label> {wording.ADMIN}</label>
            </div>
            <div className="fr-fieldset__element">
              <input checked={data?.user?.role === 3} readOnly type="checkbox" value={wording.USER} />
              <label> {wording.USER}</label>
            </div>
          </fieldset>
        </section>
      </div>
    </main>
  );
};
