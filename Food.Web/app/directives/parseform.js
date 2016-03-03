(function () {
    'use strict';
    angular
        .module('app')
        .directive('parseForm', parseForm);

    
    function parseForm() {
        
        var directive = {
            restrict: 'E',
            replace: true,
            scope: {
                control: '='
            },
            templateUrl: 'app/views/parse.html',
            link: function (scope, element, attrs) {
                scope.id = 'ParseMenu';
                scope.parseForm = {}
                scope.sources = {},
                scope.source = {},
                scope.internalControl = scope.control || {};
                scope.internalControl.show = show;
                scope.internalControl.hide = hide;
                scope.setSource = setSource;
                scope.doParse = doParse;


                activate();

                function activate() {
                    scope.sources = [
                    {
                        id:0,
                        icon:'http://chudo-pechka.by/assets/templates/Chudopechka/images/logo.png',
                        name:'Cudo Pechka HTML'
                    },
                    {
                        id:1,
                        icon:'http://chudo-pechka.by/assets/templates/Chudopechka/images/logo.png',
                        name:'Cudo Pechka DOC'
                    },
                    {
                        id:2,
                        icon:"https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/McDonald's_Golden_Arches.svg/200px-McDonald's_Golden_Arches.svg.png",
                        name:'McDonalds'
                    },
                    ]
                    scope.source = scope.sources[0];
                }


                function show() {
                    $('#' + scope.id).modal('show');
                }

                function hide() {
                    $('#' + scope.id).modal('hide');
                }
                function setSource(source) {
                    scope.source = source;
                }
                function doParse() {

                }
            }
        };
        return directive;

    };

})();
