import { useDependencies } from "../commun/contexts/useDependencies";
import { Navigation } from "../commun/Navigation/Navigation";
import { FormulaireChangeMdp } from "./FormulaireChangePwd";
import { useChangeMdp } from "./useChangeMdp";

export const ChangePwdPage = () => {
  const {
    passwordValue,
    passwordValueOnChange,
    changePassword,
    oldPasswordValue,
    oldPasswordValueOnChange,
    confirmPasswordValue,
    confirmPasswordValueOnChange,
    annuler,
    errorMessage,
    isLoading,
    updated,
  } = useChangeMdp();

  const { wording } = useDependencies();

  return (
    <main className="fr-container">
      <Navigation
        current_url="change-mot-passe"
        data={[
          { name: wording.MES_INFORMATIONS, url: "profile" },
          { name: 'Mes préférences', url: "parametrage" },
          { name: wording.MOT_DE_PASSE_, url: "change-mot-passe" },
        ]}
      />
      <FormulaireChangeMdp
        annuler={annuler}
        changePassword={changePassword}
        confirmPasswordValue={confirmPasswordValue}
        confirmPasswordValueOnChange={confirmPasswordValueOnChange}
        errorMessage={errorMessage}
        isLoading={isLoading}
        oldPasswordValue={oldPasswordValue}
        oldPasswordValueOnChange={oldPasswordValueOnChange}
        passwordValue={passwordValue}
        passwordValueOnChange={passwordValueOnChange}
        updated={updated}
      />
    </main>
  );
};
