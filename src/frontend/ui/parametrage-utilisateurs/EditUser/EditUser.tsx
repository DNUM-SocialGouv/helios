import "@gouvfr/dsfr/dist/component/table/table.min.css";
import "@gouvfr/dsfr/dist/component/pagination/pagination.min.css";
import "@gouvfr/dsfr/dist/component/select/select.min.css";
import "@gouvfr/dsfr/dist/component/checkbox/checkbox.min.css";

import { useRouter } from "next-router-mock";

import { formatDateAndHours } from "../../../utils/dateUtils";
import { useDependencies } from "../../commun/contexts/useDependencies";
import styles from "./EditUser.module.css";

type UsersListPageProps = Readonly<{
  users: any[];
}>;

export const EditUser = ({ user }: UsersListPageProps) => {
  console.log("user ---------data---------", user);
  const { wording } = useDependencies();
  const router = useRouter();
  const { paths } = useDependencies();

  const Roles = ["Admin National", "Admin Regional", "Utilisateur"];
  const Profiles = [
    { profil_label: "Utilisateur lambda", profil_code: "f998021c-9613-4978-be6a-2b4cd9e24ffb" },
    { profil_label: "Equipe projet", profil_code: "4bbf1e31-180a-4d29-9973-54459dc3087d" },
  ];

  const Institutions = [
    { inst_code_geo: "84", inst_libelle: "ARS Auvergne-Rhône-Alpes", inst_code: "ARS_84" },
    { inst_code_geo: "27", inst_libelle: "ARS Bourgogne-Franche-Comté", inst_code: "ARS_27" },
    { inst_code_geo: "53", inst_libelle: "ARS Bretagne", inst_code: "ARS_53" },
    { inst_code_geo: "24", inst_libelle: "ARS Centre-Val de Loire", inst_code: "ARS_24" },
    { inst_code_geo: "94", inst_libelle: "ARS Corse", inst_code: "ARS_94" },
    { inst_code_geo: "44", inst_libelle: "ARS Grand Est", inst_code: "ARS_44" },
    { inst_code_geo: "1", inst_libelle: "ARS Guadeloupe", inst_code: "ARS_01" },
    { inst_code_geo: "3", inst_libelle: "ARS Guyane", inst_code: "ARS_03" },
    { inst_code_geo: "32", inst_libelle: "ARS Hauts-de-France", inst_code: "ARS_32" },
    { inst_code_geo: "11", inst_libelle: "ARS Île-de-France", inst_code: "ARS_11" },
    { inst_code_geo: "4", inst_libelle: "ARS La Réunion", inst_code: "ARS_04" },
    { inst_code_geo: "2", inst_libelle: "ARS Martinique", inst_code: "ARS_02" },
    { inst_code_geo: "6", inst_libelle: "ARS Mayotte", inst_code: "ARS_06" },
    { inst_code_geo: "28", inst_libelle: "ARS Normandie", inst_code: "ARS_28" },
    { inst_code_geo: "75", inst_libelle: "ARS Nouvelle-Aquitaine", inst_code: "ARS_75" },
    { inst_code_geo: "76", inst_libelle: "ARS Occitanie", inst_code: "ARS_76" },
    { inst_code_geo: "52", inst_libelle: "ARS Pays de la Loire", inst_code: "ARS_52" },
    { inst_code_geo: "93", inst_libelle: "ARS Provence-Alpes-Côte d`Azur", inst_code: "ARS_93" },
    { inst_code_geo: "0", inst_libelle: "DNUM (SCN)", inst_code: "SCN" },
    { inst_code_geo: "75", inst_libelle: "CAT-AMANIA", inst_code: "CAT" },
    { inst_code_geo: "44", inst_libelle: "TEST", inst_code: "TEST" },
  ];

  const saveButtonClick = () => {
    /*  updateProfile(userId, codeValue, {
      institution: {
        profilEJ: editableInstitutionEJValues,
        profilMédicoSocial: editableInstitutionETMSValues,
        profilETSanitaire: editableInstitutionETSANValues,
      },
      autreRegion: {
        profilEJ: editableAutreRegionEJValues,
        profilMédicoSocial: editableAutreRegionETMSValues,
        profilETSanitaire: editableAutreRegionETSANValues,
      },
    });*/
  };

  return (
    <main className="fr-container">
      {user && (
        <>
          <h1 className={styles["title"]}>{wording.PAGE_EDIT_UTILISATEUR_TITRE}</h1>
          <br />
          <div>
            <div className={styles["field_container"]}>
              <label className="fr-label">
                <div className={styles["label-field"]}>{wording.LASTNAME} : </div> {user.nom}
              </label>
            </div>
            <div className={styles["field_container"]}>
              <label className="fr-label">
                <div className={styles["label-field"]}>{wording.FIRSTNAME} : </div> {user.prenom}
              </label>
            </div>
            <div className={styles["field_container"]}>
              <label className="fr-label">
                <div className={styles["label-field"]}>{wording.EMAIL} : </div> {user.email}
              </label>
            </div>
            <div className={styles["field_container"]}>
              <label className="fr-label">
                <div className={styles["label-field"]}>{wording.CREATION_DATE} : </div> {formatDateAndHours(user.dateCreation)}
              </label>
            </div>

            <div className="fr-select-group fr-mt-3w">
              <label className="fr-label" htmlFor="select-hint">
                Institution
              </label>
              <select className="fr-select" id="select-hint" name="select-hint">
                <option disabled hidden selected value="">
                  Selectionnez une option
                </option>

                {Institutions.map((item) => (
                  <option key={item.inst_code} value={item.inst_code}>
                    {item.inst_libelle}
                  </option>
                ))}
              </select>
            </div>

            <div className="fr-select-group fr-mt-3w">
              <label className="fr-label" htmlFor="select-hint">
                Role
              </label>
              <select className="fr-select" id="select-hint" name="select-hint">
                <option disabled hidden selected value="">
                  Selectionnez une option
                </option>
                <option value="1">Admin National</option>
                <option value="2">Admin Regional</option>
                <option value="3">Utilisateur</option>
              </select>
            </div>

            <fieldset className="fr-fieldset" id="checkboxes" aria-labelledby="checkboxes-legend checkboxes-messages">
              <legend className="fr-fieldset__legend--regular fr-fieldset__legend" id="checkboxes-legend">
                Profils
              </legend>
              <div className="fr-fieldset__element">
                <div className="fr-checkbox-group">
                  <input name="checkboxes-1" id="checkboxes-1" type="checkbox" aria-describedby="checkboxes-1-messages" />
                  <label className="fr-label" htmlFor="checkboxes-1">
                    Utilisateur lambda
                  </label>
                  <div className="fr-messages-group" id="checkboxes-1-messages" aria-live="assertive"></div>
                </div>
              </div>

              <div className="fr-fieldset__element">
                <div className="fr-checkbox-group">
                  <input name="checkboxes-2" id="checkboxes-2" type="checkbox" aria-describedby="checkboxes-2-messages" />
                  <label className="fr-label" htmlFor="checkboxes-2">
                    Equipe projet
                  </label>
                  <div className="fr-messages-group" id="checkboxes-2-messages" aria-live="assertive"></div>
                </div>
              </div>

              <div className="fr-messages-group" id="checkboxes-messages" aria-live="assertive"></div>
            </fieldset>

            <button className="fr-mt-7v fr-btn " onClick={() => saveButtonClick()}>
              Sauvegarder
            </button>
          </div>
        </>
      )}
    </main>
  );
};
