import { NextApiRequest, NextApiResponse } from "next";

const doSomething = (emailValue: string) => {
    console.log("it's just a method", emailValue);
    return true;
};

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== "POST") {
    response.status(405).send("Method not allowed");
  }

  const { emailValue } = request.body;

  const result = await doSomething(emailValue);
  response.status(200).json(result);

 
}
