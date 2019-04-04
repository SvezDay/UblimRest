'use-strict';

module.exports.sockets = function (server) {
    let io = require('socket.io').listen(server);
    let nsp = require('./games/games.sockets')(io);
};
