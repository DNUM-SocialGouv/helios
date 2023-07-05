import { NextApiRequest, NextApiResponse } from "next";

import { changePasswordEndpoint } from "../../backend/infrastructure/controllers/changePasswordEndpoint";
import { dependencies } from "../../backend/infrastructure/dependencies";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
  if (request.method !== "POST") {
    response.status(405).send("Method not allowed");
  }
   const { loginToken, password } = request.body;
   const result = await changePasswordEndpoint(dependencies,loginToken, password); 
   if (result) {
    return response.status(200).json(result);
   } else {
    return  response.status(400).json({'err':'error occured while changing passeword'}) 
   }  
 } catch (error) {
  return response.status(500)
 }
}
