import winston from 'winston';
import config from '../config';

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

const consoleFormat = printf(({ level, message, timestamp, stack, requestId }) => {
    const reqInfo = requestId ? `[${requestId}] ` : '';
    return `${timestamp} ${level}: ${reqInfo}${stack || message}`;
});

export const logger = winston.createLogger({
    level: config.nodeEnv === 'development' ? 'debug' : 'info',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true })
    ),
    transports: [
        new winston.transports.Console({
            format: combine(
                colorize(),
                consoleFormat
            )
        })
    ]
});

export default logger;
