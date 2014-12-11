var unirest = require('unirest');
var totalCount = 0;
var tsdb_url = 'http://localhost:4242';

unirest.post(tsdb_url+ '/api/put')
  .type('json')
  .send({
    "metric": "sys.cpu.nice",
    "timestamp": 1346846400,
    "value": Math.floor(Math.random() * 100),
    "tags": {
      "host": "web01",
      "dc": "lga"
    }
  })
  .end(function(response) {

  });
