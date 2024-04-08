import { useDependencies } from "../contexts/useDependencies";

type BtnDownloadPDFProps = Readonly<{
  handlePrint: () => void;
}>;

export const BtnDownloadPDF = ({ handlePrint }: BtnDownloadPDFProps) => {
  const { wording } = useDependencies();

  return (
    <button
      className="fr-btn fr-btn--secondary fr-fi-download-line fr-btn--icon-left"
      name={wording.TÉLÉCHARGER_EN_PDF}
      onClick={handlePrint}
      title={wording.TÉLÉCHARGER_EN_PDF}
      type="button"
    >
      {wording.TÉLÉCHARGER_EN_PDF}
    </button>
  );
};
