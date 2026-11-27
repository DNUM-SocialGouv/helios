
import "@gouvfr/dsfr/dist/component/connect/connect.min.css";

export const BoutonProConnect = ({ handleProconnect }: { handleProconnect: () => void }) => {
  return (
    <div className="fr-connect-group">
    <button className="fr-connect fr-connect--pro" onClick={handleProconnect} 
    type="button">
        <span className="fr-connect__login">S’identifier avec</span>
        <span className="fr-connect__brand">ProConnect</span>
    </button>
    <p>
        <a 
            href="https://proconnect.gouv.fr/" 
            rel="noopener noreferrer" 
            target="_blank" 
            title="Qu’est-ce que ProConnect ? - nouvelle fenêtre"
        >
            Qu’est-ce que ProConnect ?
        </a>
    </p>
</div>
  );
};