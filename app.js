var logger = require('morgan');
var sensorSimulation = require('./sensorSimulation/simulation');
var red = require('./red');
var flowNodes = require('./flows/sitCriticalPressure');
const durationSeconds = 60;


red.start(function() {
    red.addFlow('Critical Tank Pressure', flowNodes);
});

sensorSimulation.start();

// stop simulation after some time
setTimeout(function() {
    sensorSimulation.stop();
}, durationSeconds * 1000);

