import logger from "./utils/logger.js";

var options = {
    from:   new Date - 48 *60 * 60 * 1000,
    until:  new Date,
    limit:  10,
    start:  0,
    order:  'asc',
    fields: ['meta', 'timestamp']
};
logger.query(options, function (err, results) {
    if (err) {
        throw err;
    }
    results = results.file.filter(result => result.meta.method === "GET")
    console.log(results);
});