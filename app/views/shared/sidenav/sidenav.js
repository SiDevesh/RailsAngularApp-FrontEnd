'use strict';

angular.module('myApp').controller('SidenavController', ['api_base_url', '$auth', '$rootScope', '$mdSidenav', '$window', function(api_base_url, $auth, $rootScope, $mdSidenav, $window) {

  var sidenav_vm_c = this;

  sidenav_vm_c.logout_button_click = function() {
    $auth.signOut();
  };

  sidenav_vm_c.UserInfoName = function() {
    return $rootScope.user.id ? $rootScope.user.name : "Not logged In";
  };

  sidenav_vm_c.UserInfoEmail = function() {
    return $rootScope.user.id ? $rootScope.user.email : "";
  };

  sidenav_vm_c.UserInfoProfic = function() {
    return $rootScope.user.id ? $rootScope.user.image.url : api_base_url+"/fallback/nouser.png";
  };

  sidenav_vm_c.destroy_button_click = function() {
    $auth.destroyAccount();
  };

  sidenav_vm_c.gotoHome = function() {
    $window.location.href = '#/home';
    $mdSidenav('left').close();
  };

  sidenav_vm_c.gotoSettings = function() {
    $window.location.href = '#/settings';
    $mdSidenav('left').close();
  };

  sidenav_vm_c.gotoLogIn = function() {
    $window.location.href = '#/users/log_in';
    $mdSidenav('left').close();
  };

  sidenav_vm_c.gotoSignUp = function() {
    $window.location.href = '#/users/sign_up';
    $mdSidenav('left').close();
  };

  sidenav_vm_c.gotoUserInfoOrLogin = function() {
    if($rootScope.user.id) {
      $window.location.href = '#/users/'+$rootScope.user.id;
      $mdSidenav('left').close();
    }
    else {
      $window.location.href = '#/users/log_in';
      $mdSidenav('left').close();
    }
  };

}]);