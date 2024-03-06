import { ReactElement } from "react";

import { useDependencies } from "../../commun/contexts/useDependencies";

type ContenuEvenementsIndesirablesProps = Readonly<{
    dateDeMiseÀJour: string;
    source: ReactElement;
}>;

export const ContenuEvenementsIndesirables = ({ dateDeMiseÀJour, source }: ContenuEvenementsIndesirablesProps) => {
    const { wording } = useDependencies();

    return (
        <>
            <p>{wording.miseÀJourEtSource(dateDeMiseÀJour, source)}</p>
        </>
    );
};
