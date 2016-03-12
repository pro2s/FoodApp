(function() {
    'use strict';
    angular
        .module('app')
        .factory('Pagination', Pagination)
        .factory('PaginationInterceptor', PaginationInterceptor);

    Pagination.$inject = [];
    
    function Pagination() {
        var _paginator = [];
        
        activate();
        
        var service = {
            paginator: _paginator,
            addPagination: addPagination,
            parseRange: parseRange,
            getRange: getRange,
            parseHeader: parseHeader,
        };

        return service;

        function activate() {
            
        }

        function addPagination(name, perPage) {
            if (!perPage) {
                perPage = 10;
            }
            _paginator[name] = {
                currentPage: 1,
                totalItems: 0,
                perPage: perPage,
            }

            return _paginator[name];
        }

        function parseRange(hdr) {
            var m = hdr && hdr.match(/^(?:\S+ )?(\d+)-(\d+)\/(\d+|\*)$/);
            if (m) {
                return {
                    from: +m[1],
                    to: +m[2],
                    total: m[3] === '*' ? Infinity : +m[3]
                };
            } else if (hdr === '*/0') {
                return { total: 0 };
            }
            return null;
        }

        function getRange(name) {
            var info = _paginator[name];
            var range = ''
            if (info) {
                var from = (info.currentPage - 1) * info.perPage;
                var to = from + info.perPage - 1;
                range = 'x-entity=' + from + '-' + to;
            }
            return range;
        }

        function parseHeader(name, contentRange) {
            var info = _paginator[name];
            if (info) {
                var range = parseRange(contentRange);
                if (range) {
                    info.totalItems = range.total;
                    info.currentPage = Math.ceil(range.from / info.perPage) + 1;
                } else {
                    info.totalItems = value.length;
                    info.currentPage = 1;
                }
            }
        }

    };
    
    PaginationInterceptor.$inject = ['$q', 'Pagination'];
    function PaginationInterceptor($q, Pagination) {
        function appendTransform(defaults, transform) {
            // We can't guarantee that the default transformation is an array
            defaults = angular.isArray(defaults) ? defaults : [defaults];
            // Append the new transformation to the defaults
            return defaults.concat(transform);
        }
        
        return {
            
            'request': function (config) {

                for (var key in config.params) {
                    
                    if (key === 'pagination') {
                        //get pagination id
                        var name = config.params[key];
                        delete config.params[key];

                        // add Range header
                        var range = Pagination.getRange(name);
                        if (range) {
                            config.headers['Range'] = Pagination.getRange(name);
                        }
                        
                        config.transformResponse = appendTransform(config.transformResponse, function (value, getHeaders, status) {
                            var range = getHeaders('content-range');
                            Pagination.parseHeader(name, range);
                            return value;
                        })
                    }
                }

                return config;
            },

            
            
            'response': function (response) {
                // do something on success
                return response;
            },
            
        };
    };

    
})()