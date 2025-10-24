import { EquipementsMateriauxLourdsActivités } from "../../../../backend/métier/entities/entité-juridique/EntitéJuridiqueAutorisationEtCapacité";
import { useDependencies } from "../../commun/contexts/useDependencies";
import { IndicateurGraphique } from "../../commun/IndicateurGraphique/IndicateurGraphique";
import { Sources } from "../../commun/Sources/Sources";
import { EquipementsTagMultiniveaux } from "../../entité-juridique/bloc-autorisations-capacites/EquipementsTagMultiNiveaux";
import { ContenuÉquipementsMatérielsLourds } from "../../établissement-territorial-sanitaire/InfoBulle/ContenuÉquipementsMatérielsLourds";

type GraphiqueEquipementMateriauxLourdsProps = Readonly<{
  entiteJuridiqueEquipementLourds: EquipementsMateriauxLourdsActivités;
}>;

export const GraphiqueEquipementMateriauxLourds = ({ entiteJuridiqueEquipementLourds }: GraphiqueEquipementMateriauxLourdsProps) => {
  const { wording } = useDependencies();
  return (
    <IndicateurGraphique
      contenuInfoBulle={
        <ContenuÉquipementsMatérielsLourds
          dateDeMiseÀJour={entiteJuridiqueEquipementLourds.dateMiseÀJourSource}
          estEntitéJuridique={true}
          source={Sources(wording.FINESS, wording.SI_AUTORISATIONS)}
        />
      }
      dateDeMiseÀJour={entiteJuridiqueEquipementLourds.dateMiseÀJourSource}
      identifiant="equipement-materiaux-lourds"
      nomDeLIndicateur={wording.ÉQUIPEMENTS_MATÉRIELS_LOURDS}
      source={Sources(wording.FINESS, wording.SI_AUTORISATIONS)}
    >
      <EquipementsTagMultiniveaux equipementLourds={entiteJuridiqueEquipementLourds.autorisations} />
    </IndicateurGraphique>
  );
};
