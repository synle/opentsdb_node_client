var unirest = require('unirest');
var Q = require('q');

//not to be shared
module.exports = function(conf) {
    var self = this;

    //constructor
    var host = conf.host !== undefined ? conf.host : 'localhost';
    var port = conf.port !== undefined ? conf.port : 4242;
    var full_host = host + ":" + port;

    self._endpoints = {
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

        unirest.post(full_host + self._endpoints.put)
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

        unirest.post(full_host + self._endpoints.put)
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

        unirest.get(full_host + self._endpoints.aggregators)
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

        unirest.post(full_host + self._endpoints.annotation)
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

        unirest.get(full_host + self._endpoints.annotation)
            .query(request)
            .end(function(response) {
                deferred.resolve(response.body);
            });

        return deferred.promise;
    };


    /**
     * query tsdb for data points (dps)
     * http://opentsdb.net/docs/build/html/api_http/query/index.html
     * @param  {[type]} start
     * @param  {[type]} end
     * @param  {[type]} queries
     * @return {[type]}
     */


    /**
     * query tsdb for data points (dps)
     * @param  Int start The start time for the query. This can be a relative or absolute timestamp. See Querying or Reading Data for details.
     * @param  Int end An end time for the query. If not supplied, the TSD will assume the local system time on the server. This may be a relative or absolute timestamp. See Querying or Reading Data for details.
     * @param  Array queries           One or more sub queries used to select the time series to return. These may be metric m or TSUID tsuids queries
     * @param  Boolean showTSUIDs        Whether or not to output the TSUIDs associated with timeseries in the results. If multiple time series were aggregated into one set, multiple TSUIDs will be returned in a sorted manner
     * @param  Boolean msResolution      Whether or not to output data point timestamps in milliseconds or seconds. If this flag is not provided and there are multiple data points within a second, those data points will be down sampled using the query's aggregation function
     * @param  Boolean globalAnnotations  Whether or not the query should retrieve global annotations for the requested timespan
     * @param  Boolean noAnnotations     Whether or not to return annotations with a query. The default is to return annotations for the requested timespan but this flag can disable the return. This affects both local and global notes and overrides globalAnnotations
     * @return Defer Object with TSDB Responses
     */
    self.query = function(start, end, queries, showTSUIDs, msResolution, globalAnnotations, noAnnotations) {
        var deferred = Q.defer();

        //default params
        if (showTSUIDs !== true) {
            showTSUIDs = false;
        }
        if (msResolution !== true) {
            msResolution = false;
        }
        if (globalAnnotations !== true) {
            globalAnnotations = false;
        }
        if (noAnnotations !== false) {
            noAnnotations = true;
        }

        var request = {
            start: start,
            end: end,
            queries: queries,
            showTSUIDs: showTSUIDs,
            msResolution: msResolution,
            globalAnnotations: globalAnnotations,
            noAnnotations: noAnnotations
        };

        unirest.post(full_host + self._endpoints.query)
            .type('json')
            .send(request)
            .end(function(response) {
                deferred.resolve(response.body);
            });

        return deferred.promise;
    }



    /**
     * compose sub queries to be sent along with the query tsdb calls
     * http://opentsdb.net/docs/build/html/api_http/query/index.html
     * @param  {[type]} metric
     * @param  {[type]} metricAggregator     aggregation on metric (vertical aggregation)
     * @param  {[type]} tags
     * @param  {[type]} downsample
     * @param  {[type]} rate
     * @param  {[type]} rateOption
     * example, the value can be 15m
     * @return tsdb subquery object
     */
    self.composeQuery = function(metric, metricAggregator, tags, downsample, rate, rateOption) {
        var query = {
            "aggregator": metricAggregator,
            "metric": metric
        };

        if (rate !== undefined) {
            query.rate = rate;
        }
        if (tags !== undefined) {
            query.tags = tags;
        }
        if (downsample !== undefined) {
            query.downsample = downsample;
        }
        if (rateOption !== undefined) {
            query.rateOption = rateOption;
        }

        return query;
    }


    /**
     * http://opentsdb.net/docs/build/html/api_http/query/index.html
     * @param  {[type]} downsampleAggregator methods : sum, min, max, avg, etc.
     * @param  {[type]} downsampleResolution the actual time of downsample aggregation. For
     * example, the value can be 15m
     * @return String downsample string: 15m-sum or 1h-avg
     */
    self.composeDownsampleString = function(downsampleAggregator, downsampleResolution) {
        if (downsampleResolution !== undefined && downsampleAggregator !== undefined) {
            return downsampleResolution + "-" + downsampleAggregator //sample 5m-sum
        } else {
            return undefined;
        }
    }



    /**
     * http://opentsdb.net/docs/build/html/api_http/query/index.html
     * @param counter Boolean Optional    Whether or not the underlying data is a monotonically increasing counter that may roll over
     * @param counterMax  Integer Optional    A positive integer representing the maximum value for the counter.
     * @param resetValue  Integer Optional    An optional value that, when exceeded, will cause the aggregator to return a 0 instead of the calculated rate. Useful when data sources are frequently reset to avoid spurious spikes.
     * @return Rate Option object
     */
    self.composeRateOption = function(counter, counterMax, resetValue) {
        if (counter !== undefined && counterMax !== undefined && resetValue !== undefined) {
            return {
                counter: counter,
                counterMax: counterMax,
                resetValue: resetValue,
            }
        } else {
            return undefined;
        }
    }


    /**
     * auto suggestion for metric names
     * http://opentsdb.net/docs/build/html/api_http/suggest.html
     * @param type    String  Required    The type of data to auto complete on. Must be one of the following: metrics, tagk or tagv       type        metrics
     * @param q   String  Optional    A string to match on for the given type     q       web
     * @param max Integer Optional    The maximum number of suggested results to return. Must be greater than 0   25  max     10
     * @return Defer Object with suggested items
     */
    self.suggest = function(type, q, max) {
        var deferred = Q.defer();

        if (max === undefined) {
            type = 20;
        }

        unirest.post(full_host + self._endpoints.suggest)
            .type('json')
            .send({
                "type": type,
                "q": q,
                "max": max
            })
            .end(function(response) {
                deferred.resolve(response.body);
            });

        return deferred.promise;
    }


    /**
     * http://opentsdb.net/docs/build/html/api_http/suggest.html
     * @param q   String  Optional    A string to match on for the given type     q       web
     * @param max Integer Optional    The maximum number of suggested results to return. Must be greater than 0   25  max     10
     * @return Defer Object with suggested items
     */
    self.suggestMetrics = function(q, max) {
        return self.suggest('metrics', q, max);
    }


    /**
     * http://opentsdb.net/docs/build/html/api_http/suggest.html
     * @param q   String  Optional    A string to match on for the given type     q       web
     * @param max Integer Optional    The maximum number of suggested results to return. Must be greater than 0   25  max     10
     * @return Defer Object with suggested items
     */
    self.suggestTagK = function(q, max) {
        return self.suggest('tagk', q, max);
    }

    /**
     * http://opentsdb.net/docs/build/html/api_http/suggest.html
     * @param q   String  Optional    A string to match on for the given type     q       web
     * @param max Integer Optional    The maximum number of suggested results to return. Must be greater than 0   25  max     10
     * @return Defer Object with suggested items
     */
    self.suggestTagV = function(q, max) {
        return self.suggest('tagv', q, max);
    }



    /**
     * http://opentsdb.net/docs/build/html/api_http/version.html
     * @return Defer Object
     */
    self.version = function() {
        var deferred = Q.defer();

        unirest.get(full_host + self._endpoints.version)
            .end(function(response) {
                deferred.resolve(response.body);
            });

        return deferred.promise;
    }


    /**
     * http://opentsdb.net/docs/build/html/api_http/dropcaches.html
     * @return {[type]} [description]
     */
    self.dropcaches = function() {
        var deferred = Q.defer();

        unirest.get(full_host + self._endpoints.dropcaches)
            .end(function(response) {
                deferred.resolve(response.body);
            });

        return deferred.promise;
    }


    /**
     * http://opentsdb.net/docs/build/html/api_http/serializers.html
     * @return {[type]} [description]
     */
    self.serializers = function() {
        var deferred = Q.defer();

        unirest.get(full_host + self._endpoints.serializers)
            .end(function(response) {
                deferred.resolve(response.body);
            });

        return deferred.promise;
    }


    /**
     http://opentsdb.net/docs/build/html/api_http/stats.html
     * @return {[type]} [description]
     */
    self.stats = function() {
        var deferred = Q.defer();

        unirest.get(full_host + self._endpoints.stats)
            .end(function(response) {
                deferred.resolve(response.body);
            });

        return deferred.promise;
    }
}