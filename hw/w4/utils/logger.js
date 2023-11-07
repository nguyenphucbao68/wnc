import { createLogger, format, transports } from "winston";
import os from 'os';
import "winston-daily-rotate-file";
import "winston-syslog";

const rotateTransport = new transports.DailyRotateFile({
  frequency: "3m",
  filename: "./log/application-%DATE%.log",
  datePattern: "mm",
  maxSize: "0.578k",
  maxFiles: "2",
});
const papertrail = new transports.Syslog({
  host: 'logs3.papertrailapp.com',
  port: 21743,
  protocol: 'tls4',
  localhost: os.hostname(),
  eol: '\n',
});


// rotateTransport.on("rotate", function (oldFilename, newFilename) {
//   // do something fun
//   console.log("rotate");
// });

const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.Console({
      level: "info",
    }),
    new transports.File({
      filename: './log/application-06.log'
    }),
    rotateTransport
    //papertrail
  ]
});

export default logger;
