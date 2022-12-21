const { Router } = require('express')
const { logger } = require( "../logger/logger.js");

let io

function emit(event, data) {
    io.emit(event, data)
  }

const router = Router()

router.post('/', (req, res) => {
  try{
    logger.info(`Se accedio a la ruta ${req.originalUrl} con el metodo ${req.method}`)
    const { body } = req
    console.log('aviso', body);
    emit('notification', body)
    res.send('OK')
  }catch(error) {
    logger.error(`${error.message}`)
    next(error);
}
})

module.exports = router;