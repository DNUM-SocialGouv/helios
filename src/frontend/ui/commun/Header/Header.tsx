import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import { ChangeEvent, useContext, useEffect, useState } from "react";

import "@gouvfr/dsfr/dist/component/header/header.min.css";
import "@gouvfr/dsfr/dist/component/logo/logo.min.css";
import "@gouvfr/dsfr/dist/component/link/link.min.css";
import "@gouvfr/dsfr/dist/component/modal/modal.min.css";
import styles from "./Header.module.css";
import { useFavoris } from "../../favoris/useFavoris";
import { Breadcrumb } from "../Breadcrumb/Breadcrumb";
import { BtnRetourRecherche } from "../BtnRetourRecherche/BtnRetourRecherche";
import { useDependencies } from "../contexts/useDependencies";
import { UserContext } from "../contexts/userContext";
import { useOutsideClick } from "../hooks/useOutsideClick";

export const Header = () => {
  const { paths, wording } = useDependencies();
  const router = useRouter();
  const { data, status } = useSession();
  const userContext = useContext(UserContext);
  const { getFavorisLists } = useFavoris();

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
    if (status === "authenticated") {
      getFavorisLists();
    }
  }, [status]);

  const isAuthenticated = (): boolean => {
    return status === "authenticated";
  }

  const shouldDisplaySearchBar = (): boolean => {
    return isAuthenticated() &&
      router.pathname !== paths.ACCUEIL &&
      router.pathname !== paths.CREATE_PASSWORD &&
      router.pathname !== paths.FORGET_PASSWORD &&
      router.pathname !== paths.CHANGE_PASSWORD &&
      router.pathname !== paths.CONNEXION &&
      router.pathname !== paths.SETTINGS &&
      router.pathname !== paths.USERS_LIST &&
      router.pathname !== paths.REINITIALISATION_PASSWORD &&
      router.pathname !== paths.REGISTRATION &&
      router.pathname !== paths.RECHERCHE_AVANCEE;
  }

  const shouldDisplayMenu = (): boolean => {
    return isAuthenticated() && paths.CONNEXION !== router.pathname;
  }

  return (
    <>
      <header className="fr-header">
        <div className="fr-header__body">
          <div className="fr-container">
            <div className={"fr-skiplinks fr-sr-only " + styles["sr-only-focusable"]}>
              <nav aria-label="Accès rapide" className="fr-container" role="navigation">
                <ul className="fr-skiplinks__list">
                  <li>
                    <a className="fr-link" href="#content">Contenu</a>
                  </li>
                  {shouldDisplayMenu() && (
                    <li>
                      <a className="fr-link" href="#menu-btn">Menu</a>
                    </li>
                  )}
                  {isAuthenticated() && (
                    <li>
                      <a className="fr-link" href="#search-input">Recherche</a>
                    </li>
                  )}
                  <li>
                    <a className="fr-link" href="#footer">Pied de page</a>
                  </li>
                </ul>
              </nav>
            </div>
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
                {shouldDisplaySearchBar() && (
                  <div className="fr-header__search fr-modal" id="modal-541">
                    <div className="fr-container fr-container-lg--fluid">
                      <button aria-controls="modal-541" className="fr-btn--close fr-btn" title="Fermer">
                        {wording.FERMER}
                      </button>
                      <form action="/recherche" className="fr-search-bar" id="search" role="search">
                        <label className="fr-label" htmlFor="search-input">
                          {wording.RECHERCHE_LABEL}
                        </label>
                        <input
                          className="fr-input"
                          id="search-input"
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
                            localStorage.setItem("searchItem", encodeURIComponent(terme));
                            router.push(paths.ACCUEIL + "?terme=" + encodeURIComponent(terme), paths.ACCUEIL);
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
              {shouldDisplayMenu() ? (
                <div className={styles["dropdown"]}>
                  <button
                    className={"fr-btn fr-btn--secondary fr-btn--icon-left fr-icon-menu-fill " + styles["no-border"]}
                    id="menu-btn"
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
                            router.push(paths.MES_LISTES);
                          }}
                        >
                          Mes listes ({userContext?.favorisLists?.length})
                        </button>
                      </li>
                      <li className={styles["menu-item"]}>
                        <button
                          onClick={() => {
                            router.push(paths.HISTORY);
                          }}
                        >
                          Historique
                        </button>
                      </li>
                      <hr className={styles["menu-sperator"]} />
                      {data?.user.role === 1 && (
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
                      {(data?.user.role === 1 || data?.user.role === 2) && (
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
