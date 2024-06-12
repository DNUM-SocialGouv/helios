import { GetServerSidePropsContext, GetStaticPropsResult } from "next";
import { getSession } from "next-auth/react";

import { rechercheParmiLesEntitésEtÉtablissementsEndpoint } from "../../backend/infrastructure/controllers/rechercheEndpoints";
import { récupèreLÉtablissementTerritorialSanitaireEndpoint } from "../../backend/infrastructure/controllers/récupèreLÉtablissementTerritorialSanitaireEndpoint";
import { dependencies } from "../../backend/infrastructure/dependencies";
import { ÉtablissementTerritorialSanitaire } from "../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaire";
import { ÉtablissementTerritorialSanitaireNonTrouvée } from "../../backend/métier/entities/ÉtablissementTerritorialSanitaireNonTrouvée";
import { useDependencies } from "../../frontend/ui/commun/contexts/useDependencies";
import Spinner from "../../frontend/ui/commun/Spinner/Spinner";
import { RechercheViewModel } from "../../frontend/ui/home/RechercheViewModel";
import { PageÉtablissementTerritorialSanitaire } from "../../frontend/ui/établissement-territorial-sanitaire/PageÉtablissementTerritorialSanitaire";
import { ÉtablissementTerritorialSanitaireViewModel } from "../../frontend/ui/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireViewModel";

type RouterProps = Readonly<{
  établissementTerritorial: ÉtablissementTerritorialSanitaire;
  rechercheResult: any;
}>;

