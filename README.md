OpenTSDB Node Client
====================



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