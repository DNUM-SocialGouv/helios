import { FormulaireCreatePwd } from "./FormulaireCreatePwd";
import { useReinitialisationMdp } from "./useReinitialisationMdp";

export const PageCreatePwd = () => {

  const {
    passwordValue,
    passwordValueOnChange,
    changePassword,
    confirmPasswordValue,
    confirmPasswordValueOnChange,
    annuler,
    errorMessage,
    isLoading,
    criteriaNewPassword,
  } = useReinitialisationMdp();

  return (
    <main className="fr-container" id="content">
      <FormulaireCreatePwd
        annuler={annuler}
        changePassword={changePassword}
        confirmPasswordValue={confirmPasswordValue}
        confirmPasswordValueOnChange={confirmPasswordValueOnChange}
        criteriaNewPassword={criteriaNewPassword}
        errorMessage={errorMessage}
        isLoading={isLoading}
        passwordValue={passwordValue}
        passwordValueOnChange={passwordValueOnChange}
      />
    </main>
  );
};
