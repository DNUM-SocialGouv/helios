import { NextApiRequest, NextApiResponse } from "next";

import { forgetPasswordEndPoint } from "../../backend/infrastructure/controllers/forgetPasswordEndPoint";


export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== "POST") {
    response.status(405).send("Method not allowed");
  }
  const { emailValue } = request.body;
   try {
     const info = await forgetPasswordEndPoint(emailValue);
     if (info) {
       return   response.status(200).json({info})   
     } 
     return  response.status(400).json({info})
   } catch (error) {
      return response.status(500)
   }
 
}
