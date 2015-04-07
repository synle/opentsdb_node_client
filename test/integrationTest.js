//public
var chai = require("chai")
var assert = chai.assert;

//internal
var TsdbClient = require('../lib/tsdbClient.js');
var myTsdbClient = new TsdbClient({
    host: 'http://192.168.1.100',
    port: '4242'
});

describe('TsdbClient', function() {
    describe('#getAggregators', function() {
        it('TsdbClient.getAggregators', function(done) {
            myTsdbClient.getAggregators().then(function(r) {
                var expectedAggregators = [
                    'min',
                    'mimmin',
                    'max',
                    'mimmax',
                    'dev',
                    'sum',
                    'avg',
                    'zimsum'
                ]

                //run through and delete the list
                assert.equal(r.length > 0, true);
                r.forEach(function(agg) {
                    assert.equal(
                        expectedAggregators.indexOf(agg) >= 0,
                        true
                    )
                });

                done();
            });
        })
    })
})