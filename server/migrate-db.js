/* eslint no-bitwise:0,no-mixed-operators:0,no-param-reassign:0,no-console:0 */

const fs = require('fs');

const players = require(`${__dirname}/../database/players.json`);
const games = require(`${__dirname}/../database/games.json`);

// WARNING: Only run this script to convert an older
// database (that used string user ids based on card scans)
// to a new one that separates cards from user ids

const guid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
  const r = Math.random() * 16 | 0;
  const v = c === 'x' ? r : r & 0x3 | 0x8;
  return v.toString(16);
});

const idMappings = {};

players.players.forEach((p) => {
  if (p.cardid) {
    throw new Error('Looks like this database has been migrated already, aborting');
  }
  p.cardid = p.userid;
  p.userid = guid();
  idMappings[p.cardid] = p.userid;
});


games.games.forEach((g) => {
  g.userid = idMappings[g.userid];
});

console.log(idMappings);

fs.writeFileSync(`${__dirname}/../database/players.json`, JSON.stringify(players, null, '  '));
fs.writeFileSync(`${__dirname}/../database/games.json`, JSON.stringify(games, null, '  '));

console.log('db updated');
