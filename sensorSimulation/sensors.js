'use strict';

var _ = require('underscore');

function random (low, high) {
    return Math.random() * (high - low) + low;
}

class BaseSensor {
    /**
     *
     * @param id sensor identifier
     * @param interval interval for pushing new sensor data in ms
     * @param listener callback function to be invoked with new sensor data
     *        (sensor data obj will be passed in as first argument)
     * @param obj instance of the observed object (e.g. a machine)
     */
    constructor(id, interval, listener, obj) {
        this.id = id;
        this.interval = interval;
        this.listener = listener;
        this.obj = obj;
        this.msgCounter = 0;
    }

    /**
     * Start emitting data
     * @param args additional arguments to be passed into the sensors listener function
     */
    start(args) {
        this.timer = setInterval(_.bind(this._emitData, this), this.interval, args);
    }

    stop() {
        clearInterval(this.timer);
    }

    /**
     * must be overridden by subclasses
     */
    getSensorData() {
        throw 'unimplemented';
    }

    _emitData(args) {
        var sensorDataObj = this.getSensorData();
        args = args || [];
        args.unshift(sensorDataObj);
        this.listener.apply(this, args);
        this.msgCounter++;
    }

    resetCounter() {
        this.msgCounter = 0;
    }
}

class TemperatureSensor extends BaseSensor {

    setTemperatureRange(min, max) {
        this.min = min;
        this.max = max;
    }

    getSensorData() {
        return {
            'sensorId': this.id,
            'object': this.obj,
            'temperature': random(this.min, this.max),
            'unit': 'celsius',
            'ttl': '1000',
            'ttlUnit': 'ms',
            'quality': random(0.2, 1)
        }
    }
}

class PressureSensor extends BaseSensor {

    setPressureRange(min, max) {
        this.min = min;
        this.max = max;
    }

    getSensorData() {
        return {
            'sensorId': this.id,
            'object': this.obj,
            'pressure': random(this.min, this.max),
            'unit': 'hPA',
            'ttl': '500',
            'ttlUnit': 'ms',
            'quality': random(0.2, 1)
        }
    }
}

module.exports = {
    PressureSensor: PressureSensor,
    TemperatureSensor: TemperatureSensor
};