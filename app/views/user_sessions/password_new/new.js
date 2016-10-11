'use strict';

angular.module('myApp').controller('PasswordNewController', ['$auth', function($auth) {
  var password_new_vm_c = this;
  password_new_vm_c.password_new_form_submit = function() {
    $auth.requestPasswordReset(password_new_vm_c.pwdResetForm);
  };
}]);