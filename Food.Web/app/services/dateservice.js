(function() {
    'use strict';
    angular
        .module('app')
        .factory('dateservice', dateService)
        .directive('momentValidate', momentValidate)
        
    function dateService() {
        var monday = getMonday();
        var service = {
            monday: monday,
            getMonday: getMonday,
            getNextMonday:getNextMonday,
            check: check,
        };
        return service;

        function getMonday() {
            var d = new Date();
            var day = d.getDay();
            var diff = d.getDate() - day + (day == 0 ? -6:1); 
            return new Date(d.setDate(diff));
        }
        
        function getNextMonday() {
            var nextmonday = getMonday();
            nextmonday.setDate(nextmonday.getDate() + 7);
            return new Date(nextmonday);
        }

        function check(date) {
            var result = false;
            var today = new Date();
            today.setDate(today.getDate() + 1);
            var day = new Date(new Date(date).setHours(15, 0, 0, 0));

            if (day.getTime() > today.getTime()) {
                result = true;
            }

            return result;
        };
    };

    momentValidate.$inject = ['moment'];
    function momentValidate(moment) {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function(scope, elm, attr, ngModel) {
                if (!ngModel) return;

                var defaultViewFormat = 'L';

                var viewFormat = attr['viewFormat'] || defaultViewFormat;

                ngModel.$formatters.push(function(value) {
                    if (value) {
                        var m = moment(new Date(value));
                            if (m.isValid()) {
                                return m.format(viewFormat);
                            } else {
                                return value;
                            }
                   }
                });

                ngModel.$parsers.push(function(value) {
                    var m = moment(value, viewFormat, true);
                    if (m.isValid()) {
                        return m.toDate();
                    } else {
                        return value;
                    }
                });

                ngModel.$validators.moment = function(value) {
                    if (value) {
                            return moment(new Date(value)).isValid();
                    }
                    
                };
            }
        };
    }
    
})()