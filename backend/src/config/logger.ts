import { createLogger, format, transports } from 'winston';
import serialize from "serialize-javascript";

const { combine, timestamp, printf, errors, colorize } = format;

const logFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
    return `${timestamp} [${level}] : ${stack ? `${message} \n${stack}` : `${message} \n${(Object.keys(meta).length > 0 ? serialize(meta, { space: 2 }) : '')}`}`;
});

const logger = createLogger({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        errors({ stack: true }),
        logFormat
    ),
    transports: [
        new transports.Console({
            format: combine(
                colorize(),
                timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
                errors({ stack: true }),
                logFormat
            )
        }),
        //!  Feature to save logs to DB will be added later 
        // new transports.File({
        //     filename: "logs/error.log",
        //     level: "error",
        //     format: combine(
        //         timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        //         errors({ stack: true }),
        //         logFormat
        //     )
        // }),
        // new transports.File({
        //     filename: "logs/combined.log",
        //     format: combine(
        //         timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        //         errors({ stack: true }),
        //         logFormat
        //     )
        // }),
    ],
});

export default logger;
