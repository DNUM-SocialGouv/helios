import { useRouter } from 'next/router';
import { ChangeEvent, FormEvent, MouseEvent, useContext, useState } from "react";

import { useDependencies } from "../commun/contexts/useDependencies";
import { UserContext } from '../commun/contexts/userContext';


export function useReinitialisationMdp() {
    const router = useRouter();
    const { wording } = useDependencies();
    const userContext = useContext(UserContext);

    const [passwordValue, setPasswordValue] = useState("");
    const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { loginToken } = router.query;

    const annuler = (event: MouseEvent) => {
        event.preventDefault();
        router.push("/connexion");
    };

    const passwordValueOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPasswordValue(event.target.value);
    }

    const confirmPasswordValueOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        setConfirmPasswordValue(event.target.value);
    }

    const changePassword = (event: FormEvent) => {
        event.preventDefault();
        if (passwordValue !== confirmPasswordValue) {
            setErrorMessage("Les mots de passe ne correspondent pas.");
        }
        else {
            changePasswordService();
        }
    }

    const changePasswordService = () => {
        setIsLoading(true)
        fetch("/api/change-mot-passe", {
            body: JSON.stringify({ loginToken: loginToken, password: passwordValue }),
            headers: { "Content-Type": "application/json" },
            method: "POST",
        })
            .then(async (response) => {
                setIsLoading(false)
                const data = await response.json();

                if (response.status === 200) {
                    setErrorMessage("");
                    userContext?.setPasswordCreated(true);
                    router.push("/connexion")
                }
                if (response.status === 400) {
                    if (data.err === "The password must be different from the current password") {
                        setErrorMessage(wording.OLD_MOT_DE_PASSE_REINITIALISATION);
                    } else {
                        setErrorMessage(wording.SOMETHING_WENT_WRONG);
                    }
                }
            })
            .catch(() => {
                setIsLoading(false)
                setErrorMessage(wording.SOMETHING_WENT_WRONG);
            });
    }


    return {
        passwordValue,
        confirmPasswordValue,
        changePassword,
        passwordValueOnChange,
        confirmPasswordValueOnChange,
        annuler,
        errorMessage,
        isLoading
    }
}
