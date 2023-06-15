import { NextApiRequest, NextApiResponse } from "next";

const doSomething = (emailValue: string, password: string) => {
    console.log("it's just a method", emailValue, password);
    return true;
};

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== "POST") {
    response.status(405).send("Method not allowed");
  }

  const { loginToken, password } = request.body;

  const result = await doSomething(loginToken, password);
  response.status(200).json(result);
 
}
