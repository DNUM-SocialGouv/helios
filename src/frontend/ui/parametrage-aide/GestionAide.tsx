import {
  ChangeEvent,
  FormEvent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSession } from "next-auth/react";

import "@gouvfr/dsfr/dist/component/button/button.min.css";
import "@gouvfr/dsfr/dist/component/input/input.min.css";
import "@gouvfr/dsfr/dist/component/select/select.min.css";
import "@gouvfr/dsfr/dist/component/table/table.min.css";
import "@gouvfr/dsfr/dist/component/modal/modal.min.css";
import "@gouvfr/dsfr/dist/utility/icons/icons.min.css";

import {
  construireSectionsInitiales,
  creerSlug,
  determinerDefinitionsSections,
  formaterRoles,
  ICON_PAR_DEFAUT,
  normaliserSection,
  parserRoles,
  reindexerRessources,
  SECTIONS_STATIQUES,
  trierRessources,
} from "./aideUtils";
import styles from "./GestionAide.module.css";
import { MenuSections } from "./MenuSections";
import { ModalNouvelleSection } from "./ModalNouvelleSection";
import { ModalRessource, RessourceFormulaire } from "./ModalRessource";
import { SectionFormulaire } from "./SectionFormulaire";
import type {
  ContenuAide,
  DefinitionSection,
  RessourceAide,
  RessourceUtilisateur,
  SectionEditable,
  SectionNormalisee,
} from "./types";

type GestionAideProps = Readonly<{
  contenuInitial: ContenuAide;
  envelopperDansMain?: boolean;
}>;

const FORMULAIRE_RESSOURCE_VIERGE: RessourceFormulaire = {
  slug: "",
  nom: "",
  type: "document",
  contenu: "",
  ordre: 1,
  date: "",
  nom_telechargement: "",
  allowedRoles: "",
};

