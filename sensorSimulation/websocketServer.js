'use strict';
var ws = require("nodejs-websocket");
const SOCKET_PORT = 8001;

var server = ws.createServer(function (conn) {
    conn.on("close", function (code, reason) {
        console.log("Connection closed");
    })
});

function start() {
    server.listen(SOCKET_PORT);
}


function broadcast(msg) {
    server.connections.forEach(function (conn) {
        conn.sendText(JSON.stringify(msg));
    });
}

function multicast(channel, msg) {
    server.connections.forEach(function (conn) {
        if(conn.path === '/'+channel) {
            conn.sendText(JSON.stringify(msg));
        }
    });
}

module.exports = {
    'broadcast': broadcast,
    'multicast': multicast,
    'server': server,
    'start': start
};