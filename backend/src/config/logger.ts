import pino from "pino";
import config from "./env";

const logger = pino({
  level: config.env === "development" ? "debug" : "info",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard",
      ignore: "pid,hostname",
    },
  },
  base: {
    env: config.env,
  },
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
});

export default logger;
