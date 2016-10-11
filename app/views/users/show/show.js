'use strict';

angular.module('myApp').controller('UserShowController', ['$rootScope', 'user_data', '$routeParams', 'UserService', 'ToastFlash', '$window', function($rootScope, user_data, $routeParams, UserService, ToastFlash, $window) {
	var user_show_vm_c = this;

	user_show_vm_c.this_user = function() {
		return $rootScope.user.id == $routeParams.id;
	}

	user_show_vm_c.the_user = user_data;

}]);