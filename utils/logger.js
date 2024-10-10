// import {createLogger , format , transport} from 'winston'
import {createLogger , format , transports} from 'winston'
const {combine ,timestamp  , json , colorize} = format 

// Custom format for console logging with colors
const consoleFormat = format.combine(
    format.colorize(),
    format.printf(({level  , message , timestamp}) => {
        return `${level} : ${message}`   
    })
);

// create a winston logger instance

const logger = createLogger({
  level: "info",
  format: combine(colorize(), timestamp(), json()),
  transports: [
    new transports.Console({format: consoleFormat}),
    new transports.File({filename: "logs/error.log",level: "error"}),
  ],
});

export default logger;