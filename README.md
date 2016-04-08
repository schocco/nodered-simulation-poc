# Node-Red Sensor Simulation 

Simulates multiple pressure and temperature sensors (with random, unrealistic values) that are attached to multiple
objects. Sensor data is published via a websocket. The [node-red](http://nodered.org) flow subscribes to the socket and processes 
emitted data to recognize when an object is in a critical state.

## Getting started

- run `npm install` to install required node modules and `npm start` to start the simulation
- open http://127.0.0.1:8000/red to see the deployed flow as it is processing simulated sensor measurements