const WebSocket = require('ws');
const Ant = require('aai-ant-plus');

const isGarmin = true;

const wss = new WebSocket.Server({ port: 8080 });
const stick = new Ant.GarminStick3();
const sockets = [];

let speedSensor;
let cadenceSensor;
let powerSensor;

if (isGarmin) {
  speedSensor = new Ant.SpeedSensor(stick);
  cadenceSensor = new Ant.CadenceSensor(stick);
} else {
  speedSensor = new Ant.SpeedCadenceSensor(stick);
  cadenceSensor = speedSensor;
  powerSensor = new Ant.BicyclePowerSensor(stick);
}

// in meters, circumference (e.g. 28"*3,14*0.39=circumference in cm):
speedSensor.setWheelCircumference(2.23);

speedSensor.on('speedData', (data) => {
  const { DeviceID, CalculatedSpeed, CumulativeSpeedRevolutionCount } = data;
  sockets.forEach(s => s.send(JSON.stringify({
    type: 'ant-speed',
    data: {
      DeviceID, CalculatedSpeed, CumulativeSpeedRevolutionCount,
    },
  })));
});

cadenceSensor.on('cadenceData', (data) => {
  const { DeviceID, CalculatedCadence, CumulativeCadenceRevolutionCount } = data;
  sockets.forEach(s => s.send(JSON.stringify({
    type: 'ant-cadence',
    data: {
      DeviceID, CalculatedCadence, CumulativeCadenceRevolutionCount,
    },
  })));
});

if (powerSensor) {
  powerSensor.on('powerData', (data) => {
    const { DeviceID, Power } = data;
    sockets.forEach(s => s.send(JSON.stringify({
      type: 'ant-power',
      data: {
        DeviceID, Power,
      },
    })));
  });
}

/* rfid.on('blip', (data) => {
  sockets.forEach(s => s.send(JSON.stringify({
    type: 'blip',
    data,
  })));
}); */

stick.on('startup', () => {
  speedSensor.attach(3, 0);
  if (isGarmin) {
    cadenceSensor.attach(2, 0);
  } else {
    powerSensor.attach(1, 0);
  }
});

if (!stick.open()) {
  console.log('Stick not found!');
}


wss.on('connection', (ws) => {
  sockets.push(ws);

  ws.on('send', (message) => {
    console.log('sent: %s', message);
  });

  ws.on('message', (message) => {
    console.log('received: %s', message);
  });

  ws.on('close', () => {
    const idx = sockets.indexOf(ws);
    sockets.splice(idx, 1);
  });
});
