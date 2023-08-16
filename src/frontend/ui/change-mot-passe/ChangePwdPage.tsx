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
        updated
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
                oldPasswordValue={oldPasswordValue}
                oldPasswordValueOnChange={oldPasswordValueOnChange}
                passwordValue={passwordValue}
                passwordValueOnChange={passwordValueOnChange}
                updated={updated}
            />
        </main>
    );
};
