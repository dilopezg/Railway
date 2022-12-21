const express = require('express');
const router = express.Router();
const passport = require('passport');
const { logger } = require( "../logger/logger.js");

router.get('/registro', (req, res, next) => {
    logger.info(`Se accedio a la ruta ${req.originalUrl} con el metodo ${req.method}`)
    res.render('registro');
});

router.get('/errorregistro', (req, res) => {
    logger.info(`Se accedio a la ruta ${req.originalUrl} con el metodo ${req.method}`)
    console.log(req);
    res.render('errorregistro');
});
router.post('/sign-up', passport.authenticate('sign-up', { successRedirect: '/', failureRedirect: '/errorregistro', }), (req, res) => {
    logger.info(`Se accedio a la ruta ${req.originalUrl} con el metodo ${req.method}`)
    console.log(req);
    const { user } = req;
    console.log('registro -> user', user);
}
);


module.exports = router;