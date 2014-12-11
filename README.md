OpenTSDB Node Client
====================
This is a node client module used to talk to OpenTSDB.


User Guide:
===========

To setup the project:
```
var TsdbNodeClient = require('tsdbclient');
var myTsdbClient = new TsdbNodeClient({
    host : 'http://localhost',
    port : '4242'
  });
```


To Put Metric
```
myTsdbClient.putMetric(
    'sys.cpu.nice',
    now,
    Math.floor(Math.random() * 1000), {
        host: "web01",
        bit: Math.floor(Math.random() * 1000) % 2
    }
).then(function() {
    console.log('putMetric', r);
});
```

To Get Aggregators
```
myTsdbClient.getAggregators().then(function(r) {
    console.log('getAggregators', r);
});
```


To Put Annotation
```
myTsdbClient.putAnnotation(now, 'description', 'notes', {note1 : 'a', note2 : 'b'}).then(function(r) {
    console.log('putAnnotation', r);
});
```

To Get Annotation
```
myTsdbClient.getAnnotation('1418330869127').then(function(r) {
    console.log('getAnnotation', r)
});
```



To Query TSDB for Datapoints
```
var queries = [
    myTsdbClient.composeQuery(
        'sys.cpu.nice',
        'sum', {
            bit: '*'
        },
        myTsdbClient.composeDownsampleString('sum', '15m'),
        false,
        myTsdbClient.composeRateOption()
    )
];

myTsdbClient.query(
    '2014/12/10-14:34:00',
    '',
    queries
).then(function(r) {
    console.log('query', r);
});

//sample response:
[{ metric: 'sys.cpu.nice',
    tags: { bit: '0', host: 'web01' },
    aggregateTags: [],
    dps:
     { '1418329758': 620,
       '1418329760': 3968,
       '1418336866': 995,
       '1418336873': 544 } },
  { metric: 'sys.cpu.nice',
    tags: { bit: '1', host: 'web01' },
    aggregateTags: [],
    dps:
     { '1418329760': 346,
       '1418329761': 713,
       '1418329790': 1208,
       '1418336977': 291,
       '1418336984': 13 } }
]
```



To Get Suggestion (autocomplete) for tagK, tagV and metric
```
myTsdbClient.suggestMetrics(
  'sys',
  3
).then(function(r) {
  console.log('suggestMetrics', 'sys', r);
});
//sample response
suggestMetrics sys [ 'sys.cpu.nice' ]




myTsdbClient.suggestTagK(
  'b',
  3
).then(function(r) {
  console.log('suggestTagK', 'b', r);
});
suggestTagK b [ 'bit' ]




myTsdbClient.suggestTagV(
  'w',
  3
).then(function(r) {
  console.log('suggestTagV', 'w', r);
});
//sample response
suggestTagV w [ 'web01' ]

```
