import { useState } from "react";

import { MenuSections } from "./MenuSections";
import { useDependencies } from "../commun/contexts/useDependencies";



export function ParametrageMsgAccueil() {
  const { wording } = useDependencies();
  
  const ParametrageMsgAccueilSelections = [wording.PARAMETRAGE_DEFINIR_MESSAGE_ACCUEIL, wording.PARAMETRAGE_MESSAGE_ACCUEIL_HISTORIQUE];
  
  const [slugSelectionne, setSlugSelectionne] = useState<string>(ParametrageMsgAccueilSelections[0]);
  

  return <main id="content">
     <div className="fr-container fr-pt-6w fr-pb-6w">
      <header className="fr-mb-6w">
        <h1 className="fr-h2">{wording.PARAMETRAGE_MESSAGE_ACCUEIL_TITRE}</h1>
      </header>

      <div className="fr-grid-row fr-grid-row--gutters">
        <aside className="fr-col-12 fr-col-md-3">
          <MenuSections 
            sections={ParametrageMsgAccueilSelections}
            slugActif={slugSelectionne}
            surSelection={setSlugSelectionne}
          />
        </aside>
         <section className="fr-col-12 fr-col-md-9">
          {slugSelectionne === wording.PARAMETRAGE_DEFINIR_MESSAGE_ACCUEIL && <div>{wording.PARAMETRAGE_DEFINIR_MESSAGE_ACCUEIL}</div>}
          {slugSelectionne === wording.PARAMETRAGE_MESSAGE_ACCUEIL_HISTORIQUE && <div>{wording.PARAMETRAGE_MESSAGE_ACCUEIL_HISTORIQUE}</div>}  
         </section>
       </div>
    </div>
  </main>;
}
