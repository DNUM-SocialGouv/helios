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
    <FormulaireChangeMdp annuler={annuler} changePassword={changePassword} confirmPasswordValue={confirmPasswordValue} confirmPasswordValueOnChange={confirmPasswordValueOnChange} errorMessage={errorMessage} passwordValue={passwordValue} passwordValueOnChange={passwordValueOnChange}
    />
  );
};