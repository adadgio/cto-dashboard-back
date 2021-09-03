import { Router } from "express";
import Joi from "joi";
import conf from '../ConfigurationSingleton';
import ApiError from "../ApiError";
import {
  authenticateUser,
  signJWT,
  validateJWT
} from '../business/authentication';

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
      const user = authenticateUser(body.username, body.password)
      if (!user) {
        res.status(401).json({error: "Wrong username or password"});
      }

      const token = signJWT({ username: body.username });
      return res.send({jwtKey: token});
    } catch (error) {
      next(new ApiError(error));
    }
  });
  return router;
};
export default routeFactory;
