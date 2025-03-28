import { useContext, useEffect, useState } from "react";

import styles from "./Favoris.module.css";
import { FavorisBlock } from "./FavorisBlock";
import { useDependencies } from "../commun/contexts/useDependencies";
import { UserContext } from "../commun/contexts/userContext";
import { UserListViewModel } from "../user-list/UserListViewModel";

export const FavorisPage = () => {
  const { wording } = useDependencies();
  const userContext = useContext(UserContext);

  const [sortedFavorisList, setSortedFavorisList] = useState(userContext?.favorisLists);

  useEffect(() => {
    let list = userContext?.favorisLists.slice();
    if (list) {
      const favorisListIndex = list.findIndex((list) => list.isFavoris);
      const favorisList = list.splice(favorisListIndex, 1);
      list.sort((a: UserListViewModel, b: UserListViewModel) => new Date(a.dateCreation).getTime() - new Date(b.dateCreation).getTime());
      list = favorisList.concat(...list);
    }

    setSortedFavorisList(list);
  }, [userContext?.favorisLists])

  return (
    <main className="fr-container" id="content">
      <h1 className={styles["title"]}>{wording.FAVORIS_LIST} ({userContext?.favorisLists?.length})</h1>
      {sortedFavorisList?.map((liste: UserListViewModel) => (
        <div key={liste.id}>
          <FavorisBlock currentListId={liste.id} favorisList={liste.userListEtablissements} title={liste.nom} />
        </div>
      ))}
    </main>
  );
};
