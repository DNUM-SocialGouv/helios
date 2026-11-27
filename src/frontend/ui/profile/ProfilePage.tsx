import "@gouvfr/dsfr/dist/component/tab/tab.min.css";

import { useState } from "react";

import { UserInfoTab } from "./UserInfoTab";
import { TabContent } from "../commun/Tabs/tabContent";
import { Tabs } from "../commun/Tabs/tabs";

function getInitialTab(): string {
  if (typeof window === "undefined") return "1";
  return window.location.hash.replace("#", "") || "1";
}


export const ProfilePage = () => {

  const [selectedIndex, setSelectedIndex] = useState(getInitialTab);

  return (
    <Tabs
      labels={[{ text: "Mes informations", tabId: "1" }]}
      onTabChange={(id) => {
        setSelectedIndex(id);
        window.history.replaceState(null, "", `#${id}`);
      }}
      selectedIndex={selectedIndex}
    >
      <TabContent index="1" selectedIndex={selectedIndex}>
        <UserInfoTab />
      </TabContent>
    </Tabs>
  );
};
