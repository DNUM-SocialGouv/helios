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
    isLoading
  } = useChangeMdp();

  return (
    <main className="fr-container">
      <FormulaireChangeMdp
        annuler={annuler}
        changePassword={changePassword}
        confirmPasswordValue={confirmPasswordValue}
        confirmPasswordValueOnChange={confirmPasswordValueOnChange}
        errorMessage={errorMessage}
        isLoading={isLoading}
        passwordValue={passwordValue}
        passwordValueOnChange={passwordValueOnChange}
      />
    </main>
  );
};