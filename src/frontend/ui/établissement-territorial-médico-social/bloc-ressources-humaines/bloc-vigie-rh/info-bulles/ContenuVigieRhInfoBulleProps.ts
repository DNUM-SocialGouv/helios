import { Wording } from "../../../../../configuration/wording/Wording";
import { StringFormater } from "../../../../commun/StringFormater";

export type ContenuVigieRhInfoBulleProps = Readonly<{
  dateDeMiseAJour: string;
  dateDonneesArretees?: string | null;
  periodeGlissante?: string | null;
}>;

export const formaterMiseAJourEtDonnees = (
  wording: Wording,
  dateDeMiseAJour?: string,
  dateDonneesArretees?: string | null,
): string => {
  const dateMaj = dateDeMiseAJour && dateDeMiseAJour.trim().length > 0 ? dateDeMiseAJour : wording.NON_RENSEIGNÉ;
  const arretees = dateDonneesArretees ? StringFormater.formatDate(dateDonneesArretees) : wording.NON_RENSEIGNÉ;
  return `${wording.miseÀJour(dateMaj)} - ${wording.DONNEES_ARRETEES} ${arretees}`;
};
