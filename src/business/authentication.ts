import conf from '../ConfigurationSingleton';
import jwt from "jsonwebtoken";

type User = {
  username: string,
}

export const authenticateUser = (username: string, password: string) => {
  const ADMIN_NAME = conf.ADMIN_NAME;
  const ADMIN_PASSWORD = conf.ADMIN_PASSWORD;

  //TODO: find in database?
  if (
    username === ADMIN_NAME &&
    password === ADMIN_PASSWORD
  ) {
    return { username: username };
  }

  return null;
}

type JWTTokenPayload = {
  username: string;
}
export const signJWT = (payload: JWTTokenPayload) => {
  const token = jwt.sign(
    payload,
    conf.TOKEN_KEY,
    {
      expiresIn: "2h",
    }
  );

  return token;
}

export const validateJWT = (token: string) => {
  return jwt.verify(token, conf.TOKEN_KEY);
}
