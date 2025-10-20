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

import "@gouvfr/dsfr/dist/component/select/select.min.css";
import "@gouvfr/dsfr/dist/component/modal/modal.min.css";
import "@gouvfr/dsfr/dist/component/alert/alert.min.css";



import {
  construireSectionsInitiales,
  creerSlug,
  determinerDefinitionsSections,
  ICON_PAR_DEFAUT,
  normaliserRoles,
  normaliserSection,
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
  SectionEditable,
  SectionNormalisee,
} from "./types";
import { useDependencies } from "../commun/contexts/useDependencies";

type GestionAideProps = Readonly<{
  contenuInitial: ContenuAide;
  envelopperDansMain?: boolean;
}>;

const FORMULAIRE_RESSOURCE_VIERGE: RessourceFormulaire = {
  slug: "",
  nom: "",
  type: "document",
  lien: "",
  ordre: 1,
  date: "",
  nom_telechargement: "",
};

export function GestionAide({ contenuInitial, envelopperDansMain = true }: GestionAideProps) {
  const { wording } = useDependencies();
  const contenuNormalise = construireSectionsInitiales(contenuInitial);

  const initialisationRoles = () => {
    const resultat: Record<string, number[]> = {};
    for (const [slug, section] of Object.entries(contenuNormalise)) {
      resultat[slug] = normaliserRoles(section?.allowedRoles ?? section?.roles);
    }
    return resultat;
  };

  const [contenu, setContenu] = useState<ContenuAide>(contenuNormalise);
  const [rolesBrouillon, setRolesBrouillon] = useState<Record<string, number[]>>(initialisationRoles);
  const [slugSelectionne, setSlugSelectionne] = useState<string>("");
  const [ressourceModaleOuverte, setRessourceModaleOuverte] = useState(false);
  const [nouvelleSectionOuverte, setNouvelleSectionOuverte] = useState(false);
  const [ressourceFormulaire, setRessourceFormulaire] = useState<RessourceFormulaire>(FORMULAIRE_RESSOURCE_VIERGE);
  const [indexRessourceEditee, setIndexRessourceEditee] = useState<number | null>(null);
  const [formulaireNouvelleSection, setFormulaireNouvelleSection] = useState({ title: "", icon: ICON_PAR_DEFAUT });
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
    return () => { };
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
    return () => { };
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
    const prochainOrdre = (sectionActive.resources.at(-1)?.ordre ?? sectionActive.resources.length) + 1;
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
      lien: ressource.lien,
      ordre: ressource.ordre ?? index + 1,
      date: ressource.date ?? "",
      nom_telechargement: ressource.nom_telechargement ?? "",
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
  };

  const modifierDescription = (valeur: string) => {
    if (!slugSelectionne) {
      return;
    }
    mettreAJourSection(slugSelectionne, (section) => ({ ...section, description: valeur }));
  };

  const basculerRoleSection = (role: number, actif: boolean) => {
    if (!slugSelectionne) {
      return;
    }
    const rolesActuels = rolesBrouillon[slugSelectionne] ?? [];
    const rolesActualises = actif
      ? normaliserRoles([...rolesActuels, role])
      : normaliserRoles(rolesActuels.filter((identifiant) => identifiant !== role));
    setRolesBrouillon((precedent) => ({ ...precedent, [slugSelectionne]: rolesActualises }));
    mettreAJourSection(slugSelectionne, (section) => ({
      ...section,
      allowedRoles: rolesActualises,
      roles: undefined,
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

    const nouvelleEntree: RessourceAide = {
      slug: ressourceFormulaire.slug ? creerSlug(ressourceFormulaire.slug, ressourceFormulaire.nom) : undefined,
      nom: ressourceFormulaire.nom,
      type: ressourceFormulaire.type,
      lien: ressourceFormulaire.lien,
      ordre: ressourceFormulaire.ordre,
      date: ressourceFormulaire.date || undefined,
      nom_telechargement: ressourceFormulaire.nom_telechargement || undefined,
    };

    mettreAJourSection(slugSelectionne, (section) => {
      const ressources = [...section.resources];
      if (indexRessourceEditee === null) {
        ressources.push(nouvelleEntree);
      } else {
        ressources[indexRessourceEditee] = nouvelleEntree;
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

    if (!globalThis.confirm(wording.PARAMETRAGE_AIDE_CONFIRMER_SUPPRESSION_RESSOURCE)) {
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

      ressources.splice(indexCible, 0, deplacee);
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
      globalThis.alert(wording.PARAMETRAGE_AIDE_ALERTE_NOM_SECTION_OBLIGATOIRE);
      return;
    }

    const slug = creerSlug(titre, titre);
    if (!slug) {
      globalThis.alert(wording.PARAMETRAGE_AIDE_ALERTE_NOM_SECTION_INVALIDE);
      return;
    }

    if (contenu[slug]) {
      globalThis.alert(wording.PARAMETRAGE_AIDE_ALERTE_SECTION_EXISTANTE);
      return;
    }

    const ordre = definitionsSections.length + 1;

    setContenu((precedent) => ({
      ...precedent,
      [slug]: normaliserSection({
        title: titre,
        icon: icone,
        type: "resources",
        description: "",
        resources: [],
        order: ordre,
      }),
    }));

    setRolesBrouillon((precedent) => ({ ...precedent, [slug]: [] }));
    setSlugSelectionne(slug);
    setNouvelleSectionOuverte(false);
  };

  const supprimerSection = (slug: string) => {
    const estStatique = SECTIONS_STATIQUES.some((section) => section.slug === slug);
    if (estStatique) {
      globalThis.alert(wording.PARAMETRAGE_AIDE_ALERTE_SUPPRESSION_SECTION);
      return;
    }

    if (!globalThis.confirm(wording.PARAMETRAGE_AIDE_CONFIRMER_SUPPRESSION_SECTION)) {
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

    const chargeUtile: ContenuAide = {};
    for (const [slug, section] of Object.entries(contenu)) {
      chargeUtile[slug] = {
        ...section,
        resources: reindexerRessources(trierRessources(section?.resources ?? [])),
      };
    }

    let responseOk = false;
    await fetch("/api/parametrage-aide", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(chargeUtile),
    })
      .then((response) => {
        responseOk = response.ok;
        return response.json();
      })
      .then((payload) => {
        if (responseOk) {
          setContenu(construireSectionsInitiales(payload));
          setMessageSucces(wording.PARAMETRAGE_AIDE_MESSAGE_SUCCES);
        } else {
          setMessageErreur(payload?.message ?? wording.PARAMETRAGE_AIDE_MESSAGE_ERREUR);
        }
      })
      .finally(() => {
        setEnregistrementEnCours(false);
      });
  };

  const contenuAffiche: ReactNode = (
    <div className={`fr-container ${styles["conteneur"]}`}>
      <header className="fr-mb-6w">
        <h1 className="fr-h2">{wording.PARAMETRAGE_AIDE_TITRE}</h1>
        <p className="fr-text--sm fr-mt-1w">{wording.PARAMETRAGE_AIDE_DESCRIPTION}</p>
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
              rolesSelectionnes={rolesBrouillon[slugSelectionne] ?? []}
              section={sectionActive}
              surAjoutRessource={ouvrirModaleCreationRessource}
              surBasculeRole={basculerRoleSection}
              surDescendreRessource={(index) => deplacerRessource(index, "down")}
              surEditionRessource={ouvrirModaleEditionRessource}
              surModificationDescription={modifierDescription}
              surModificationOrdre={modifierOrdreSection}
              surMonterRessource={(index) => deplacerRessource(index, "up")}
              surSuppressionRessource={supprimerRessource}
            />
          ) : (
            <p className="fr-text--sm">{wording.PARAMETRAGE_AIDE_MESSAGE_AUCUNE_SECTION}</p>
          )}

          <div className="fr-mt-5w fr-text-right">
            <button
              className="fr-btn fr-btn--secondary fr-mr-2w"
              disabled={enregistrementEnCours}
              onClick={() => globalThis.location.reload()}
              type="button"
            >
              {wording.PARAMETRAGE_AIDE_BOUTON_ANNULER_MODIFICATIONS}
            </button>
            <button
              className="fr-btn"
              disabled={enregistrementEnCours}
              onClick={enregistrerToutesLesSections}
              type="button"
            >
              {enregistrementEnCours
                ? wording.PARAMETRAGE_AIDE_ETAT_ENREGISTREMENT
                : wording.PARAMETRAGE_AIDE_BOUTON_ENREGISTRER}
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
