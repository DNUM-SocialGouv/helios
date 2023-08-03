import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ChangeEvent, FormEvent, MouseEvent, useState } from "react";

import { useDependencies } from "../commun/contexts/useDependencies";


export function useChangeMdp() {
    const router = useRouter();
    const { wording } = useDependencies();

    const [oldPasswordValue, setOldPasswordValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");
    const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [updated, setUpdated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { data } = useSession();

    const annuler = (event: MouseEvent) => {
        event.preventDefault();
        router.push("/");
    };

    const oldPasswordValueOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        setOldPasswordValue(event.target.value);
    }

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
        fetch("/api/update-password", {
            body: JSON.stringify({ email: data?.user?.email, password: passwordValue, oldPassword: oldPasswordValue }),
            headers: { "Content-Type": "application/json" },
            method: "POST",
        })
            .then(async (response) => {
                setIsLoading(false)
                const data = await response.json();

                if (response.status === 200) {
                    setUpdated(true);
                    setErrorMessage("");
                }
                if (response.status === 400) {
                    setUpdated(false);
                    if (data.err === "wrong old password") {
                        setErrorMessage(wording.OLD_MOT_DE_PASSE);
                    } else {
                        if (data.err === "The password must be different from the current password") {
                            setErrorMessage(wording.DIFFERENT_MOT_PASSE);
                        } else {
                            setErrorMessage(wording.INVALID_REQUEST);
                        }
                    }
                }
            })
            .catch(() => {
                setUpdated(false);
                setIsLoading(false)
                setErrorMessage(wording.SOMETHING_WENT_WRONG);
            });
    }


    return {
        passwordValue,
        confirmPasswordValue,
        oldPasswordValue,
        changePassword,
        passwordValueOnChange,
        oldPasswordValueOnChange,
        confirmPasswordValueOnChange,
        annuler,
        errorMessage,
        updated,
        isLoading
    }
}
