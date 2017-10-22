var BilliardElement = require('../');
var plugModule = angular.module('billiard-element', []);

plugModule.directive('billiardElement', [ function() {
	return {
		restrict: 'A',
		scope:{
            billiardElement: "="
        },
		multiElement: true,
		link: function(scope, elem, attrs) {
            var billiardEl = new BilliardElement(elem[0]);
            var config = scope.billiardElement || {};
            billiardEl.setConfig(config);
            if(typeof config.billiardElCreated === "function"){
                config.billiardElCreated(billiardEl);
            }
		}
	};
}]);
