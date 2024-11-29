import md5 from "md5";

const password = "1234"; // fix the passwords here
export const SECRET_PASSWORD = md5(password);
