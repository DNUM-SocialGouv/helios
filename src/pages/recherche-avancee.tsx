import { useState } from "react";

import { useDependencies } from "../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../frontend/ui/commun/hooks/useBreadcrumb";
import { RechercheEnAttente } from "../frontend/ui/home/RechercheEnAttente";
import { RechercheAvanceeFormulaire } from "../frontend/ui/recherche-avancee/RechecheAvanceeFormulaire";
import { ResultatRechercheBLocText } from "../frontend/ui/recherche-avancee/ResultatRechercheBlocText";



export default function RechercheAvancee() {
    const { wording } = useDependencies();
    const [estCeEnAttente, setEstCeEnAttente] = useState(false);
    const [estCeQueLesRésultatsSontReçus, setEstCeQueLesRésultatsSontReçus] = useState(false);

    useBreadcrumb([
        {
            label: wording.RECHERCHE_AVANCEE_LABEL,
            path: "",
        },
    ]);

    return (
        <main className="fr-container">
            <RechercheAvanceeFormulaire setEstCeEnAttente={setEstCeEnAttente} setEstCeQueLesRésultatsSontReçus={setEstCeQueLesRésultatsSontReçus} />
            {!estCeQueLesRésultatsSontReçus && <div className="fr-mt-5w fr-mb-5w">{wording.RECHERCHE_AVANCEE_TEXT}</div>}
            {estCeQueLesRésultatsSontReçus ? <div> le tableau du résultat </div> : <ResultatRechercheBLocText />}
            {estCeEnAttente && <RechercheEnAttente />}
        </main>
    );
}