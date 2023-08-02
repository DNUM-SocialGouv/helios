import { useRouter } from 'next/router';
import { ChangeEvent, FormEvent, MouseEvent, useState } from "react";

import { useDependencies } from "../commun/contexts/useDependencies";


export function useChangeMdp() {
    const router = useRouter();
    const { wording } = useDependencies();

    const [passwordValue, setPasswordValue] = useState("");
    const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [validToken, setValidToken] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

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
        setIsLoading(true)
        fetch("/api/change-mot-passe", {
            body: JSON.stringify({ loginToken: loginToken, password: passwordValue }),
            headers: { "Content-Type": "application/json" },
            method: "POST",
        })
            .then((response) => {
                setIsLoading(false)
                response.json()
                if (response.status === 200) {
                    router.push("/")
                }
                if (response.status === 400) {
                    setErrorMessage(wording.INVALID_REQUEST);
                }
            })
            .catch(() => {
                setIsLoading(false)
                setErrorMessage(wording.SOMETHING_WENT_WRONG);
            });
    }

    const checkTokenService = async (token: string) => {
        fetch("/api/check-token", {
            body: JSON.stringify({ token }),
            headers: { "Content-Type": "application/json" },
            method: "POST",
        })
            .then((response) => response.json())
            .then((data) => {
                setIsChecking(false);
                if (data.info.email) {
                    setValidToken(true);
                }
            })
            .catch(() => {
                setIsChecking(false);
                setValidToken(false);
            });
    }


    return {
        passwordValue,
        confirmPasswordValue,
        validToken,
        isChecking,
        changePassword,
        passwordValueOnChange,
        confirmPasswordValueOnChange,
        annuler,
        checkTokenService,
        errorMessage,
        isLoading
    }
}
