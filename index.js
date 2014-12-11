var TsdbClient = require('./tsdbClient');
var myTsdbClient = new TsdbClient({
    host: 'http://localhost',
    port: '4242'
});


var now = Date.now();
console.log(now);

myTsdbClient.putMetric(
    'sys.cpu.nice',
    now,
    Math.floor(Math.random() * 1000), {
        host: "web01",
        bit: Math.floor(Math.random() * 1000) % 5
    }
).then(function() {
    console.log('putMetric', r);
});


myTsdbClient.getAggregators().then(function(r) {
    console.log('getAggregators', r);
});


myTsdbClient.putAnnotation(now, 'description', 'notes', {
    note1: 'a',
    note2: 'b'
}).then(function(r) {
    console.log('putAnnotation', r);
});

myTsdbClient.getAnnotation('1418330869127').then(function(r) {
    // console.log('getAnnotation', r)
});



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