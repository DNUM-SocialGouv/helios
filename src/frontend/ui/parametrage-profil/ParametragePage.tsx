import "@gouvfr/dsfr/dist/component/table/table.min.css";
import { useRouter } from "next/router";

import { formatDateAndHours } from "../../utils/dateUtils";
import { useDependencies } from "../commun/contexts/useDependencies";
import styles from "./Parametrage.module.css";

export const ParametragePage = ({ profiles }: any) => {
  const { wording } = useDependencies();
  const router = useRouter();

  const { paths } = useDependencies();

  return (
    <main className="fr-container">
      {profiles && (
        <>
          <h1 className={styles["title"]}>{wording.PARAMETRAGE_TITRE}</h1>
          <button
            className="fr-mt-2v fr-btn"
            onClick={() => {
              router.push(paths.ADD_PROFILE);
            }}
          >
            {wording.AJOUTER_UN_PROFIL}
          </button>

          {profiles.length === 0 ? (
            <div className={"fr-mt-8w " + styles["align-text"]}>{wording.VOUS_NAVEZ_AUCUN_PROFIL}</div>
          ) : (
            <div className={"fr-table fr-table--blue-ecume fr-mt-8w " + styles["align"]}>
              <table>
                <thead>
                  <tr>
                    <th scope="col">{wording.PROFILE}</th>
                    <th scope="col">{wording.PROFILE_CODE}</th>
                    <th scope="col">{wording.CREATION_DATE}</th>
                  </tr>
                </thead>
                <tbody>
                  {profiles.map((profile: any) => (
                    <tr key={profile.id}>
                      <td>
                        <a className="fr-raw-link" href={`/settings/profiles/${profile.code}`}>
                          {profile.label}
                        </a>
                      </td>
                      <td>
                        {profile.code}{" "}
                        <button
                          className="fr-icon-clipboard-line"
                          onClick={() => {
                            navigator.clipboard.writeText(profile.code);
                          }}
                        />
                      </td>
                      <td>{formatDateAndHours(profile.dateCreation)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </main>
  );
};
