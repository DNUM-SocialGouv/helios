import { useRouter } from 'next/router';
import { ChangeEvent, FormEvent, MouseEvent, useState } from "react";

import { useDependencies } from "../commun/contexts/useDependencies";


export function useChangeMdp() {
    const router = useRouter();
    const { wording } = useDependencies();

    const [passwordValue, setPasswordValue] = useState("");
    const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const { loginToken } = router.query;

    const annuler = (event: MouseEvent) => {
        event.preventDefault();
        router.push("/");
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
        fetch("/api/change-mot-passe", {
            body: JSON.stringify({ loginToken: loginToken, password: passwordValue }),
            headers: { "Content-Type": "application/json" },
            method: "POST",
        })
            .then((response) => {
                response.json()
                if (response.status === 200) {
                    router.push("/")
                }
            })
            .catch(() => {
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
    }
}
