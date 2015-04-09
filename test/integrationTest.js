//public
var chai = require("chai");
var assert = chai.assert;

//internal
var TsdbClient = require('../index');
var myTsdbClient = new TsdbClient({
    host: 'http://mockbin.org/bin',
    port: '80'
});

//override the endpoint with mockbin stuff
myTsdbClient._endpoints = {
    // s: '/s',
    aggregators: 'a73e80c8-4df1-4993-ac6b-30e2ea8b6d2d',
    // annotation: '/api/annotation',
    // config: '/api/config',
    // dropcaches: '/api/dropcaches',
    // put: '/api/put',
    // query: '/api/query',
    // search: '/api/search',
    serializers: '/373c16c2-e6aa-40db-8d9a-5d09fcf95f94',
    stats: '/2777260e-145a-480f-ab75-4a3cb38b5162',
    suggest: '/84e1779e-d122-4749-b056-c6b314bca51c',
    // tree: '/api/tree',
    // uid: '/api/uid',
    version: '/721cf3cf-db5a-4657-9f83-11dcb7b9ee31'
}


describe('TsdbClient', function() {
    describe('suggest', function() {
        it('TsdbClient.suggestMetrics should work', function(done) {
            myTsdbClient.suggestMetrics(
                'sys',
                3
            ).then(function(r) {
                assert.equal(
                    r.length > 0,
                    true
                );
            }, function(){
                assert.equal('TsdbClient.suggestMetrics failed', false);
            }).fin(function(){
                //callback returns, then end the it test
                done();
            });
        });

        it('TsdbClient.suggestTagK should work', function(done) {
            myTsdbClient.suggestTagK(
                'host',
                3
            ).then(function(r) {
                assert.equal(
                    r.length > 0,
                    true
                );
            }, function(){
                assert.equal('TsdbClient.suggestTagK failed', false);
            }).fin(function(){
                //callback returns, then end the it test
                done();
            });
        });

        it('TsdbClient.suggestTagV should work', function(done) {
            myTsdbClient.suggestTagV(
                '',
                3
            ).then(function(r) {
                assert.equal(
                    r.length > 0,
                    true
                );

            }, function(){
                assert.equal('TsdbClient.suggestTagV failed', false)
            }).fin(function(){
                //callback returns, then end the it test
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
            }, function(){
                assert.equal('TsdbClient.getAggregators failed', false);
            }).fin(function(){
                //callback returns, then end the it test
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
            }, function(){
                assert.equal('TsdbClient.version failed', false);
            }).fin(function(){
                //callback returns, then end the it test
                done();
            });
        });

        it('TsdbClient.serializers should work', function(done) {
            myTsdbClient.serializers().then(function(r) {
                assert.equal(
                    r.length > 0,
                    true
                )
            }, function(){
                assert.equal('TsdbClient.serializers failed', false);
            }).fin(function(){
                //callback returns, then end the it test
                done();
            });
        });


        it('TsdbClient.stats should work', function(done) {
            myTsdbClient.stats().then(function(r) {
                assert.equal(
                    r.length > 0,
                    true
                )
            }, function(){
                assert.equal('TsdbClient.stats failed', false);
            }).fin(function(){
                //callback returns, then end the it test
                done();
            });
        });
    });
});