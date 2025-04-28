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
        criteriaNewPassword,
    } = useChangeMdp();

    return (
        <FormulaireChangeMdp
            annuler={annuler}
            changePassword={changePassword}
            confirmPasswordValue={confirmPasswordValue}
            confirmPasswordValueOnChange={confirmPasswordValueOnChange}
            criteriaNewPassword={criteriaNewPassword}
            errorMessage={errorMessage}
            isLoading={isLoading}
            oldPasswordValue={oldPasswordValue}
            oldPasswordValueOnChange={oldPasswordValueOnChange}
            passwordValue={passwordValue}
            passwordValueOnChange={passwordValueOnChange}
            updated={updated}
        />
    );
};
