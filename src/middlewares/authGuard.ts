import { RequestHandler } from 'express';
import {validateJWT} from '../business/authentication';

const authGuard : RequestHandler = (req, res, next) => {
  if (req.headers.authorization) {
    //TODO extract from "Bearer $"
    if (validateJWT(req.headers.authorization)) {
      next();
      return;
    }
  }
  //note: this needs a cookieParser middleware!
  else if (req.cookies.jwt && validateJWT(req.cookies.jwt)) {
    next();
    return;
  }

  res.status(401).send({ error: "Unauthorized" });
}

export default authGuard;
