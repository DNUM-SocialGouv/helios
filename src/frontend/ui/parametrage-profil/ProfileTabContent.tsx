import { useDependencies } from "../commun/contexts/useDependencies";

type ProfileTabCobntentProps = Readonly<{
    idTabPanel: string;
    institution: string;
    autreRégion: string;
}>;

export const ProfileTabContent = ({
    idTabPanel,
    institution,
    autreRégion,
}: ProfileTabCobntentProps) => {
    const { wording } = useDependencies();

    return (
        <div className="fr-tabs__panel fr-tabs__panel--selected" id={idTabPanel}>
            <p>Contenu 1</p>
        </div>
    );
};