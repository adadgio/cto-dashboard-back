import { Router } from "express";
import conf from '../ConfigurationSingleton';
import ApiError from "../ApiError";
import jwt from "jsonwebtoken";

const routeFactory = () => {
  const router = Router();

  router.post("/login", (req, res, next) => {
    try {
      const ADMIN_NAME = conf.ADMIN_NAME;
      const ADMIN_PASSWORD = conf.ADMIN_PASSWORD;
      if (
        req.body.username === ADMIN_NAME &&
        req.body.password === ADMIN_PASSWORD
      ) {
        const token = jwt.sign(
          { username: req.body.username },
          conf.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );
        return res.send(token);
      } else throw new Error("Unauthorized");
    } catch (error) {
      next(new ApiError(error));
    }
  });
  return router;
};
export default routeFactory;
