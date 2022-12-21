const express = require('express');
const router = express.Router();

const login = require('./login.js')
const registro = require('./registro.js')
const productosRouter = require('./productos');
const indexRouter = require('./chat');
const info = require('./info');
const {logger}  = require('../logger/logger.js');

router.use('/', productosRouter, indexRouter, login, registro,info);

router.use('*', (req, res) => {
	const path = req.params;
	const method = req.method;
	logger.warn(`ruta '${path[0]}' método '${method}' no implementada`);  
});

module.exports = router;