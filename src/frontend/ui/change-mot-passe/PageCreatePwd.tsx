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
        isLoading
    } = useReinitialisationMdp();

    return (
        <main className="fr-container">
            <FormulaireCreatePwd
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
