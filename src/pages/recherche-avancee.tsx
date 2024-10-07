import { useState } from "react";

import { useDependencies } from "../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../frontend/ui/commun/hooks/useBreadcrumb";
import { RechercheEnAttente } from "../frontend/ui/home/RechercheEnAttente";
import { RechercheAvanceeFormulaire } from "../frontend/ui/recherche-avancee/RechecheAvanceeFormulaire";
import { ResultatRechercheAvancee } from "../frontend/ui/recherche-avancee/ResultatRechercheAvancee";
import { ResultatRecherchePlaceholderText } from "../frontend/ui/recherche-avancee/ResultatRecherchePlaceHolderText";
import { useRechercheAvancee } from "../frontend/ui/recherche-avancee/useRechercheAvancee";

export default function RechercheAvancee() {
    const { wording } = useDependencies();

    const {
        estCeEnAttente, 
        estCeQueLesRésultatsSontReçus,
        estCeQueLaRechercheEstLancee,
        lancerLaRecherche,
        rechercheOnChange,
        terme,
        résultats,
    } = useRechercheAvancee();

    useBreadcrumb([
        {
            label: wording.RECHERCHE_AVANCEE_LABEL,
            path: "",
        },
    ]);

    return (
        <main className="fr-container">
            <RechercheAvanceeFormulaire lancerLaRecherche={lancerLaRecherche} rechercheOnChange={rechercheOnChange} terme={terme} />
            {estCeQueLesRésultatsSontReçus && <ResultatRechercheAvancee data={résultats} />}
            {!estCeQueLaRechercheEstLancee && <ResultatRecherchePlaceholderText />}
            {estCeEnAttente && <RechercheEnAttente />}
        </main>
    );
}