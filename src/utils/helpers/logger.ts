import { createLogger, format, transports } from 'winston';
import path from 'path';

const { combine, timestamp, printf } = format;

// logs are written to a file. 
//In real production scenarios, I would love to implement a system where logs are deleted from the file 
//after a certain period of time to avoid the file getting too large.
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    logFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: path.join(__dirname, '../../logs/actions.log') })
  ],
});

export default logger;