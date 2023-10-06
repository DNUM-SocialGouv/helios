import "@gouvfr/dsfr/dist/component/callout/callout.min.css";
import { ReactElement } from "react";

import { useDependencies } from "../contexts/useDependencies";

type NoDataCalloutProps = Readonly<{
    indicateurs: (string | ReactElement)[];
}>;

export const NoDataCallout = ({ indicateurs }: NoDataCalloutProps) => {
    const { wording } = useDependencies();

    return (
        <div className="fr-callout">
            <p className="fr-callout__title"> {wording.AUCUNE_DONNÉE_RENSEIGNÉE_INDICATEURS} </p>
            <ul>
                {indicateurs?.map(((indicateur, index) => (
                    <li className="fr-callout__text" key={index} >
                        {indicateur}
                    </li>
                )))}
            </ul>
        </div>
    );
};