export function GestionAide({ contenuInitial, envelopperDansMain = true }: GestionAideProps) {
  const { data: session } = useSession();
  const contenuNormalise = useMemo(() => construireSectionsInitiales(contenuInitial), [contenuInitial]);

  const utilisateurActif = useMemo<RessourceUtilisateur | undefined>(() => {
    const prenom = session?.user?.firstname?.trim();
    const nom = session?.user?.name?.trim();
    const identifiant = session?.user?.idUser?.toString().trim();

    if (!prenom && !nom && !identifiant) {
      return undefined;
    }

    return {
      id: identifiant || undefined,
      prenom: prenom || undefined,
      nom: nom || undefined,
    };
  }, [session?.user?.firstname, session?.user?.name, session?.user?.idUser]);

  const initialisationRoles = useMemo(() => {
    const resultat: Record<string, string> = {};
    for (const [slug, section] of Object.entries(contenuNormalise)) {
      resultat[slug] = formaterRoles(section?.allowedRoles ?? section?.roles);
    }
    return resultat;
  }, [contenuNormalise]);

  const [contenu, setContenu] = useState<ContenuAide>(contenuNormalise);
  const [rolesBrouillon, setRolesBrouillon] = useState<Record<string, string>>(initialisationRoles);
  const [slugSelectionne, setSlugSelectionne] = useState<string>("");
  const [ressourceModaleOuverte, setRessourceModaleOuverte] = useState(false);
  const [nouvelleSectionOuverte, setNouvelleSectionOuverte] = useState(false);
  const [ressourceFormulaire, setRessourceFormulaire] = useState<RessourceFormulaire>(FORMULAIRE_RESSOURCE_VIERGE);
  const [indexRessourceEditee, setIndexRessourceEditee] = useState<number | null>(null);
  const [formulaireNouvelleSection, setFormulaireNouvelleSection] = useState({ title: "", icon: ICON_PAR_DEFAUT });
  const [sectionsSupprimees, setSectionsSupprimees] = useState<string[]>([]);
  const [messageSucces, setMessageSucces] = useState<string | null>(null);
  const [messageErreur, setMessageErreur] = useState<string | null>(null);
  const [enregistrementEnCours, setEnregistrementEnCours] = useState(false);

  const referenceModaleRessource = useRef<HTMLDialogElement | null>(null);
  const referencePremierChampRessource = useRef<HTMLInputElement | null>(null);
  const referenceModaleSection = useRef<HTMLDialogElement | null>(null);
  const referencePremierChampSection = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const modale = referenceModaleRessource.current;
    if (!modale) {
      return;
    }

    if (ressourceModaleOuverte) {
      if (typeof modale.showModal === "function" && !modale.open) {
        modale.showModal();
      } else {
        modale.setAttribute("open", "true");
      }

      const overflowPrecedent = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      const focusPremierChamp = () => referencePremierChampRessource.current?.focus({ preventScroll: true });
      requestAnimationFrame(focusPremierChamp);

      return () => {
        document.body.style.overflow = overflowPrecedent;
      };
    }

    if (modale.open) {
      modale.close();
    } else {
      modale.removeAttribute("open");
    }
  }, [ressourceModaleOuverte]);

  useEffect(() => {
    const modale = referenceModaleSection.current;
    if (!modale) {
      return;
    }

    if (nouvelleSectionOuverte) {
      if (typeof modale.showModal === "function" && !modale.open) {
        modale.showModal();
      } else {
        modale.setAttribute("open", "true");
      }

      const overflowPrecedent = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      const focusPremierChamp = () => referencePremierChampSection.current?.focus({ preventScroll: true });
      requestAnimationFrame(focusPremierChamp);

      return () => {
        document.body.style.overflow = overflowPrecedent;
      };
    }

    if (modale.open) {
      modale.close();
    } else {
      modale.removeAttribute("open");
    }
  }, [nouvelleSectionOuverte]);

  const definitionsSections = useMemo(() => determinerDefinitionsSections(contenu), [contenu]);

  const sectionsMenu: SectionEditable[] = useMemo(
    () =>
      definitionsSections.map((definition) => ({
        ...definition,
        peutEtreSupprimee: !SECTIONS_STATIQUES.some((fixe) => fixe.slug === definition.slug),
      })),
    [definitionsSections]
  );

  useEffect(() => {
    if (!slugSelectionne && definitionsSections[0]) {
      setSlugSelectionne(definitionsSections[0].slug);
      return;
    }

    if (slugSelectionne && !contenu[slugSelectionne] && definitionsSections[0]) {
      setSlugSelectionne(definitionsSections[0].slug);
    }
  }, [definitionsSections, contenu, slugSelectionne]);

  const sectionActive: SectionNormalisee | undefined = slugSelectionne
    ? normaliserSection(contenu[slugSelectionne])
    : undefined;

  const definitionActive: DefinitionSection | undefined = definitionsSections.find(
    (definition) => definition.slug === slugSelectionne
  );

  const fermerModaleRessource = useCallback(() => {
    setRessourceModaleOuverte(false);
    setIndexRessourceEditee(null);
    setRessourceFormulaire(FORMULAIRE_RESSOURCE_VIERGE);
  }, []);

  const ouvrirModaleCreationRessource = () => {
    if (!sectionActive) {
      return;
    }
    const prochainOrdre =
      (sectionActive.resources[sectionActive.resources.length - 1]?.ordre ?? sectionActive.resources.length) + 1;
    setRessourceFormulaire({ ...FORMULAIRE_RESSOURCE_VIERGE, ordre: prochainOrdre });
    setIndexRessourceEditee(null);
    setRessourceModaleOuverte(true);
  };

  const ouvrirModaleEditionRessource = (index: number) => {
    if (!sectionActive) {
      return;
    }
    const ressource = sectionActive.resources[index];
    if (!ressource) {
      return;
    }

    setRessourceFormulaire({
      slug: ressource.slug ?? "",
      nom: ressource.nom,
      type: ressource.type,
      contenu: ressource.contenu,
      ordre: ressource.ordre ?? index + 1,
      date: ressource.date ?? "",
      nom_telechargement: ressource.nom_telechargement ?? "",
      allowedRoles: formaterRoles(ressource.allowedRoles ?? ressource.roles),
    });
    setIndexRessourceEditee(index);
    setRessourceModaleOuverte(true);
  };

  const mettreAJourSection = (slug: string, miseAJour: (section: SectionNormalisee) => SectionNormalisee) => {
    setContenu((precedent) => {
      const actuel = normaliserSection(precedent[slug]);
      return {
        ...precedent,
        [slug]: miseAJour(actuel),
      };
    });
    setSectionsSupprimees((precedent) => precedent.filter((element) => element !== slug));
  };

  const modifierDescription = (valeur: string) => {
    if (!slugSelectionne) {
      return;
    }
    mettreAJourSection(slugSelectionne, (section) => ({ ...section, description: valeur }));
  };

  const modifierRoles = (valeur: string) => {
    if (!slugSelectionne) {
      return;
    }
    setRolesBrouillon((precedent) => ({ ...precedent, [slugSelectionne]: valeur }));
    const roles = parserRoles(valeur);
    mettreAJourSection(slugSelectionne, (section) => ({
      ...section,
      allowedRoles: roles.length > 0 ? roles : undefined,
      roles: undefined,
      excludedRoles: undefined,
      hiddenForRoles: undefined,
    }));
  };

  const modifierOrdreSection = (valeur: number | undefined) => {
    if (!slugSelectionne) {
      return;
    }
    mettreAJourSection(slugSelectionne, (section) => ({ ...section, order: valeur }));
  };

  const enregistrerRessource = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!slugSelectionne) {
      return;
    }

    const roles = parserRoles(ressourceFormulaire.allowedRoles);

    const nouvelleEntree: RessourceAide = {
      slug: ressourceFormulaire.slug ? creerSlug(ressourceFormulaire.slug, ressourceFormulaire.nom) : undefined,
      nom: ressourceFormulaire.nom,
      type: ressourceFormulaire.type,
      contenu: ressourceFormulaire.contenu,
      ordre: ressourceFormulaire.ordre,
      date: ressourceFormulaire.date || undefined,
      nom_telechargement: ressourceFormulaire.nom_telechargement || undefined,
      allowedRoles: roles.length > 0 ? roles : undefined,
      ...(utilisateurActif ? { updatedBy: utilisateurActif } : {}),
    };

    mettreAJourSection(slugSelectionne, (section) => {
      const ressources = [...section.resources];
      if (indexRessourceEditee !== null) {
        ressources[indexRessourceEditee] = nouvelleEntree;
      } else {
        ressources.push(nouvelleEntree);
      }
      return {
        ...section,
        resources: reindexerRessources(trierRessources(ressources)),
      };
    });

    fermerModaleRessource();
  };

  const supprimerRessource = (index: number) => {
    if (!slugSelectionne) {
      return;
    }

    if (!window.confirm("Supprimer cette ressource ?")) {
      return;
    }

    mettreAJourSection(slugSelectionne, (section) => ({
      ...section,
      resources: reindexerRessources(section.resources.filter((_, position) => position !== index)),
    }));
  };

  const deplacerRessource = (index: number, direction: "up" | "down") => {
    if (!slugSelectionne) {
      return;
    }

    mettreAJourSection(slugSelectionne, (section) => {
      const ressources = [...section.resources];
      const indexCible = direction === "up" ? index - 1 : index + 1;
      if (indexCible < 0 || indexCible >= ressources.length) {
        return section;
      }

      const [deplacee] = ressources.splice(index, 1);
      if (!deplacee) {
        return section;
      }

      const ressourceMaj = utilisateurActif ? { ...deplacee, updatedBy: utilisateurActif } : deplacee;
      ressources.splice(indexCible, 0, ressourceMaj);

      return {
        ...section,
        resources: reindexerRessources(ressources),
      };
    });
  };

  const ouvrirModalNouvelleSection = () => {
    setFormulaireNouvelleSection({ title: "", icon: ICON_PAR_DEFAUT });
    setNouvelleSectionOuverte(true);
  };

  const fermerModalNouvelleSection = () => {
    setNouvelleSectionOuverte(false);
    setFormulaireNouvelleSection({ title: "", icon: ICON_PAR_DEFAUT });
  };

  const enregistrerNouvelleSection = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const titre = formulaireNouvelleSection.title.trim();
    const icone = formulaireNouvelleSection.icon.trim() || ICON_PAR_DEFAUT;

    if (!titre) {
      window.alert("Le nom de la section est obligatoire.");
      return;
    }

    const slug = creerSlug(titre, titre);
    if (!slug) {
      window.alert("Impossible de créer la section. Nom invalide.");
      return;
    }

    if (contenu[slug]) {
      window.alert("Une section avec ce nom existe déjà.");
      return;
    }

    const ordre = definitionsSections.length + 1;

    setContenu((precedent) => ({
      ...precedent,
      [slug]: normaliserSection({
        title: titre,
        icon: icone,
        kind: "resources",
        description: "",
        resources: [],
        order: ordre,
      }),
    }));

    setRolesBrouillon((precedent) => ({ ...precedent, [slug]: "" }));
    setSectionsSupprimees((precedent) => precedent.filter((element) => element !== slug));
    setSlugSelectionne(slug);
    setNouvelleSectionOuverte(false);
  };

  const supprimerSection = (slug: string) => {
    const estStatique = SECTIONS_STATIQUES.some((section) => section.slug === slug);
    if (estStatique) {
      window.alert("Vous ne pouvez pas supprimer cette section.");
      return;
    }

    if (!window.confirm("Supprimer cette section et toutes ses ressources ?")) {
      return;
    }

    setContenu((precedent) => {
      const copie = { ...precedent };
      delete copie[slug];
      return copie;
    });

    setRolesBrouillon((precedent) => {
      const copie = { ...precedent };
      delete copie[slug];
      return copie;
    });

    setSectionsSupprimees((precedent) => (precedent.includes(slug) ? precedent : [...precedent, slug]));

    if (slugSelectionne === slug) {
      setSlugSelectionne("");
    }
  };

  const changerChampNouvelleSection = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormulaireNouvelleSection((precedent) => ({ ...precedent, [name]: value }));
  };

  const changerChampRessource = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setRessourceFormulaire((precedent) => ({
      ...precedent,
      [name]: name === "ordre" ? Number.parseInt(value, 10) || 1 : value,
    }));
  };

  const enregistrerToutesLesSections = async () => {
    setEnregistrementEnCours(true);
    setMessageSucces(null);
    setMessageErreur(null);

    try {
      const chargeUtile: ContenuAide = {};
      for (const [slug, section] of Object.entries(contenu)) {
        chargeUtile[slug] = {
          ...section,
          resources: reindexerRessources(trierRessources(section.resources ?? [])),
        };
      }

      const reponse = await fetch("/api/parametrage-aide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: chargeUtile, remove: sectionsSupprimees }),
      });

      if (!reponse.ok) {
        const details = await reponse.json().catch(() => ({}));
        throw new Error(details?.message ?? "Enregistrement impossible");
      }

      setMessageSucces("Les contenus d’aide ont été enregistrés.");
      setSectionsSupprimees([]);
    } catch (erreur: any) {
      setMessageErreur(erreur?.message ?? "Une erreur est survenue lors de l’enregistrement.");
    } finally {
      setEnregistrementEnCours(false);
    }
  };

  const contenuAffiche: ReactNode = (
    <div className={`fr-container ${styles["conteneur"]}`}>
      <header className="fr-mb-6w">
        <h1 className="fr-h2">Paramétrage de l’aide</h1>
        <p className="fr-text--sm fr-mt-1w">
          Les rubriques de premier niveau sont fixes. Vous pouvez mettre à jour leur description et ajouter des ressources
          (documents, vidéos ou liens) pour chaque section.
        </p>
      </header>

      {(messageSucces || messageErreur) && (
        <div className={`fr-alert fr-alert--${messageSucces ? "success" : "error"} fr-mb-4w`}>
          <p>{messageSucces ?? messageErreur}</p>
        </div>
      )}

      <div className="fr-grid-row fr-grid-row--gutters">
        <aside className="fr-col-12 fr-col-md-3">
          <MenuSections
            sections={sectionsMenu}
            slugActif={slugSelectionne}
            surAjout={ouvrirModalNouvelleSection}
            surSelection={setSlugSelectionne}
            surSuppression={supprimerSection}
          />
        </aside>

        <section className="fr-col-12 fr-col-md-9">
          {sectionActive && definitionActive ? (
            <SectionFormulaire
              definition={{
                titre: definitionActive.titre,
                icone: definitionActive.icone,
                nature: definitionActive.nature,
              }}
              rolesBrouillon={rolesBrouillon[slugSelectionne] ?? ""}
              section={sectionActive}
              surAjoutRessource={ouvrirModaleCreationRessource}
              surDescendreRessource={(index) => deplacerRessource(index, "down")}
              surEditionRessource={ouvrirModaleEditionRessource}
              surModificationDescription={modifierDescription}
              surModificationOrdre={modifierOrdreSection}
              surModificationRoles={modifierRoles}
              surMonterRessource={(index) => deplacerRessource(index, "up")}
              surSuppressionRessource={supprimerRessource}
            />
          ) : (
            <p className="fr-text--sm">Aucune section sélectionnée.</p>
          )}

          <div className="fr-mt-6w fr-text-right">
            <button
              className="fr-btn fr-btn--secondary fr-mr-2w"
              disabled={enregistrementEnCours}
              onClick={() => window.location.reload()}
              type="button"
            >
              Annuler les modifications
            </button>
            <button
              className="fr-btn"
              disabled={enregistrementEnCours}
              onClick={enregistrerToutesLesSections}
              type="button"
            >
              {enregistrementEnCours ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </section>
      </div>

      <ModalNouvelleSection
        ancre={referenceModaleSection}
        champInitial={referencePremierChampSection}
        formulaire={formulaireNouvelleSection}
        ouverte={nouvelleSectionOuverte}
        surFermeture={fermerModalNouvelleSection}
        surModification={changerChampNouvelleSection}
        surValidation={enregistrerNouvelleSection}
      />

      <ModalRessource
        ancre={referenceModaleRessource}
        champInitial={referencePremierChampRessource}
        editionEnCours={indexRessourceEditee !== null}
        ouverte={ressourceModaleOuverte}
        surChangement={changerChampRessource}
        surFermeture={fermerModaleRessource}
        surValidation={enregistrerRessource}
        valeurs={ressourceFormulaire}
      />
    </div>
  );

  if (!envelopperDansMain) {
    return <>{contenuAffiche}</>;
  }

  return <main id="content">{contenuAffiche}</main>;
}
