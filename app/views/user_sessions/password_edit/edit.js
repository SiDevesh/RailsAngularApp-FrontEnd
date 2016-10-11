'use strict';

angular.module('myApp').controller('PasswordEditController', ['$auth', function($auth) {
  var password_edit_vm_c = this;
  password_edit_vm_c.password_edit_form_submit = function() {
    $auth.updatePassword(password_edit_vm_c.updatePasswordForm);
  };
}]);