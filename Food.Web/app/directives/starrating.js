(function () {
    'use strict';
    angular
        .module('app')
        .directive('starRating', starRating);

    
    function starRating() {
    return {
      restrict: 'EA',
      template:
        '<ul class="star-rating" ng-class="{readonly: readonly}">' +
        '  <li ng-repeat="star in stars" class="star" ng-class="{filled: star.filled, average:star.average}" ng-click="toggle($index)">' +
        '    <i class="fa fa-star"></i>' + 
        '  </li>' +
        '</ul>',
      scope: {
        ratingValue: '=ngModel',
        avgRating: '=?',
        max: '=?', // optional (default is 5)
        onRatingSelect: '&?',
        readonly: '=?'
      },
      link: function(scope, element, attributes) {
        scope.onClick = false;
        if (scope.max == undefined) {
          scope.max = 5;
        }

        if (scope.avgRating == undefined) {
            scope.avgRating = 0;
        }

        updateStars();
        
        function updateStars() {
          scope.stars = [];
          for (var i = 0; i < scope.max; i++) {
              if (scope.ratingValue == undefined) {
                  scope.stars.push({
                      average: i < scope.avgRating,
                  });
              } else {
                  if (scope.avgRating > scope.ratingValue)
                  {
                      scope.stars.push({
                          average: i < scope.avgRating != i < scope.ratingValue,
                          filled: i < scope.ratingValue && i < scope.avgRating,
                      });
                  } else {
                      scope.stars.push({
                          average: i < scope.avgRating && i < scope.ratingValue,
                          filled: i < scope.ratingValue != i < scope.avgRating,
                      });
                  }
                  
              }
          }
        };
        scope.toggle = function(index) {
          if (scope.readonly == undefined || scope.readonly === false){
              scope.ratingValue = index + 1;
              scope.onClick = true;
          }
        };
        scope.$watch('ratingValue', function(newValue, oldValue) {
          if (newValue != oldValue) {
            updateStars();
          }
          if (scope.onClick) {
              scope.onClick = false;
              scope.onRatingSelect();
          }
        });
      }
    };
  }


})();
