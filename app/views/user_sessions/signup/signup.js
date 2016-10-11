'use strict';

angular.module('myApp').controller('SignupController', ['$auth', function($auth) {
  var signup_vm_c = this;
  signup_vm_c.signup_form_submit = function() {
    $auth.submitRegistration(signup_vm_c.registrationForm);
  };
  
  signup_vm_c.omniauthFacebook = function() {
    $auth.authenticate('facebook');
  };

  signup_vm_c.omniauthGoogle = function() {
    $auth.authenticate('google');
  };  

}]);