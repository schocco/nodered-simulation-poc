var nodes = [{
    "id": "e44ff1a8.2f4b28",
    "type": "websocket-client",
    "z": "b2352c83.4dcad",
    "path": "ws://localhost:8001/pressure",
    "wholemsg": "false"
}, {
    "id": "775edeed.015c4",
    "type": "websocket-client",
    "z": "b2352c83.4dcad",
    "path": "ws://localhost:8001/temperature",
    "wholemsg": "false"
}, {
    "id": "749d6372.5c9344",
    "type": "function",
    "z": "b2352c83.4dcad",
    "name": "criticalPressure",
    "func": "var tankObj = msg.payload.object;\n// ensure object entry present in context\nif(context.get(tankObj.id) === undefined) {\n    context.set(tankObj.id, {'pressure': null, 'temperature': null});\n}\nvar objData = context.get(tankObj.id);\n\nif(msg.payload.temperature !== undefined) {\n    objData.temperature = msg.payload;\n}\nif(msg.payload.pressure !== undefined) {\n    objData.pressure = msg.payload;\n}\ncontext.set(tankObj.id, objData);\n\nvar pressure = objData.pressure || {'pressure': 2, 'quality': 0};\nvar temperature = objData.temperature || {'temperature': null, 'quality': 0};\n\nif(temperature.temperature >= 100 && pressure.pressure >= 8000) {\n    msg.situation = {\n        name: 'high pressure',\n        object: tankObj,\n        sources: [pressure.sensorId, temperature.sensorId],\n        description: 'Critical pressure detected. Run!',\n        quality: (pressure.quality + temperature.quality) / 2\n    };\n    return msg.situation;\n}",
    "outputs": "1",
    "noerr": 0,
    "x": 720,
    "y": 482.5,
    "wires": [["d118608d.4a0a48"]]
}, {
    "id": "5885a0e9.75a1a",
    "type": "websocket in",
    "z": "b2352c83.4dcad",
    "name": "temperature channel",
    "server": "",
    "client": "775edeed.015c4",
    "x": 135,
    "y": 435.5,
    "wires": [["c5d57dac.82202"]]
}, {
    "id": "75f9f15b.d34948",
    "type": "websocket in",
    "z": "b2352c83.4dcad",
    "name": "pressure channel",
    "server": "",
    "client": "e44ff1a8.2f4b28",
    "x": 113,
    "y": 521.5,
    "wires": [["78adaf81.af9af8"]]
}, {
    "id": "78adaf81.af9af8",
    "type": "json",
    "z": "b2352c83.4dcad",
    "name": "",
    "x": 332,
    "y": 524.5,
    "wires": [["5bcf0144.9d51f"]]
}, {
    "id": "c5d57dac.82202",
    "type": "json",
    "z": "b2352c83.4dcad",
    "name": "",
    "x": 332,
    "y": 435.5,
    "wires": [["3aab51a5.1e5e9e"]]
}, {
    "id": "d118608d.4a0a48",
    "type": "function",
    "z": "b2352c83.4dcad",
    "name": "filter q >= 0.9",
    "func": "if(msg.quality >= 0.9) {\n    return msg;\n}",
    "outputs": 1,
    "noerr": 0,
    "x": 978,
    "y": 483.5,
    "wires": [["70ecb5b8.5f992c"]]
}, {
    "id": "70ecb5b8.5f992c",
    "type": "debug",
    "z": "b2352c83.4dcad",
    "name": "situations filtered",
    "active": true,
    "console": "false",
    "complete": "true",
    "x": 1081,
    "y": 371,
    "wires": []
}, {
    "id": "3aab51a5.1e5e9e",
    "type": "function",
    "z": "b2352c83.4dcad",
    "name": "filter",
    "func": "if(msg.payload.quality >= 0.1) {\n    return msg;\n}",
    "outputs": 1,
    "noerr": 0,
    "x": 501,
    "y": 436.5,
    "wires": [["749d6372.5c9344"]]
}, {
    "id": "5bcf0144.9d51f",
    "type": "function",
    "z": "b2352c83.4dcad",
    "name": "filter",
    "func": "if(msg.payload.quality >= 0.1) {\n    return msg;\n}",
    "outputs": 1,
    "noerr": 0,
    "x": 506,
    "y": 529.5,
    "wires": [["749d6372.5c9344"]]
}];

module.exports = nodes;