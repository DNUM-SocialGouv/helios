import { FormulaireChangeMdp } from "./FormulaireChangeMdp";
import { useChangeMdp } from "./useChangeMdp";

export const PageChangeMotPasse = () => {

  const {
    passwordValue,
    passwordValueOnChange, 
    changePassword,
    confirmPasswordValue,
    confirmPasswordValueOnChange,
    annuler,
    errorMessage,
  } = useChangeMdp();

  return (
      <FormulaireChangeMdp changePassword={changePassword} annuler={annuler} passwordValueOnChange={passwordValueOnChange} confirmPasswordValueOnChange={confirmPasswordValueOnChange} passwordValue={passwordValue} confirmPasswordValue={confirmPasswordValue} errorMessage={errorMessage} />
  );
};
