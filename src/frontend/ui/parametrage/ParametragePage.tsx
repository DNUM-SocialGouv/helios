import { useSession } from "next-auth/react";
import { useState } from "react";

import { useDependencies } from "../commun/contexts/useDependencies";
import { Navigation } from "../commun/Navigation/Navigation";
import styles from "./Parametrage.module.css";

export const ParametragePage = () => {
  const { wording } = useDependencies();
  const { data } = useSession();
  const [plierAll, setPlierAll] = useState(false);


  console.log('data ::::',data)
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;    
    setPlierAll(checked)
  };

  return (
    <main className="fr-container">
      <Navigation
        current_url="parametrage"
        data={[
          { name: wording.MES_INFORMATIONS, url: "profile" },
          { name: 'Mes préférences', url: "parametrage" },
          { name: wording.MOT_DE_PASSE_, url: "change-mot-passe" },
        ]}
      />

      <div className="fr-grid-row fr-grid-row--center">
        <section className="fr-col-8 fr-mt-5w">
          <h1 className={styles["title"]}>Mes préférences</h1>
    

          Pour personnaliser l’affichage des fiches établissement, merci de renseigner les champs suivants.
Vos choix s’appliqueront à tous les types d’établissements.<br/>
A l’ouverture d’une fiche établissement, l’ensemble des blocs sont dépliés


          {/* <div className="fr-checkbox-group">
     
            <input
              aria-describedby="checkboxes-plierAll-messages"
              checked={plierAll}
              id="plierAll"
              name="profiles"
              onChange={handleChange}
              type="checkbox"
              value="plierAll"
            />
            <label className="fr-label" htmlFor="plierAll">
              Plier les blocs
            </label>
          </div> */}
        </section>
      </div>
    </main>
  );
};
