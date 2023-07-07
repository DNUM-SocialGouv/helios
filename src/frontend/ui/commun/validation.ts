export default function isEmail(emailAdress : string) : Boolean{
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  if (emailAdress.match(regex)) 
    return true; 

   else 
    return false; 
}
