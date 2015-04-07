//public
var chai = require("chai");
var assert = chai.assert;

//internal
var TsdbClient = require('../lib/tsdbClient.js');
var myTsdbClient = new TsdbClient({
    host: 'http://192.168.1.100',
    port: '4242'
});

describe('TsdbClient', function() {
    describe('TsdbClient.suggest', function() {
        it('TsdbClient.suggestMetrics should work', function(done) {
            myTsdbClient.suggestMetrics(
                'sys',
                3
            ).then(function(r) {
                assert.equal(
                    r.length > 0 && r.length <= 3,
                    true
                );

                assert.equal(
                    r[0].indexOf('sys') >= 0,
                    true
                );

                done();
            });
        });

        it('TsdbClient.suggestTagK should work', function(done) {
            myTsdbClient.suggestTagK(
                'host',
                3
            ).then(function(r) {
                assert.equal(
                    r.length > 0 && r.length <= 3,
                    true
                );

                assert.equal(
                    r[0].indexOf('host') >= 0,
                    true
                );

                done();
            });
        });

        it('TsdbClient.suggestTagV should work', function(done) {
            myTsdbClient.suggestTagV(
                '',
                3
            ).then(function(r) {
                assert.equal(
                    r.length > 0 && r.length <= 3,
                    true
                );


                done();
            });
        });
    });


    describe('misc', function() {
        it('TsdbClient.getAggregators should work', function(done) {
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
                ];

                //run through and delete the list
                assert.equal(r.length > 0, true);
                r.forEach(function(agg) {
                    assert.equal(
                        expectedAggregators.indexOf(agg) >= 0,
                        true
                    );
                });

                done();
            });
        });


        it('TsdbClient.version should work', function(done) {
            myTsdbClient.version().then(function(r) {

                assert.isDefined(r.timestamp);
                assert.isDefined(r.host);
                assert.isDefined(r.repo);
                assert.isDefined(r.full_revision);
                assert.isDefined(r.short_revision);
                assert.isDefined(r.user);
                assert.isDefined(r.repo_status);
                assert.isDefined(r.version);

                done();
            });
        });

        it('TsdbClient.serializers should work', function(done) {
            myTsdbClient.serializers().then(function(r) {
                assert.equal(
                    r.length > 0,
                    true
                )

                done();
            });
        });


        it('TsdbClient.stats should work', function(done) {
            myTsdbClient.stats().then(function(r) {
                assert.equal(
                    r.length > 0,
                    true
                )

                done();
            });
        });
    });
});