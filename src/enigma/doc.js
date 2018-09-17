const enigma = require('enigma.js');
const schema = require('enigma.js/schemas/12.20.0.json');

const url = 'ws://localhost:9076/app';
const host_hostname = 'docker.for.mac.localhost';
let session = null;

const docMixin = {
  types: ['Doc'],
  extend: {
    getHighScore() {
      return this.createSessionObject({
        qInfo: {
          qType: 'highscore',
        },
        qHyperCubeDef: {
          qDimensions: [
            { qDef: { qFieldDefs: ['name'] } },
            {
              qDef: {
                qFieldDefs: ['score'],
                qReverseSort: true,
                qSortCriterias: [{ qSortByNumeric: true }],
              },
            },
          ],
          qInitialDataFetch: [{
            qWidth: 2,
            qHeight: 1000,
          }],
          qInterColumnSortOrder: [1, 0],
        },
      }).then(obj => obj.getLayout());
    },
  },
};

export default async function getDoc() {
  if (session) {
    const global = await session.open();
    return global.getActiveDoc();
  }
  session = enigma.create({ url, schema, mixins: [docMixin] });
  const global = await session.open();
  const doc = await global.createSessionApp();

  await Promise.all([
    doc.createConnection({
      qType: 'internet',
      qName: 'players',
      qConnectionString: `http://${host_hostname}:8081/csv/players`,
    }),
    doc.createConnection({
      qType: 'internet',
      qName: 'games',
      qConnectionString: `http://${host_hostname}:8081/csv/games`,
    }),
    doc.createConnection({
      qType: 'internet',
      qName: 'entries',
      qConnectionString: `http://${host_hostname}:8081/csv/entries`,
    }),
  ]);

  const script = `
[games]:
LOAD
  [userid],
  [gameid],
  [timestamp],
  [score]
FROM [lib://games]
(txt, codepage is 1252, embedded labels, delimiter is ',', msq);

[players]:
LOAD
  [userid],
  [name]
FROM [lib://players]
(txt, utf8, embedded labels, delimiter is ',', msq);

[entries]:
LOAD
  [gameid],
  [time],
  [speed],
  [cadence],
  [power]
FROM [lib://entries]
(txt, codepage is 1252, embedded labels, delimiter is ',', msq);
  `;

  await doc.setScript(script);
  await doc.doReload();
  return doc;
}
