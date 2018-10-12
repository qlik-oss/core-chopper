/* eslint no-console: 0 */

const http = require('http');
const { NFC } = require('nfc-pcsc');
const {
  getOrCreateUser,
  updateUser,
  getAllPlayers,
  createGame,
  updateGame,
  createEntries,
  getAllGames,
  getAllEntries,
  removeGame,
  removeEntries,
} = require('./lowdb');

const nfc = new NFC();
const createWebSocketServer = require('./ws');
const { speedSensor, cadenceSensor, powerSensor } = require('./ant');

const REST_PORT = 8081;
const WSS_PORT = 8080;

let currentGame = null;
let currentUser = { userid: null, cardid: null, name: null };
let latestSpeed = 0;
let latestCadence = 0;
let latestPower = 0;

const { sockets } = createWebSocketServer(WSS_PORT, (data) => {
  const result = JSON.parse(data);
  console.log('socket:received', data);
  if (result.type === 'user:save') {
    const user = getOrCreateUser(result.data.cardid);
    Object.assign(user, result.data);
    updateUser(user);
    sockets.forEach(s => s.send(JSON.stringify({
      type: 'user:updated',
      data: user,
    })));
    currentUser = user;
  } else if (result.type === 'game:started') {
    currentGame = createGame(currentUser);
  } else if (result.type === 'game:ended') {
    updateGame(currentGame, result.data);
    currentGame = null;
  }
}, () => {
  console.log('socket:closed');
  if (currentGame) {
    console.log('game:cleaning up');
    removeGame(currentGame);
    removeEntries(currentGame);
  }
  currentUser = null;
  currentGame = null;
});

nfc.on('reader', (reader) => {
  console.log('reader:attached');
  reader.on('card', (card) => {
    const user = getOrCreateUser(card.uid);
    const evt = currentUser && currentUser.userid === user.userid ? 'user:scanned' : 'user:updated';
    currentUser = user;
    console.log('reader:scanned', user);
    sockets.forEach(s => s.send(JSON.stringify({
      type: evt,
      data: user,
    })));
  });
  reader.on('error', (err) => {
    console.error('reader:error ', err);
  });
});

speedSensor.on('speedData', (data) => {
  latestSpeed = data.CalculatedSpeed;
  // const { DeviceID, CalculatedSpeed, CumulativeSpeedRevolutionCount } = data;
});

cadenceSensor.on('cadenceData', (data) => {
  latestCadence = data.CalculatedCadence;
  // const { DeviceID, CalculatedCadence, CumulativeCadenceRevolutionCount } = data;
});

powerSensor.on('powerData', (data) => {
  if (!latestPower && !data.Power) {
    // two consecutive non-power data points:
    return;
  }
  latestPower = data.Power;
  if (currentGame) {
    createEntries(currentGame, latestSpeed, latestCadence, latestPower);
  }

  const { DeviceID, Power } = data;
  sockets.forEach(s => s.send(JSON.stringify({
    type: 'ant:power',
    data: {
      DeviceID, Power,
    },
  })));
});

const server = http.createServer((req, res) => {
  try {
    if (req.url === '/csv/players') {
      const players = getAllPlayers();
      let out = 'userid,cardid,name\n';
      out += players.map(p => `${p.userid},${p.cardid},${p.name}\n`).join('');
      res.end(out);
    } else if (req.url === '/csv/games') {
      const games = getAllGames();
      let out = 'userid,gameid,starttime,endtime,score\n';
      out += games.map(p => `${p.userid},${p.gameid},${p.starttime},${p.endtime},${p.score}\n`).join('');
      res.end(out);
    } else if (req.url === '/csv/entries') {
      const entires = getAllEntries();
      let out = 'gameid,time,duration,speed,cadence,power\n';
      out += entires.map(p => `${p.gameid},${p.time},${p.duration},${p.speed},${p.cadence},${p.power}\n`).join('');
      res.end(out);
    } else {
      res.status = 404;
      res.end('Not found');
    }
  } catch (err) {
    res.status = 500;
    res.end(err.stack);
  }
});

server.listen(REST_PORT);

console.log(`rest:listening on ${REST_PORT}\nsocket:listening on ${WSS_PORT}`);
