import "@gouvfr/dsfr/dist/component/tab/tab.min.css";

import { ChangePwdPage } from "../change-mot-passe/ChangePwdPage";
import { TabContent } from "../commun/Tabs/tabContent";
import { Tabs } from "../commun/Tabs/tabs";
import { UserInfoTab } from "./UserInfoTab";

export const ProfilePage = () => {

  return (
    <main className="fr-container" id="content">
      <Tabs labels={[{ text: "Mes informations", tabId: "1" }, { text: "Mot de passe", tabId: "2" }]}>
        <TabContent index="1">
          <UserInfoTab />
        </TabContent>
        <TabContent index="2">
          <ChangePwdPage />
        </TabContent>
      </Tabs>

    </main>
  );
};
