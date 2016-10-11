'use strict';

angular.module('myApp').controller('UserUpdateController', ['$rootScope', '$auth', '$routeParams', 'UserService', 'ToastFlash', 'Upload', 'api_base_url', '$window', 'user_data', function($rootScope, $auth, $routeParams, UserService, ToastFlash, Upload, api_base_url, $window, user_data) {
  var user_update_vm_c = this;

  user_update_vm_c.updateAccountForm = {};
  user_update_vm_c.updateAccountForm.name = user_data.name;
  user_update_vm_c.updateAccountForm.email = user_data.email;
  user_update_vm_c.profic_image = user_data.image.url;

  user_update_vm_c.user_update_form_submit = function() {
    $auth.updateAccount(user_update_vm_c.updateAccountForm);
  };

  user_update_vm_c.profic_update_form_submit = function() {
    user_update_vm_c.proficUpload(user_update_vm_c.proficUpdateForm.profic);
  };

  user_update_vm_c.proficUpload = function (file) {
    Upload.upload({
        url: api_base_url+'/api/v1/users/'+$routeParams.id+'/edit/profic_update',
        headers: $auth.retrieveData('auth_headers'),
        data: {user: {image: file}}
    }).then(function (resp) {
        $rootScope.user.image.url = resp.data.image.url;
        ToastFlash.showMessage("Photo updated successfully.");
    }, function (resp) {
        ToastFlash.showMessage("Photo update failed.");
    });
  };


}]);