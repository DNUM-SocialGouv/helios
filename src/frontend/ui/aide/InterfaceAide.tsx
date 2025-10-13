import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

import "@gouvfr/dsfr/dist/component/button/button.min.css";
import "@gouvfr/dsfr/dist/component/link/link.min.css";
import "@gouvfr/dsfr/dist/component/card/card.min.css";

import styles from "./Aide.module.css";
import { BlocRessources } from "./BlocRessources";
import Faq from "./Faq/Faq";
import { ListeSections } from "./ListeSections";
import {
  estAutorisePourRole,
  obtenirSectionNormalisee,
  regrouperRessourcesParType,
  sectionsVisibles,
  IdentifiantRole,
} from "./utils";
import type { ContenuAide, DefinitionSection } from "../parametrage-aide/types";

type InterfaceAideProps = Readonly<{
  contenu: ContenuAide;
  role: IdentifiantRole;
  surChangementSection?: (section: DefinitionSection | null) => void;
}>;

export function InterfaceAide({ contenu, role, surChangementSection }: InterfaceAideProps) {
  const router = useRouter();
  const sectionsDisponibles = useMemo(() => sectionsVisibles(contenu, role), [contenu, role]);
  const [slugActif, setSlugActif] = useState<string | null>(null);

  const sectionActuelle = slugActif ? obtenirSectionNormalisee(contenu, slugActif) : undefined;
  const definitionActuelle = slugActif
    ? sectionsDisponibles.find((section) => section.slug === slugActif) ?? null
    : null;

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    const valeurQuery = router.query["path"];
    const slug = Array.isArray(valeurQuery) ? valeurQuery[0] : valeurQuery;
    if (slug && sectionsDisponibles.some((section) => section.slug === slug)) {
      setSlugActif(slug);
    } else if (!slug) {
      setSlugActif(null);
    }
  }, [router.isReady, router.query["path"], sectionsDisponibles]);

  useEffect(() => {
    if (slugActif && !sectionsDisponibles.some((section) => section.slug === slugActif)) {
      setSlugActif(null);
    }
  }, [slugActif, sectionsDisponibles]);

  useEffect(() => {
    surChangementSection?.(definitionActuelle ?? null);
  }, [definitionActuelle, surChangementSection]);

  const ressourcesFiltrees = useMemo(() => {
    if (!sectionActuelle || definitionActuelle?.nature !== "resources") {
      return [];
    }
    return regrouperRessourcesParType(
      (sectionActuelle.resources ?? []).filter((ressource) => estAutorisePourRole(ressource, role))
    );
  }, [sectionActuelle, definitionActuelle?.nature, role]);

  const iconeSection = definitionActuelle?.icone;
  const titreSection = definitionActuelle?.titre ?? "Aide";
  const descriptionSection =
    definitionActuelle?.nature === "resources" ? sectionActuelle?.description : undefined;

  const currentBloc = () => {
    if (definitionActuelle?.nature === "faq") {
      return <Faq />;
    } else {
      return <BlocRessources ressources={ressourcesFiltrees} />;
    }
  }

  return (
    <main className={`fr-container ${styles["conteneur"]}`} id="content">
      <header className="fr-mb-6w">
        <div className="fr-grid-row fr-grid-row--middle fr-grid-row--gutters">
          {iconeSection && slugActif && (
            <div className="fr-col-auto">
              <span aria-hidden className={`${iconeSection} fr-icon fr-icon--xl fr-text-title--blue-france ${styles["iconesSection"]}`} />
            </div>
          )}
          <div className="fr-col">
            <h1 className="fr-h2 fr-m-0">{titreSection}</h1>
            {descriptionSection && <p className="fr-text--sm fr-mt-1w">{descriptionSection}</p>}
          </div>
        </div>
      </header>

      {slugActif && definitionActuelle ? (
        currentBloc()
      ) : (
        <ListeSections onSelection={setSlugActif} sections={sectionsDisponibles} />
      )}
    </main>
  );
}
