import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { PageCreatePwd } from "../frontend/ui/change-mot-passe/PageCreatePwd";
import { useChangeMdp } from "../frontend/ui/change-mot-passe/useChangeMdp";
import Spinner from "../frontend/ui/commun/Spinner/Spinner";
import { Page404 } from "../frontend/ui/erreurs/Page404";

export default function CreerMotPasse() {
    const router = useRouter();
    const [token, setToken] = useState('');

    const {
        checkTokenService,
        validToken,
        isChecking,
    } = useChangeMdp();


    useEffect(() => {
        if (router.isReady) {
            const { loginToken } = router.query;
            setToken(loginToken as string);
        }
    }, [router.isReady]);

    if (token) {

        checkTokenService(token);
        return (
            <>
                {isChecking ? <Spinner /> : validToken ? (
                    <PageCreatePwd />
                ) : (
                    <Page404 />
                )}
            </>
        );
    } else {
        return null;

    }
}
