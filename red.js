var http = require('http');
var express = require("express");
var RED = require("node-red");
var os = require('os');
var path = require('path');

var app = express();
app.use("/",express.static("public"));
var server = http.createServer(app);

// Create the settings object - see default settings.js file for other options
var settings = {
    httpAdminRoot:"/red",
    httpNodeRoot: "/api",
    userDir: path.join(os.homedir(), '.node-red'),
    functionGlobalContext: { }    // enables global context
};

RED.init(server,settings);
// Serve the editor UI from /red
app.use(settings.httpAdminRoot, RED.httpAdmin);
// Serve the http nodes UI from /api
app.use(settings.httpNodeRoot, RED.httpNode);


/**
 * Starts the node-red server in embedded mode.
 *
 * @param callback function to be called when the node-red server has been started
 */
function start(callback) {
    server.listen(8000);
    var status = RED.start().then(function(){
        //console.log(RED.nodes.getFlows());
        setTimeout(function() {
            // additional waiting needed until flows are started
            console.log(status);
            if(typeof callback === 'function'){
                callback();
            }
        }, 10);

    });
}

/**
 *
 * @param label name for the flow
 * @param nodes jsonArray in the format that is used for export/import via the web ui
 */
function addFlow(label, nodes) {
    var flow = {
        'label': label,
        'nodes': nodes
    };
    RED.nodes.addFlow(flow);
}

// Runtime API reference: http://nodered.org/docs/api/runtime/api

module.exports = {
    'addFlow': addFlow,
    'start': start
};
