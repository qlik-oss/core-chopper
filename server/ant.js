const Ant = require('aai-ant-plus');

const stick = new Ant.GarminStick3();

let speedSensor;
let cadenceSensor;
let powerSensor;

speedSensor = new Ant.SpeedSensor(stick);
cadenceSensor = new Ant.CadenceSensor(stick);
/* speedSensor = new Ant.SpeedCadenceSensor(stick);
cadenceSensor = speedSensor; */
powerSensor = new Ant.BicyclePowerSensor(stick);

// in meters, circumference (e.g. 28"*3,14*0.39=circumference in cm):
speedSensor.setWheelCircumference(2.23);

stick.on('startup', () => {
  speedSensor.attach(3, 0);
  cadenceSensor.attach(2, 0);
  powerSensor.attach(1, 0);
});

if (!stick.open()) {
  throw new Error('Stick not found!');
}

module.exports = {
  speedSensor, cadenceSensor, powerSensor,
};
