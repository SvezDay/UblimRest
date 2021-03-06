const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const _ = require('lodash');
// const path = require('path');
// const favicon = require('serve-favicon');

// const chokidar = require('chokidar');

// const firebase = require('firebase');
// const functions = require('firebase-functions/lib/index');
// const admin = require('firebase-admin/lib/index');

// const AuthRoutes = require('./specialRoutes/authRoutes');
const routes = require('./_routes').routes;
//const tokenRoutes = require('./api/tokenRoutes');
const tokenValidation = require('./_tokenValidation').tokenFn;
// const watcher = chokidar.watch('./api');

const app = express();
const port = process.env.PORT || 3200;

// ==================================================== GRAPHENEDB


// ==================================================== ENVIRONMENTS VARIABLES
process.env.FIREBASE_CONFIG = require('./_secret').firebase;
console.log('process.env.FIREBASE_CONFIG: ', process.env.FIREBASE_CONFIG);

// ==================================================== SOCKETS

let server = app.listen(port);
// let io = require('./_routes').sockets(server);

// SOCKET MANAGEMENT
// let server = require('http').createServer(app);
// let io = require('socket.io').listen(server);
// let games = io.of('/games');
// games.on('connection', socket=>{
//   console.log("connection socket")
//   socket.on('gamesConnection', ss=>{
//     console.log('connection from games module !')
//   })
//   socket.on('updateBrutData', ss=>{
//     console.log('connection from games module !', ss)
//     socket.emit('updateBrutDataResponse', 'receive !')
//   })
// })


// ====================================================== CORS

let allowCrossDomain = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:8100", "https://ublimpwa.firebaseapp.com");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Auth-Token, x-access-token");
    next();
};
let whitelist = ["http://localhost:4200", "http://localhost:5000", "https://rudlabquickapp2.herokuapp.com"];

let corsOptions = {
    origin: (origin, callback) => {
        if (origin === undefined) {
            callback(null, true);
        } else if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};

// ======================================================== ERROR HANDLE

// return error message for unauthorized requests
let handleError = (err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({message: 'Missing or invalid token'});
    }
    // res.status(500).json(err)
};

// ======================================================== EXPRESS APP CONFIG

// app.use({$$DIRNAME:_dirname})
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// app.use(favicon(path.join(__dirname, 'favicon.ico')));

app.use(allowCrossDomain);
app.options('*', cors());
app.use(handleError);
app.use(cors(corsOptions));


// Add the bodyParser limits
// Add the scope checking

// ==================================================== FIREBASE CONFIG

// let adm = admin.initializeApp(functions.config().firebase);


// use "glob" to avoid to manage the routes file, but directly in each file
// const docsRoutes = require('./api/docs');
// app.use('/api', docsRoutes);

app.use('/rest', tokenValidation, routes());

if (process.env.NODE_ENV === 'dev') {
    app.use('/dev', require('./devRoutes/routes.dev')());
    app.use('/devUid', tokenValidation, require('./devRoutes/methodTesting.dev')());
} else {
    process.env.NODE_ENV = 'production';
}

// if(process.env.NODE_ENV !== 'production'){
//   watcher.on('ready', function(){
//     watcher.on('all', function(){
//       // console.log("Clearing /dist/ module cache from server")
//       Object.keys(require.cache).forEach(function(id) {
//         if (/[\/\\]app[\/\\]/.test(id)) delete require.cache[id]
//       })
//     })
//   })
// }


console.log("process.env.NODE_ENV", process.env.NODE_ENV);
console.log('REST server started on: localhost:' + port);
