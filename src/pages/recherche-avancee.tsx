import { useDependencies } from "../frontend/ui/commun/contexts/useDependencies";
import { useBreadcrumb } from "../frontend/ui/commun/hooks/useBreadcrumb";
import Spinner from "../frontend/ui/commun/Spinner/Spinner";
import { RechercheAvanceeFormulaire } from "../frontend/ui/recherche-avancee/RechecheAvanceeFormulaire";
import { ResultatRechercheAvancee } from "../frontend/ui/recherche-avancee/ResultatRechercheAvancee";
import { useRechercheAvancee } from "../frontend/ui/recherche-avancee/useRechercheAvancee";



export default function RechercheAvancee() {
    const { wording } = useDependencies();
    const {
        estCeEnAttente, 
        estCeQueLesRésultatsSontReçus,
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
            {estCeEnAttente && <Spinner />}
        </main>
    );
}