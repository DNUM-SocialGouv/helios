import { FormulaireChangeMdp } from "./FormulaireReinitialisationMdp";
import { useReinitialisationMdp } from "./useReinitialisationMdp";

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
  } = useReinitialisationMdp();

  return (
    <main className="fr-container" id="content">
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
