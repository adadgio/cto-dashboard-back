import { Router } from "express";
import conf from '../ConfigurationSingleton';
import ApiError from "../ApiError";
import jwt from "jsonwebtoken";
import Joi from "joi";

const routeFactory = () => {
  const router = Router();

  router.post("/login", (req, res, next) => {
    const schema = Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
    })

    const validationResult = schema.validate(req.body);
    if (validationResult.error) {
      return res.status(400).json({error: validationResult.error.message});
    }
    const body = validationResult.value;

    try {
      const ADMIN_NAME = conf.ADMIN_NAME;
      const ADMIN_PASSWORD = conf.ADMIN_PASSWORD;
      if (
        body.username === ADMIN_NAME &&
        body.password === ADMIN_PASSWORD
      ) {
        const token = jwt.sign(
          { username: req.body.username },
          conf.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );
        return res.send(token);
      } else {
        res.status(401).json({error: "Wrong username or password"});
      }
    } catch (error) {
      next(new ApiError(error));
    }
  });
  return router;
};
export default routeFactory;
