import logger from 'pino';  // Import pino
import dayjs from 'dayjs'; // Import dayjs
import config from 'config'; // Import config

const level = config.get('logLevel') as string; // Get the log level from the config file

const log = logger({ // Create a logger
    transport: {
        target: 'pino-pretty',
    },level,
    base: {
       pid: false,
    },
    timestamp: () => `,"time":"${dayjs().format()}"` // Add a timestamp to the logs
}); 

export default log; // Export the logger