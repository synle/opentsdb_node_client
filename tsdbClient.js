var unirest = require('unirest');
var Q = require('q');

//not to be shared
var ENDPOINTS = {
    s: '/s',
    aggregators: '/api/aggregators',
    annotation: '/api/annotation',
    config: '/api/config',
    dropcaches: '/api/dropcaches',
    put: '/api/put',
    query: '/api/query',
    search: '/api/search',
    serializers: '/api/serializers',
    stats: '/api/stats',
    suggest: '/api/suggest',
    tree: '/api/tree',
    uid: '/api/uid',
    version: '/api/version'
}


module.exports = function(conf) {
    var self = this;

    //constructor
    var host = conf.host !== undefined ? conf.host : 'localhost';
    var port = conf.port !== undefined ? conf.port : 4242;
    var full_host = host + ":" + port;

    /**
     * @return host
     */
    self.getHost = function() {
        return port;
    }


    /**
     * @return tsdb port
     */
    self.getPort = function() {
        return port;
    }


    /**
     * @return get full host
     */
    self.getFullHost = function() {
        return full_host;
    }




    //actual api here

    /**
     * put metrics
     * http://opentsdb.net/docs/build/html/api_http/put.html
     * @param String metric metric to be pushed
     * @param int timestamp
     * @param float value
     * @param tags tag object
     * @return Defer object (put metric into TSDB)
     */
    self.putMetric = function(metric, timestamp, value, tags) {
        var deferred = Q.defer();

        unirest.post(full_host + ENDPOINTS.put)
            .type('json')
            .send({
                "metric": metric,
                "timestamp": timestamp,
                "value": value,
                "tags": tags
            })
            .end(function(response) {
                deferred.resolve(metric);
            });

        return deferred.promise;
    }



    /**
     * put metrics
     * http://opentsdb.net/docs/build/html/api_http/put.html
     * @param  Array metrics array of metrics
     * @return Defer object (put multiple metrics into TSDB)
     */
    self.putMetrics = function(metrics) {
        var deferred = Q.defer();

        unirest.post(full_host + ENDPOINTS.put)
            .type('json')
            .send(metrics)
            .end(function(response) {
                deferred.resolve(metrics);
            });

        return deferred.promise;
    }


    /**
     * get aggregator:
     * http://opentsdb.net/docs/build/html/api_http/aggregators.html
     * @return Defer Object
     */
    self.getAggregators = function() {
        var deferred = Q.defer();

        unirest.get(full_host + ENDPOINTS.aggregators)
            .end(function(response) {
                deferred.resolve(response.body);
            });

        return deferred.promise;
    }


    /**
     * put annotation
     * http://opentsdb.net/docs/build/html/api_http/annotation/index.html
     * @param int startTime  Integer Required    A Unix epoch timestamp, in seconds, marking the time when the annotation event should be recorded       start_time  RW  1369141261
     * @param int endTime Integer Optional    An optional end time for the event if it has completed or been resolved 0   end_time    RW  1369141262
     * @param string description String  Optional    A brief description of the event. As this may appear on GnuPlot graphs, the description should be very short, ideally less than 25 characters.      description RW  Network Outage
     * @param string notes   String  Optional    Detailed notes about the event      notes   RW  Switch #5 died and was replaced
     * @param Object custom  Map Optional    A key/value map to store custom fields and values   null        RW  See Below
     * @param string tsuid   String  Optional    A TSUID if the annotation is associated with a timeseries. This may be null or empty if the note was for a global event     tsuid   RW  000001000001000001
     * @return Defer Object
     */
    self.putAnnotation = function(startTime, description, notes, customNote, tsduid) {
        var deferred = Q.defer();

        var request = {
            "startTime": startTime,
            "description": description,
            "notes": notes,
            "custom": customNote
        };

        if (tsduid === undefined) {
            request.tsduid = tsduid;
        }

        unirest.post(full_host + ENDPOINTS.annotation)
            .type('json')
            .send(request)
            .end(function(response) {
                deferred.resolve(response.body);
            });

        return deferred.promise;
    }


    /**
     * get annotation
     * http://opentsdb.net/docs/build/html/api_http/annotation/index.html
     * @param  start_time start time in ms
     * @param tsduid tsuid
     * @return Defer Object
     */
    self.getAnnotation = function(start_time, tsuid) {
        var deferred = Q.defer();

        var request = {
            start_time: start_time
        };

        if (tsuid !== undefined) {
            request.tsuid = tsuid;
        }

        unirest.get(full_host + ENDPOINTS.annotation)
            .type('json')
            .send(request)
            .end(function(response) {
                deferred.resolve(response.body);
            });

        return deferred.promise;
    };
}