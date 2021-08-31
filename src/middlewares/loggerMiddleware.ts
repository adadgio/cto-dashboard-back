import {RequestHandler} from "express";

const loggerMiddleware: RequestHandler = (req, res, next) => {
  console.info(new Date(), req.method, req.url);
  next();
}

export default loggerMiddleware;
