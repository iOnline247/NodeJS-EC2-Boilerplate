/* eslint class-methods-use-this: ["error", { "exceptMethods": ["EVENTS"] }] */
import Emittery from "emittery";

const {
  AWS_LAMBDA_FUNCTION_NAME,
  CURRENT_MODULE_NAME,
  APPLICATION_NAME,
  LOG_LEVEL,
  MODULE_NAME,
} = process.env;
const LOG_TYPES = {
  DEBUG: "DEBUG",
  ERROR: "ERROR",
  INFO: "INFO",
  LOG: "INFO",
  WARN: "WARN",
};
const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  LOG: 1,
  WARN: 2,
  ERROR: 3,
};
const logLevelName = () => (LOG_LEVEL || LOG_TYPES.DEBUG).toUpperCase();
const isLogLevelEnabled = (level) => level >= LOG_LEVELS[logLevelName()];
const createLogEvent = (severity, input = {}) => {
  const message = input;
  const now = new Date().toISOString();
  const logPayload = {
    severity,
    message: String(message),
    logTimestamp: now,
    agentTimestamp: now,
  };

  return logPayload;
};
const logToConsole = (logType, correlationId, logMsg) => {
  const output = {
    logType,
    correlationId,
    logMsg,
  };

  // eslint-disable-next-line no-console
  console.log(JSON.stringify(output));
};

class Logger extends Emittery {
  #emitAndLogEvents = async (logType, payload) => {
    logToConsole(logType, this.correlationId, payload);

    await Promise.all([
      this.emit(Logger.EVENTS.LOGGING, payload),
      // logEvent(payload)
    ]);

    await this.emit(Logger.EVENTS.LOGGED, payload);
  };

  appName;

  component;

  jobId;

  module;

  correlationId;

  constructor({ appName, component, jobId, module, correlationId }) {
    super();

    if (!correlationId) {
      throw new TypeError("correlationId is a required parameter.");
    }

    if (!jobId) {
      throw new TypeError("jobId is a required parameter.");
    }

    /* eslint-disable no-underscore-dangle */
    const _appName = APPLICATION_NAME || appName;

    if (_appName == null) {
      throw new TypeError("appName is a required parameter.");
    }

    const _component = component || AWS_LAMBDA_FUNCTION_NAME;

    if (_component == null) {
      throw new TypeError("component is a required parameter.");
    }

    const _module = MODULE_NAME || CURRENT_MODULE_NAME || module;

    if (_module == null) {
      throw new TypeError("module is a required parameter.");
    }

    /* eslint-enable no-underscore-dangle */

    this.appName = _appName;
    this.component = _component;
    this.jobId = jobId;
    this.module = _module.toUpperCase();
    this.correlationId = correlationId;
  }

  static get EVENTS() {
    return {
      LOGGING: "Logger:logging",
      LOGGED: "Logger:logged",
    };
  }

  async debug(input) {
    const logType = LOG_TYPES.DEBUG;
    const isEnabled = isLogLevelEnabled(LOG_LEVELS[logType]);
    const payload = createLogEvent(logType, input);

    if (isEnabled) {
      await this.#emitAndLogEvents(logType, payload);
    }

    return payload;
  }

  async error(input) {
    const logType = LOG_TYPES.ERROR;
    const isEnabled = isLogLevelEnabled(LOG_LEVELS[logType]);
    const payload = createLogEvent(logType, input);

    if (isEnabled) {
      await this.#emitAndLogEvents(logType, payload);
    }

    return payload;
  }

  async info(input) {
    const logType = LOG_TYPES.INFO;
    const isEnabled = isLogLevelEnabled(LOG_LEVELS[logType]);
    const payload = createLogEvent(logType, input);

    if (isEnabled) {
      await this.#emitAndLogEvents(logType, payload);
    }

    return payload;
  }

  async log(input) {
    const logType = LOG_TYPES.LOG;
    const isEnabled = isLogLevelEnabled(LOG_LEVELS[logType]);
    const payload = createLogEvent(logType, input);

    if (isEnabled) {
      await this.#emitAndLogEvents(logType, payload);
    }

    return payload;
  }

  async warn(input) {
    const logType = LOG_TYPES.WARN;
    const isEnabled = isLogLevelEnabled(LOG_LEVELS[logType]);
    const payload = createLogEvent(logType, input);

    if (isEnabled) {
      await this.#emitAndLogEvents(logType, payload);
    }

    return payload;
  }
}

export default Logger;
