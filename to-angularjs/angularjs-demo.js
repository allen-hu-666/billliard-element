var app = angular.module('myApp', [ "billiard-element" ]);

app.controller('myCtrl', function($scope) {
    $scope.config = {
        moveAreaMarginLeft: 50,
        moveAreaMarginRight: 50,
        moveAreaMarginTop: 50,
        moveAreaMarginBottom: 50,
        billiardElCreated: function(billiardEl) {
            console.log(billiardEl);
        }
    };
    $scope.billiardElCreated = function(billiardEl) {
        console.log(billiardEl);
    }
});