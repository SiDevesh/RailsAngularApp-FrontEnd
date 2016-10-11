'use strict';

angular.module('myApp').controller('LoginController', ['$auth', function($auth) {
  var login_vm_c = this;
  login_vm_c.login_form_submit = function() {
    $auth.submitLogin(login_vm_c.loginForm);
  };
}]);