const express = require('express');
const router = express.Router();
const { logger } = require( "../logger/logger.js");

function random (repeat) {
      let object = {};
      for (let i = 0; i < repeat; i++) {
          let number = Math.floor(Math.random() * 1000) + 1;
          if (object[number]) {
              object[number]++;
          }else {
              object[number] = 1;
          }
      }
      return object;
};


router.get('/randoms', async (req, res, next) => {
      try {
            logger.info(`Se accedio a la ruta ${req.originalUrl} con el metodo ${req.method}`)
            let cont = req.query.cant || 100000000;
            const computo = random(cont)
            res.json(computo);            
      } catch (error) {
            logger.error(`${error.message}`)
            next(error);
      }
});

module.exports = router;