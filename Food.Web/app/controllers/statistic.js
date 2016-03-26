(function () {
    'use strict';
    angular
        .module('app.statistic')
        .controller('ViewStatistic', ViewStatistic)

    ViewStatistic.$inject = ['Statistic'];

    function ViewStatistic(Statistic) {
        var vm = this;
        vm.title = "Statistic";
        vm.data = {};
        
        activate();

        function activate() {
            Statistic.query(function (data) {
                vm.data = data;
            },
            function (data) {
                vm.title = "Error"
            });
        }
    };

})();
