import "@gouvfr/dsfr/dist/component/tab/tab.min.css";
import { ReactNode } from "react";

export const TabContent = ({ children, index }: { index: string; children: ReactNode }) => {
  return (
    <div className={index === '1' ? "fr-tabs__panel fr-tabs__panel--selected" : "fr-tabs__panel"} id={`tabpanel-${index}`} role="tabpanel" >
      {children}
    </div>
  )
}
