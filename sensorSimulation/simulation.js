'use strict';
var sensors = require('./sensors');
var server = require('./websocketServer');
const pushIntervalMs = 100;
const numObjects = 50;
const numSensorsPerType = 2;

var sensorInstances = [];
var statTimer;

function publishTemperature(sensorData) {
    server.multicast('temperature', sensorData);
}

function publishPressure(sensorData) {
    server.multicast('pressure', sensorData);
}

function start() {
    server.start();

    console.log("starting simulation with " + numObjects + " objects");

    statTimer = setInterval(function() {
        var msgCounter = 0;
        for(var i = 0; i < sensorInstances.length; i++) {
            msgCounter += sensorInstances[i].msgCounter;
            sensorInstances[i].resetCounter();
        }
        console.log("currently producing " + msgCounter + " messages / second");
    }, 1000);

    for(var i = 0; i <= numObjects; i++) {
        var obj = {'id': "tank"+i, 'name': 'air tank #' + i};

        // temperature sensors
        for(var n = 0; n<= numSensorsPerType; n++) {
            var sensorId = i + "-temp" + n;
            var tempSensor = new sensors.TemperatureSensor(sensorId, pushIntervalMs, publishTemperature, obj);
            tempSensor.setTemperatureRange(30, 120);
            tempSensor.start();
            sensorInstances.push(tempSensor);
        }

        // pressure sensors
        for(var n = 0; n<= numSensorsPerType; n++) {
            var sensorId = i + "-press" + n;
            var pressSensor = new sensors.PressureSensor(sensorId, pushIntervalMs, publishPressure, obj);
            pressSensor.setPressureRange(1000, 10000);
            pressSensor.start();
            sensorInstances.push(pressSensor);
        }
    }
}

function stop() {
    for(var i = 0; i< sensorInstances.length; i++) {
        sensorInstances[i].stop();
    }
    setTimeout(function() {clearInterval(statTimer);}, 5000);
    console.log("simulation stopped. Queued up events might still be firing.");
}

module.exports = {
    'start': start,
    'stop': stop
};
