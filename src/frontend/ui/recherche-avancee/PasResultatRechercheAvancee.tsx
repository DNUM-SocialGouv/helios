import { useContext } from "react";

import { RechercheAvanceeContext } from "../commun/contexts/RechercheAvanceeContext";
import { useDependencies } from "../commun/contexts/useDependencies";

export const PasResultatRechercheAvancee = () => {
    const { wording } = useDependencies();
    const rechercheAvanceeContext = useContext(RechercheAvanceeContext);

    return (
        <>
            {!rechercheAvanceeContext?.terme ? (
                <div className="fr-mt-5w">
                    {wording.AUCUN_RESULTAT_RECHERCHE_AVANCEE_TEXT}.
                </div>
            ) : rechercheAvanceeContext?.zoneGeo || rechercheAvanceeContext?.typeStructure || rechercheAvanceeContext?.statutJuridiqueStructure.length !== 0 || rechercheAvanceeContext?.capaciteAgees.length !== 0 || rechercheAvanceeContext?.capaciteHandicap.length !== 0 || rechercheAvanceeContext?.capaciteMedicoSociaux.length !== 0 ? (
                <div className="fr-mt-5w">
                    {wording.AUCUN_RESULTAT_RECHERCHE_AVANCEE_TEXT}.
                </div>
            ) : (
                <div className="fr-mt-5w">
                    {wording.AUCUN_RESULTAT_RECHERCHE_AVANCEE_TEXT}  {rechercheAvanceeContext?.terme}.
                </div>
            )}
        </>
    )
};
