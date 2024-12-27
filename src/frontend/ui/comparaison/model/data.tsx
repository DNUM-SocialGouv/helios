export const moyenneInitialValues = {
  capaciteMoyenne: 0,
  realisationAcitiviteMoyenne: 0,
  fileActivePersonnesAccompagnesMoyenne: 0,
  hebergementPermanentMoyenne: 0,
  hebergementTemporaireMoyenne: 0,
  acceuilDeJourMoyenne: 0,
  prestationExterneMoyenne: 0,
  rotationPersonnelMoyenne: 0,
  etpVacantMoyenne: 0,
  absenteismeMoyenne: 0,
  tauxCafMoyenne: 0,
  vetusteConstructionMoyenne: 0,
  roulementNetGlobalMoyenne: 0,
  resultatNetComptableMoyenne: 0,
};

export const checkFillSvg = (color: string) => {
  return (
    <svg fill={color} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z"></path>
    </svg>
  );
};
