const express = require('express');
const router = express.Router();
const os = require("os") ;
const compression = require('compression')
const { logger } = require( "../logger/logger.js");

router.get('/info',compression(), (req, res, next) => {
    try {
          logger.info(`Se accedio a la ruta ${req.originalUrl} con el metodo ${req.method}`)
          const data = {
                arg: process.argv.slice(2),
                cpus: os.cpus().length,
                os: process.platform,
                version: process.version,
                rss: process.memoryUsage().rss,
                path: process.execPath,
                pid: process.pid,
                folder: process.cwd(),
          };
          //console.log(data);
          res.render('./info', data);
      } catch (error) {
          logger.error(`${error.message}`)
          next(error);
    }
});

module.exports = router;