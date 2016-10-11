'use strict';

angular.module('myApp').controller('UserIndexController', ['$rootScope', 'UserService', 'ToastFlash', 'ErrorResponse', function($rootScope, UserService, ToastFlash, ErrorResponse) {
	var user_index_vm_c = this;
	user_index_vm_c.last_loaded_page = 0;
	user_index_vm_c.users = [];
    user_index_vm_c.no_more = false;

	user_index_vm_c.get_next_page = function() {
		UserService.query({page: (user_index_vm_c.last_loaded_page+1)})
		.$promise.then(
			function( users ){
				//user_index_vm_c.users = users;
				for(var k=0;k<users.data.length;k++) {
					user_index_vm_c.users.push(users.data[k]);
				}
				user_index_vm_c.last_loaded_page++;
				if(users.last == true) {
					user_index_vm_c.no_more = true;
				}
			},
			function( reason ){
				ToastFlash.showMessage(ErrorResponse.text(reason));
				//ToastFlash.showMessage(reason.data ? reason.data.errors[0] || reason.data.errors.full_messages[0] : "Network Error.Are you connected?");
			}
    	);
	};

	user_index_vm_c.get_next_page();

}]);