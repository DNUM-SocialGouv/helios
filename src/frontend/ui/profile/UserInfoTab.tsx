import { useSession } from "next-auth/react";

import styles from "./Profile.module.css";
import { useDependencies } from "../commun/contexts/useDependencies";


export const UserInfoTab = () => {

  const { wording } = useDependencies();
  const { data } = useSession();

  return (
    <div className="fr-grid-row fr-mt-5w">
      <h1 className={styles["title"]}>{wording.USER_PROFILE}</h1>
      <section className="fr-col-11 fr-mt-5w fr-ml-8w">
        <div className="fr-mt-4w">
          <label className="fr-label" htmlFor="firstname">{wording.FIRSTNAME}</label>
          <input className="fr-input" id="firstname" readOnly type="text" value={data?.user?.firstname || ""} />
        </div>
        <div className="fr-mt-4w">
          <label className="fr-label" htmlFor="lastName">{wording.LASTNAME}</label>
          <input className="fr-input" id="lastName" readOnly type="text" value={data?.user?.name || ""} />
        </div>
        <div className="fr-mt-4w">
          <label className="fr-label" htmlFor="email">{wording.EMAIL}</label>
          <input className="fr-input" id="email" readOnly type="text" value={data?.user?.email || ""} />
        </div>
        <div className="fr-mt-4w">
          <label className="fr-label" htmlFor="organization">{wording.ORGANIZATION}</label>
          <input className="fr-input" id="organization" readOnly type="text" value={data?.user?.institution || ""} />
        </div>
        <fieldset className="fr-fieldset fr-mt-4w">
          <legend className="fr-fieldset__legend--regular fr-fieldset__legend">{wording.ROLE}</legend>
          <div className="fr-fieldset__element">
            <input checked={data?.user?.role === 1} id="superAdmin" readOnly type="checkbox" value={wording.SUPER_ADMIN} />
            <label htmlFor="superAdmin"> {wording.SUPER_ADMIN}</label>
          </div>
          <div className="fr-fieldset__element">
            <input checked={data?.user?.role === 2} id="adminRegional" readOnly type="checkbox" value={wording.ADMIN_REGIONAL} />
            <label htmlFor="adminRegional"> {wording.ADMIN_REGIONAL}</label>
          </div>
          <div className="fr-fieldset__element">
            <input checked={data?.user?.role === 4} id="adminCentrale" readOnly type="checkbox" value={wording.ADMINISTRATION_CENTRALE} />
            <label htmlFor="adminCentrale"> {wording.ADMINISTRATION_CENTRALE}</label>
          </div>
          <div className="fr-fieldset__element">
            <input checked={data?.user?.role === 3} id="user" readOnly type="checkbox" value={wording.USER} />
            <label htmlFor="user" > {wording.USER}</label>
          </div>
        </fieldset>
      </section>
    </div>
  )
}
