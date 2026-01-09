import "@gouvfr/dsfr/dist/component/table/table.min.css";
import { useRouter } from "next/router";

import styles from "./Parametrage.module.css";
import { ProfilModel } from "../../../../database/models/ProfilModel";
import { formatDateAndHours } from "../../utils/dateUtils";
import { useDependencies } from "../commun/contexts/useDependencies";

type ParametragePageProps = Readonly<{
  profiles: ProfilModel[];
  wrapInMain?: boolean;
}>;

export const ParametragePage = ({ profiles, wrapInMain = true }: ParametragePageProps) => {
  const { wording, paths } = useDependencies();
  const router = useRouter();

  const content = (
    <>
      {profiles && (
        <>
          <h1 className={styles["title"]}>{wording.PARAMETRAGE_AUTORISATIONS_TITRE}</h1>
          <button
            className="fr-mt-2v fr-btn"
            onClick={() => {
              router.push(paths.ADD_PROFILE);
            }}
          >
            Ajouter une autorisation
          </button>

          {profiles && profiles.length === 0 ? (
            <div className={"fr-mt-8w " + styles["align-text"]}>Vous n&apos;avez aucun profil</div>
          ) : (
            <div className={"fr-table fr-table--blue-ecume fr-mt-8w " + styles["align"]}>
              <table>
                <thead>
                  <tr>
                    <th scope="col">{wording.PROFILE}</th>
                    <th scope="col">{wording.PROFILE_CODE}</th>
                    <th scope="col">{wording.CREATED_BY}</th>
                    <th scope="col">{wording.CREATION_DATE}</th>
                  </tr>
                </thead>
                <tbody>
                  {profiles?.map((profile: any) => (
                    <tr key={profile.id}>
                      <td>
                        <a className="fr-raw-link" href={`/settings/profiles/${profile.code}`}>
                          {profile.label}
                        </a>
                      </td>
                      <td>
                        {profile.code}{" "}
                        <button
                          aria-label="Copier le code du profil"
                          className="fr-icon-clipboard-line"
                          onClick={() => {
                            navigator.clipboard.writeText(profile.code);
                          }}
                        />
                      </td>

                      <td>{profile.createdBy ? `${profile.createdBy.prenom} ${profile.createdBy.nom}` : wording.PROJECT_TEAM}</td>
                      <td>{formatDateAndHours(profile.dateCreation)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </>
  );

  if (wrapInMain) {
    return (
      <main className="fr-container" id="content">
        {content}
      </main>
    );
  }

  return <div>{content}</div>;
};
