import { MessageAccueil } from "../../métier/gateways/MessageAccueilLoader";
import { Dependencies } from "../dependencies";

export async function getAllMessagesAccueilEndpoint(dependencies: Dependencies): Promise<MessageAccueil[]> {
  try {
    return await dependencies.messageAccueilLoader.getAllMessages();
  } catch (error) {
    dependencies.logger.error(error);
    throw error;
  }
}