export default function Router({ rechercheResult, établissementTerritorial }: RouterProps) {
  const { paths, wording } = useDependencies();

  if (!établissementTerritorial) return null;

  const établissementTerritorialSanitaireViewModel = new ÉtablissementTerritorialSanitaireViewModel(établissementTerritorial, wording, paths);

  const rechercheViewModel = new RechercheViewModel(rechercheResult.résultats[0], paths);

  return (
    <>
      {rechercheViewModel ? (
        <PageÉtablissementTerritorialSanitaire
          rechercheViewModel={rechercheViewModel}
          établissementTerritorialSanitaireViewModel={établissementTerritorialSanitaireViewModel}
        />
      ) : (
        <Spinner />
      )}
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<GetStaticPropsResult<RouterProps>> {
  try {
    const session = await getSession(context);
    const codeRegion = session?.user.codeRegion as unknown as string;
    const codeProfiles = session?.user.codeProfiles as string[];

    if (context.params && context.params["numeroFiness"]) {
      const numeroFiness = context.params["numeroFiness"] as string;
      const établissementTerritorial = (await récupèreLÉtablissementTerritorialSanitaireEndpoint(
        dependencies,
        numeroFiness,
        codeRegion,
        codeProfiles
      )) as ÉtablissementTerritorialSanitaire;
      const rechercheResult = await rechercheParmiLesEntitésEtÉtablissementsEndpoint(dependencies, numeroFiness, 1);

      const allocationRessources = 
      [
        {
        dateMiseÀJourSource: '2023-01-20',
        année: 2022,
        data:
        [
          {
            enveloppe: 'FIR',
            sousEnveloppe: 'Sanitaire',
            modeDeDélégation: 'Intervention A',
            montantNotifié: 1900,
          },
          {
            enveloppe: 'FIR',
            sousEnveloppe: 'Sanitaire',
            modeDeDélégation: 'Intervention B',
            montantNotifié: 50,
          },
          {
            enveloppe: 'FIR',
            sousEnveloppe: 'Sanitaire',
            modeDeDélégation: 'Intervention B',
            montantNotifié: 100,
          },
          {
            enveloppe: 'Forfaits',
            sousEnveloppe: 'FAU',
            modeDeDélégation: 'Sans objet',
            montantNotifié: 570,
          },
          {
            enveloppe: 'MIGAC',
            sousEnveloppe: 'AC',
            modeDeDélégation: '123',
            montantNotifié: 6660,
          },
          {
            enveloppe: 'MIGAC',
            sousEnveloppe: 'MIG',
            modeDeDélégation: 'BASE',
            montantNotifié: 100,
          },
          {
            enveloppe: 'MIGAC',
            sousEnveloppe: 'MIG',
            modeDeDélégation: 'JPE_MERRI',
            montantNotifié: 140,
          },
          {
            enveloppe: 'MIGAC',
            sousEnveloppe: 'MIG',
            modeDeDélégation: 'TestA',
            montantNotifié: 190,
          },
          {
            enveloppe: 'MIGAC',
            sousEnveloppe: 'MIG',
            modeDeDélégation: 'TestB',
            montantNotifié: 290,
          },
          {
            enveloppe: 'MIGAC',
            sousEnveloppe: 'MIG',
            modeDeDélégation: 'TestC',
            montantNotifié: 390,
          },
          {
            enveloppe: 'MIGAC',
            sousEnveloppe: 'MIG',
            modeDeDélégation: 'TestC',
            montantNotifié: 490,
          },
          {
            enveloppe: 'MIGAC',
            sousEnveloppe: 'MIG',
            modeDeDélégation: 'TestD',
            montantNotifié: 590,
          },
          {
            enveloppe: 'MIGAC',
            sousEnveloppe: 'MIG',
            modeDeDélégation: 'TestE',
            montantNotifié: 190,
          },
          {
            enveloppe: 'MIGAC',
            sousEnveloppe: 'MIG',
            modeDeDélégation: 'TestJ',
            montantNotifié: 190,
          },
          {
            enveloppe: 'Dotations de soins USLD',
            sousEnveloppe: 'MIG',
            modeDeDélégation: 'JPE_MERRI',
            montantNotifié: 1559,
          },
          {
            enveloppe: 'DAF',
            sousEnveloppe: 'DAF',
            modeDeDélégation: 'JPE_MERRI',
            montantNotifié: 1201,
          }
        ]
      },
      {
        dateMiseÀJourSource: '2023-01-20',
        année: 2019,
        data:
        [
          {
            enveloppe: 'FIR',
            sousEnveloppe: 'Sanitaire',
            modeDeDélégation: 'Intervention A',
            montantNotifié: 10723000,
          },
          {
            enveloppe: 'FIR',
            sousEnveloppe: 'Sanitaire',
            modeDeDélégation: 'Intervention B',
            montantNotifié: 2000,
          },
          {
            enveloppe: 'FIR',
            sousEnveloppe: 'Sanitaire',
            modeDeDélégation: 'Intervention B',
            montantNotifié: 3000,
          },
          {
            enveloppe: 'Forfaits',
            sousEnveloppe: 'FAU',
            modeDeDélégation: 'Sans objet',
            montantNotifié: 4798 ,
          },
          {
            enveloppe: 'MIGAC',
            sousEnveloppe: 'AC',
            modeDeDélégation: '123',
            montantNotifié: 20000,
          },
          {
            enveloppe: 'MIGAC',
            sousEnveloppe: 'MIG',
            modeDeDélégation: 'BASE',
            montantNotifié: 17693,
          },
          {
            enveloppe: 'MIGAC',
            sousEnveloppe: 'MIG',
            modeDeDélégation: 'JPE_MERRI',
            montantNotifié:  806 ,
          }
        ]
      }
    ];
    
      return { props: {  
        
        // this line is only for fornt test
        établissementTerritorial: {...établissementTerritorial, 
          allocationRessources: allocationRessources},

        // use this line after prepare real data
        //établissementTerritorial,
        
        rechercheResult: rechercheResult } };
    } else {
      return { notFound: true };
    }
  } catch (error) {
    if (error instanceof ÉtablissementTerritorialSanitaireNonTrouvée) {
      dependencies.logger.error(error.message);
      return { notFound: true };
    }
    throw error;
  }
}
