import conf from './ConfigurationSingleton';
import { app } from './server';

console.log("started at", new Date());

app.listen(conf.port, () => console.log("listening on", conf.port));

