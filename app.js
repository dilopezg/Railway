const express = require('express');
const app = express();
const handlebars = require('express-handlebars');
const http = require('http').Server(app);
const Producto = require('./api/index_productos');
const productos = new Producto("./db/productos.txt");
const chats = require('./api/index_chat');
const handlerMessage = new chats("./db/mensajes.txt");
const normalizar = require('./controller/normalizador')
const session = require('express-session')
const passport = require('passport');
const LocalStrategy  = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const UserModel = require('./models/user.js');
const { init } = require('./db/mongodb.js');
const mongoose = require('mongoose');
const minimist = require("minimist") ;
const os = require("os") ;
const cluster = require("cluster") ;
const autocannon = require ('autocannon')

const params = minimist(process.argv.slice(2), {
    alias : {
      p: "PORT",
      m: "MODE"
    },
    default: {
      p: 8080,
      m: "fork"
    }
  });
  
  const {PORT, MODE} = params
  
  if(MODE === "cluster" && cluster.isPrimary){  
    const length = os.cpus().length;
  
    for(let i = 0; i < length; i++){
      cluster.fork();
    }
  
    cluster.on("exit", (worker, code, signal) => {
      console.log(`Worker ${worker} died`);
    })
  } else {

    const URL = process.env.MONGODB_URI
    console.log(URL);

    mongoose.connect(URL)

    const io = require('socket.io')(http);

    passport.use('sign-in', new LocalStrategy({ usernameField: 'email',}, (email, password, done) => {
                UserModel.findOne({ email })
                    .then((user) => {
                        if (!user) {
                            console.log(`User with ${email} not found.`);
                            return done(null, false);
                        }
                        if (!bcrypt.compareSync(password, user.password)) {
                            console.log('Invalid Password');
                            return done(null, false);
                        }
                        done(null, user);
                    })
                    .catch((error) => {
                        console.log('Error in sign-in', error.message);
                        done(error, false);
                    });
            }
        )
    );

    passport.use('sign-up', new LocalStrategy({usernameField: 'email',passReqToCallback: true,},(req, email, password, done) => {
                UserModel.findOne({ email })
                    .then((user) => {
                        if (user) {
                            console.log(`User ${email} already exists.`);
                            return done(null, false);
                        } else {
                            const salt = bcrypt.genSaltSync(10);
                            const hash = bcrypt.hashSync(
                                req.body.password,
                                salt
                            );
                            req.body.password = hash;
                            return UserModel.create(req.body);
                        }
                    })
                    .then((newUser) => {
                        console.log(newUser);
                        if (newUser) {
                            console.log(`User ${newUser.email} registration succesful.`);
                            done(null, newUser);
                        } else {
                            throw new Error('User already exists');
                        }
                    })
                    .catch((error) => {
                        console.log('Error in sign-up', error.message);
                        return done(error);
                    });
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser((_id, done) => {
        UserModel.findOne({ _id })
            .then((user) => done(null, user))
            .catch(done);
    });

    app.use(session({
            secret: '25*#J8gh!wsss',
            cookie: {
                    httpOnly: false,
                    secure: false,
                    maxAge: 600000,
            },
            rolling: true,
            resave: false,
            saveUninitialized: false,
        })
    );
    app.use(passport.initialize());
    app.use(passport.session());

    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(session({
    secret: '3567!$H4s5K36#ssss',
    resave: false, 
    saveUninitialized: false,
    }));
    app.use(passport.initialize())
    app.use(passport.session())
    //app.use(express.static(__dirname + '/public'));

    app.engine(
        "hbs",
        handlebars({
            extname: ".hbs",
            defaultLayout: 'index.hbs',
        })
    );

    app.set("view engine", "hbs");
    app.set("views", __dirname + '/views');

    io.on('connection', async socket => {

        console.log('Nuevo cliente conectado!');

        socket.emit('productos', await productos.listar());

        socket.on("new-producto", async (data) => {
            productos.guardar(data);
            io.sockets.emit('productos', await productos.listar());
        });

        const dataMensajes = await handlerMessage.getAll();
        const data = await normalizar(dataMensajes);
        socket.emit("history-messages", data);

        socket.on("new-message", async (data) => {
            data.time = new Date().toLocaleString();
            await handlerMessage.save(data);
            const dataMensajes = await handlerMessage.getAll();
            const data_toshow = await normalizar(dataMensajes);
            io.sockets.emit('history-messages', data_toshow);
        });

        socket.on('disconection', () => {
            console.log('Se desconecto el cliente con el id', socket.id)
        })
    });

    app.use((err, req, res, next) => {
        console.error(err.message);
        return res.status(500).send('Algo se rompio!');
    });

    const Router = require('./routes/index.js');
    const apiRouter = require('./routes/random.js');
    app.use('/', Router)
    app.use('/api', apiRouter);

    //const PORT = process.env.PORT || 3030;

    const server = http.listen(PORT, () => {
        console.log(`servidor escuchando en http://localhost:${PORT}`);
    });

    server.on('error', error => {
        console.log('error en el servidor:', error);
    });
  }