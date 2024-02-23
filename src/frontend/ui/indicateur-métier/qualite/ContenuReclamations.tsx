import { ReactElement } from "react";

import { useDependencies } from "../../commun/contexts/useDependencies";

type ContenuReclamationsProps = Readonly<{
    dateDeMiseÀJour: string;
    source: ReactElement;
}>;

export const ContenuReclamations = ({ dateDeMiseÀJour, source }: ContenuReclamationsProps) => {
    const { wording } = useDependencies();

    return (
        <>
            <p>{wording.miseÀJourEtSource(dateDeMiseÀJour, source)}</p>
        </>
    );
};
