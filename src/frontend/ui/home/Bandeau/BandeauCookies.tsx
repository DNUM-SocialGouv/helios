import "@gouvfr/dsfr/dist/component/notice/notice.min.css";

type BandeauDCookiesProps = Readonly<{
  texte: string;
}>;
export const BandeauCookies = ({ texte }: BandeauDCookiesProps) => {
  return (
    <div className="fr-notice fr-notice--info">
      <div className="fr-container">
        <div className="fr-notice__body">
          <p className="fr-notice__title">{texte}</p>
        </div>
      </div>
    </div>
  );
};
