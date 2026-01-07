import { useContext, useEffect, useState } from "react";

import styles from "./Favoris.module.css";
import { FavorisBlock } from "./FavorisBlock";
import { useDependencies } from "../commun/contexts/useDependencies";
import { UserContext } from "../commun/contexts/userContext";
import { ImportListModal } from "../liste/ImportListModal";
import { UserListViewModel } from "../user-list/UserListViewModel";

export const FavorisPage = () => {
  const { wording } = useDependencies();
  const userContext = useContext(UserContext);

  const [sortedFavorisList, setSortedFavorisList] = useState(userContext?.favorisLists);
  const [displaySucessMessage, setDisplaySucessMessage] = useState<boolean>(false);

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

  const onSucess = () => {
    setDisplaySucessMessage(true);
  }

  return (
    <>
      <div className={styles["actionButton"]}>
        <button aria-controls="fr-modal-import-list" className="fr-btn fr-btn--secondary fr-btn--icon-left fr-icon-upload-line" data-fr-opened="false"> {wording.IMPORTER_UNE_LISTE} </button>
      </div>
      <ImportListModal onSuccess={onSucess} />
      <h1 className={styles["title"]}>{wording.FAVORIS_LIST} ({userContext?.favorisLists?.length})</h1>
      {displaySucessMessage &&
        <div className="fr-alert fr-alert--success fr-alert--sm">
          <h3 className="fr-alert__title">{wording.IMPORT_SUCCESS_TITLE}</h3>
          <p>{wording.IMPORT_SUCESS_MESSAGE}</p>
        </div>
      }
      {sortedFavorisList?.map((liste: UserListViewModel) => (
        <div key={liste.id}>
          <FavorisBlock currentListId={liste.id} favorisList={liste.userListEtablissements} title={liste.nom} />
        </div>
      ))}
    </>
  );
};
