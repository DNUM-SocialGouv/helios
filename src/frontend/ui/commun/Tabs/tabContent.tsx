import "@gouvfr/dsfr/dist/component/tab/tab.min.css";
import { ReactChild } from "react";

export const TabContent = ({ children, index, selected }: { index: string; children: ReactChild, selected: boolean }) => {
    return (
        <div aria-labelledby={`tabpanel-${index}`} className={selected ? "fr-tabs__panel fr-tabs__panel--selected" : "fr-tabs__panel fr-tabs__panel"} role="tabpanel" >
            {children}
        </div>
    )
}