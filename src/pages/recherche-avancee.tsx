import { useDependencies } from "../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../frontend/ui/commun/hooks/useBreadcrumb";
import { RechercheAvanceeFormulaire } from "../frontend/ui/recherche-avancee/RechecheAvanceeFormulaire";
import { ResultatRechercheBLocText } from "../frontend/ui/recherche-avancee/ResultatRechercheBlocText";



export default function RechercheAvancee() {
    const { wording } = useDependencies();

    useBreadcrumb([
        {
            label: wording.RECHERCHE_AVANCEE_LABEL,
            path: "",
        },
    ]);

    return (
        <main className="fr-container">
            <RechercheAvanceeFormulaire />
            <div className="fr-mt-5w fr-mb-5w">{wording.RECHERCHE_AVANCEE_TEXT}</div>
            <ResultatRechercheBLocText />
        </main>
    );
}