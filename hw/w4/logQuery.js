import { createLogger, format, transports } from "winston";

var options = {
    from:   new Date - 48 *60 * 60 * 1000,
    until:  new Date,
    limit:  10,
    start:  0,
    order:  'desc',
    fields: ['meta', 'timestamp']
};
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
    ]
  });
logger.query(options, function (err, results) {
    if (err) {
        throw err;
    }
    results = results.file.filter(result => result.meta.method === "GET")
    console.log(results);
});