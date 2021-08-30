import dotenv from 'dotenv';
dotenv.config();

import { app } from './server';

console.log("started at", new Date());

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("listening on", port));

