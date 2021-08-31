import { ErrorRequestHandler } from 'express';
import conf from '../ConfigurationSingleton';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err)

  if (conf.NODE_ENV === "production") {
    res.status(500).json({ error: "Internal server error."});
  }
  else {
    res.status(500).send({ error: err.toString() })
  }
}

export default errorHandler;
