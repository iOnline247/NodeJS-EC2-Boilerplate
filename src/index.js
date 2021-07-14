import { v4 as uuidv4 } from "uuid";
import Logger from "./logger";

const logger = new Logger({
  appName: "nodejs-boilerplate",
  component: "Typescript",
  module: "DX",
  correlationId: uuidv4(),
  jobId: uuidv4(),
});

logger.on(Logger.EVENTS.LOGGING, async (payload) => {
  /* eslint-disable no-console */
  console.log(`Logger event fired: ${Logger.EVENTS.LOGGING}`);
  console.log(payload);
  /* eslint-enable no-console */
});

logger.on(Logger.EVENTS.LOGGED, async (payload) => {
  /* eslint-disable no-console */
  console.log(`Logger event fired: ${Logger.EVENTS.LOGGED}`);
  console.log(payload);
  /* eslint-enable no-console */
});

logger.log("Hola, Mundo");
logger.error("NOPE");
