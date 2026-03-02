import "@gouvfr/dsfr/dist/component/tab/tab.min.css";
import { ReactNode } from "react";

export const TabContent = ({ children, index, selectedIndex }: { index: string; children: ReactNode, selectedIndex: string }) => {
  return (
    <div className={index === selectedIndex ? "fr-tabs__panel fr-tabs__panel--selected" : "fr-tabs__panel"} id={`tabpanel-${index}`} role="tabpanel" >
      {children}
    </div>
  )
}
