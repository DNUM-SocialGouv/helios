import { Client } from "pg";

import { Logger } from "../src/backend/métier/gateways/Logger";

export async function createTestUser(logger: Logger, client: Client) {
  const nbUsers = (await client.query("SELECT count(*) FROM utilisateur")).rows[0];

  if (Number.parseInt(nbUsers.count) === 0) {
    await client.query(`INSERT INTO public.utilisateur
                        (ut_nom, ut_prenom, ut_email,                  ut_institution, ut_actif, ut_role, ut_password,                                                    ut_date_creation,          ut_profiles                            )
                  VALUES('DOE',  'John',    'john.doe@notadomain.tst', 1,              true,     1,       '$2a$12$dECXw9M9itxb6on74EJS.u8YDDBPMPuVU/SILIdmDhwfm22shDxWG', '2026-07-14 13:36:46.330', '{14c7773c-49a0-4306-9b44-4ec50ef5db44}');`)
    logger.info("User created successfully");
  } else {
    logger.info("There are already users in the database. No test user will be created.");
  }
}
