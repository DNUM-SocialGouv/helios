import { useDependencies } from "../commun/contexts/useDependencies";

export interface MessageHistorique {
  id: number;
  contenu: string;
  dateDebut: string;
  dateFin: string ;
  badgeType?: string | null;
  badgeLibelle?: string | null;
  dateCreation?: string;
}

interface TableauHistoriqueProps {
  messages: MessageHistorique[] | null;
}

export function TableauHistorique({ messages }: TableauHistoriqueProps) {
  const { wording } = useDependencies();

  if (messages === null) {
    return (
      <div className="fr-mt-8w fr-grid-row fr-grid-row--center">
        <div aria-label="Chargement en cours" className="fr-spinner">Chargement…</div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="fr-mt-8w">
        <p className="fr-text--lg">Aucun message publié sur les 18 derniers mois.</p>
      </div>
    );
  }

  return (
    <div className="fr-table fr-mt-8w ">
        <table>
            <thead>
                <tr>
                    <th scope="col">{wording.PERIODE_AFFICHAGE}</th>
                    <th scope="col">{wording.MESSAGE}</th> 
                </tr>
            </thead>
            <tbody>
                {messages.map((message) => (
                <tr key={message.id}>
                    <td>
                        {new Date(message.dateDebut).toLocaleDateString()} - {new Date(message.dateFin).toLocaleDateString()}
                    </td>
                    <td>
                        <>
                            {message.badgeType && message.badgeLibelle && (
                            <>
                                <span>Tag: </span>
                                <span>
                                    {message.badgeLibelle}
                                </span>
                            </>
                            )}
                            <div>Texte: {message.contenu}</div> 
                        </>
                    </td>
                </tr>
                ))}
            </tbody>
        </table>
    </div>
  );
}
