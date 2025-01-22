import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";

import "@gouvfr/dsfr/dist/component/header/header.min.css";
import "@gouvfr/dsfr/dist/component/logo/logo.min.css";
import "@gouvfr/dsfr/dist/component/link/link.min.css";
import "@gouvfr/dsfr/dist/component/modal/modal.min.css";
import { useFavoris } from "../../favoris/useFavoris";
import { Breadcrumb } from "../Breadcrumb/Breadcrumb";
import { BtnRetourRecherche } from "../BtnRetourRecherche/BtnRetourRecherche";
import { useDependencies } from "../contexts/useDependencies";
import { useOutsideClick } from "../hooks/useOutsideClick";
import styles from "./Header.module.css";

export const Header = () => {
  const { paths, wording } = useDependencies();
  const router = useRouter();
  const { data, status } = useSession();
  const { getAllFavoris, getFavorisLists } = useFavoris();
  const [terme, setTerme] = useState<string>("");
  const [displayMenu, setDisplayMenu] = useState<boolean>(false);

  const ref = useOutsideClick(() => setDisplayMenu(false));

  const rechercheOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTerme(event.target.value);
  };

  const logOut = () => {
    signOut({ callbackUrl: paths.CONNEXION });
    setDisplayMenu(false);
  };

  useEffect(() => {
    if (data?.user?.idUser) {
      getAllFavoris(data?.user?.idUser);
      getFavorisLists();
    }
  }, [data?.user?.idUser]);

  return (
    <>
      <header className="fr-header">
        <div className="fr-header__body">
          <div className="fr-container">
            <div className="fr-header__body-row">
              <div className={styles["header-brand"] + " fr-header__brand fr-enlarge-link"}>
                <div className="fr-header__brand-top">
                  <div className="fr-header__logo">
                    <p className="fr-logo">{wording.INTITULÉ_RÉPUBLIQUE_FRANÇAISE}</p>
                  </div>
                  <div className="fr-header__operator">
                    <Image alt="" height="80" src="/logo.svg" width="80" />
                  </div>
                  <div className="fr-header__navbar">
                    {router.pathname !== paths.ACCUEIL &&
                      router.pathname !== paths.CREATE_PASSWORD &&
                      router.pathname !== paths.CONNEXION &&
                      router.pathname !== paths.REINITIALISATION_PASSWORD &&
                      router.pathname !== paths.REGISTRATION && (
                        <button
                          aria-controls="modal-541"
                          className="fr-btn--search fr-btn"
                          data-fr-opened="false"
                          id="button-542"
                          title={wording.RECHERCHE_LABEL}
                        >
                          {wording.RECHERCHE_LABEL}
                        </button>
                      )}
                    {status !== "unauthenticated" && (
                      <button
                        aria-controls="modal-833"
                        aria-haspopup="menu"
                        className="fr-btn--menu fr-btn"
                        data-fr-opened="false"
                        id="fr-btn-menu-mobile"
                        title={wording.MENU}
                        type="button"
                      >
                        {wording.MENU}
                      </button>
                    )}
                  </div>
                </div>
                <div className="fr-header__service">
                  <Link href="/" passHref title={wording.ACCUEIL}>
                    <p className="fr-header__service-title">{wording.TITRE_DU_SITE}</p>
                  </Link>
                  <p className="fr-header__service-tagline">Données des établissements sanitaires et médico-sociaux</p>
                </div>
              </div>
              <div className="fr-header__tools">
                {router.pathname !== paths.ACCUEIL &&
                  router.pathname !== paths.CREATE_PASSWORD &&
                  router.pathname !== paths.FORGET_PASSWORD &&
                  router.pathname !== paths.CHANGE_PASSWORD &&
                  router.pathname !== paths.CONNEXION &&
                  router.pathname !== paths.SETTINGS &&
                  router.pathname !== paths.ADD_PROFILE &&
                  router.pathname !== paths.PROFILES_LIST &&
                  router.pathname !== paths.USERS_LIST &&
                  router.pathname !== paths.HISTORY &&
                  router.pathname !== paths.FAVORIS &&
                  router.pathname !== paths.REINITIALISATION_PASSWORD &&
                  router.pathname !== paths.REGISTRATION &&
                  router.pathname !== paths.RECHERCHE_AVANCEE && (
                    <div className="fr-header__search fr-modal" id="modal-541">
                      <div className="fr-container fr-container-lg--fluid">
                        <button aria-controls="modal-541" className="fr-btn--close fr-btn" title="Fermer">
                          {wording.FERMER}
                        </button>
                        <form action="/recherche" className="fr-search-bar" id="search-540" role="search">
                          <label className="fr-label" htmlFor="search-540-input">
                            {wording.RECHERCHE_LABEL}
                          </label>
                          <input
                            className="fr-input"
                            id="search-540-input"
                            name="terme"
                            onChange={rechercheOnChange}
                            placeholder={wording.RECHERCHE_LABEL}
                            type="search"
                            value={terme}
                          />
                          <button
                            className="fr-btn"
                            onClick={(event) => {
                              event.preventDefault();
                              localStorage.setItem("searchItem", terme);
                              router.push(paths.ACCUEIL + "?terme=" + terme, paths.ACCUEIL);
                            }}
                            title="Rechercher"
                            type="submit"
                          >
                            {wording.RECHERCHE_LABEL}
                          </button>
                        </form>
                      </div>
                    </div>
                  )}
              </div>
              {status === "authenticated" && paths.CONNEXION !== router.pathname ? (
                <div className={styles["dropdown"]}>
                  <button
                    className={"fr-btn fr-btn--secondary fr-btn--icon-left fr-icon-menu-fill " + styles["no-border"]}
                    onClick={() => {
                      setDisplayMenu(!displayMenu);
                    }}
                    ref={ref}
                    title="Menu du compte"
                  >
                    Menu
                  </button>
                  {displayMenu ? (
                    <ul className={styles["menu"]}>
                      <li className={styles["menu-item"]}>
                        <button
                          onClick={() => {
                            router.push("/favoris");
                          }}
                        >
                          Favoris
                        </button>
                      </li>
                      <li className={styles["menu-item"]}>
                        <button
                          onClick={() => {
                            router.push("/history");
                          }}
                        >
                          Historique
                        </button>
                      </li>
                      <hr className={styles["menu-sperator"]} />
                      {data.user.role === 1 && (
                        <li className={styles["menu-item"]}>
                          <button
                            onClick={() => {
                              router.push(paths.PROFILES_LIST);
                            }}
                          >
                            Paramétrage
                          </button>
                        </li>
                      )}
                      {(data.user.role === 1 || data.user.role === 2) && (
                        <>
                          <li className={styles["menu-item"]}>
                            <button
                              onClick={() => {
                                router.push(paths.USERS_LIST);
                              }}
                            >
                              Console d’administration
                            </button>
                          </li>
                          <hr className={styles["menu-sperator"]} />
                        </>
                      )}
                      <li className={styles["menu-item"]}>
                        <button
                          onClick={() => {
                            router.push("/mon-compte");
                          }}
                        >
                          Mon compte
                        </button>
                      </li>
                      <hr className={styles["menu-sperator"]} />
                      <li className={styles["menu-item"]}>
                        <button className={"fr-btn--icon-left fr-icon-logout-box-r-line " + styles["logout-icon"]} onClick={logOut}>
                          {wording.DÉCONNEXION}
                        </button>
                      </li>
                    </ul>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </div>
        {status !== "unauthenticated" && (
          <div aria-labelledby="fr-btn-menu-mobile" className="fr-header__menu fr-modal" id="modal-833">
            <div className="fr-container">
              <button aria-controls="modal-833" className="fr-link--close fr-link" type="button">
                {wording.FERMER}
              </button>
              <div className="fr-header__menu-links">
                <ul>
                  <li>
                    <button onClick={logOut}>{wording.DÉCONNEXION}</button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </header>
      <div className="fr-grid-row fr-container">
        <Breadcrumb />
        <BtnRetourRecherche />
      </div>
    </>
  );
};
