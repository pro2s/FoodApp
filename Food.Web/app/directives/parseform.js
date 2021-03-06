﻿(function () {
    'use strict';
    angular
        .module('app')
        .factory('Parser',Parser)
        .directive('parseForm', parseForm);

    Parser.$inject = ['$resource'];
    function Parser($resource) {
        return $resource('/api/parser/:id', {}, {
            query: { method: 'GET', params: { id: '' }, isArray: true },
        });
    }

    parseForm.$inject = ['Parser', 'dateservice', '$timeout'];
    function parseForm(Parser, dateservice, $timeout) {
        
        var directive = {
            restrict: 'E',
            replace: true,
            scope: {
                control: '=',
                onCompleat: '&?'
            },
            templateUrl: 'app/views/parse.html',
            link: function (scope, element, attrs) {
                scope.id = 'ParseMenu';
                scope.parseForm = {};
                scope.error = false;
                scope.message = '';
                scope.messageData = '';
                scope.sources = [];
                scope.source = {};
                scope.input = {start:'', count:'', update:false, next: true}
                scope.startDays = [];
                
                scope.internalControl = scope.control || {};
                scope.internalControl.show = show;
                scope.internalControl.hide = hide;
                

                scope.setSource = setSource;
                scope.setStart = setStart;
                scope.getParsers = getParsers;
                scope.doParse = doParse;
                

                activate();

                function activate() {
                    getParsers();
                    $(document).on('hide.bs.modal', '#' + scope.id, onHide);
                    scope.startDays.push({ name: "NextMonday", date: dateservice.getNextMonday()})
                    scope.startDays.push({ name: "Monday", date: dateservice.getMonday() })
                    scope.startDays.push({ name: "Today", date: new Date() });
                }

                function setStart(start) {
                    scope.input.start = start.date;
                }
                
                function getParsers() {
                    scope.message = 'Loading...';
                    scope.sources = []
                    Parser.query(function (data) {
                        scope.sources = data;
                        scope.source = scope.sources[0];
                        scope.message = '';
                    }, function () {
                        scope.error = true;
                        scope.message = 'GetError';
                    });
                }

                function show() {
                    $('#' + scope.id).modal('show');
                }

                function hide() {
                    $('#' + scope.id).modal('hide');
                }

                function onHide() {
                    scope.input = { start: '', count: '', update: false }
                    scope.source = scope.sources[0];
                    scope.message = '';
                    scope.error = false;
                }

                function setSource(source) {
                    scope.source = source;
                }

                function doParse() {
                    scope.message = 'Parse...';
                    var id = scope.source.id;
                    if (id) {
                        var config = {
                            id: id,
                            start: scope.input.start,
                            count: scope.input.count,
                            update: scope.input.update,
                            next: scope.input.next,
                        }
                        Parser.get(config, function (data) {
                            scope.messageData = data.message;
                            scope.message = 'ParseOk';
                            scope.error = false;
                            scope.onCompleat();
                            $timeout(hide, 2000);
                        }, function () {
                            scope.error = true;
                            scope.messageData = scope.source.name;
                            scope.message = 'ParseError';
                        });
                    }
                    
                }
            }
        };
        return directive;

    };

})();
