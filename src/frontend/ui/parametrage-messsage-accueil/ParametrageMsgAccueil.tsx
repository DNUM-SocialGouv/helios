import { useEffect, useState } from "react";

import { DefinirMsgForm } from "./DefinirMsgForm";
import { MenuSections } from "./MenuSections";
import { TableauHistorique, MessageHistorique } from "./TableauHistorique";
import { useDependencies } from "../commun/contexts/useDependencies";

export function ParametrageMsgAccueil() {
  const { wording } = useDependencies();
  const [messages, setMessages] = useState<MessageHistorique[] | null>(null);
  
  const ParametrageMsgAccueilSelections = [wording.PARAMETRAGE_DEFINIR_MESSAGE_ACCUEIL, wording.PARAMETRAGE_MESSAGE_ACCUEIL_HISTORIQUE];
  
  const [slugSelectionne, setSlugSelectionne] = useState<string>(ParametrageMsgAccueilSelections[0]);

  useEffect(() => {
    if (slugSelectionne === wording.PARAMETRAGE_MESSAGE_ACCUEIL_HISTORIQUE) {
      fetch("/api/messages-accueil")
        .then((res) => res.ok ? res.json() : [])
        .then((data) => setMessages(data));
    }
  }, [slugSelectionne, wording.PARAMETRAGE_MESSAGE_ACCUEIL_HISTORIQUE]);
  

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
           <div className="fr-card fr-card--shadow fr-card--no-border" style={{ border: "1px solid #e5e5f4", borderRadius: "0.5rem", padding: "1rem 1.5rem" }}>
            <header className="fr-mb-4w">
              <div className="fr-grid-row fr-grid-row--middle fr-grid-row--gutters">
                  <h2 className="fr-h3 fr-m-0">{slugSelectionne}</h2>
              </div>
            </header>
            {slugSelectionne === wording.PARAMETRAGE_DEFINIR_MESSAGE_ACCUEIL && <DefinirMsgForm />}
            {slugSelectionne === wording.PARAMETRAGE_MESSAGE_ACCUEIL_HISTORIQUE && <TableauHistorique messages={messages} />}  
          </div>
         </section>
       </div>
    </div>
  </main>;
}
