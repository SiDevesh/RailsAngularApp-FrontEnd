'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'ngResource',
  'ngMaterial',
  'ng-token-auth',
  'ngFileUpload'
]);

angular.module('myApp').constant('api_base_url', 'http://192.168.0.101:3000');
/*var app = angular.module('myApp');*/

//var api_base_url = 'http://192.168.0.104:3000';

/*START---------CONFIG----------------------------------------*/

angular.module('myApp').config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/home', {
    templateUrl: "views/home/home.html",
    controller: 'HomeController',
    controllerAs: 'home_vm',
    allowed: "all",
    title: "Home"
  })
  .when('/settings', {
    templateUrl: 'views/settings/settings.html',
    controller: 'SettingsController',
    controllerAs: 'settings_vm',
    allowed: "logged_in",
    title: "Settings"
  })
  .when('/users/sign_up', {
    templateUrl: 'views/user_sessions/signup/signup.html',
    controller: 'SignupController',
    controllerAs: 'signup_vm',
    allowed: "not_logged_in",
    title: "Sign Up"
  })
  .when('/users/log_in', {
    templateUrl: 'views/user_sessions/login/login.html',
    controller: 'LoginController',
    controllerAs: 'login_vm',
    allowed: "not_logged_in",
    title: "Log In"
  })
  .when('/users/password/new', {
    templateUrl: 'views/user_sessions/password_new/new.html',
    controller: 'PasswordNewController',
    controllerAs: 'password_new_vm',
    allowed: "not_logged_in",
    title: "Forgot Password?"
  })
  .when('/users/password/edit', {
    templateUrl: 'views/user_sessions/password_edit/edit.html',
    controller: 'PasswordEditController',
    controllerAs: 'password_edit_vm',
    allowed: "logged_in",
    title: "New Password"
  })
  .when('/users/:id/edit', {
    templateUrl: 'views/user_sessions/edit/edit.html',
    controller: 'UserUpdateController',
    controllerAs: 'user_update_vm',
    allowed: "samxe_logged_in",
    title: "Edit Profile",
    resolve: {
      user_data: function(UserService, $route) {
        return UserService.get({id: $route.current.params.id}).$promise;
      }
    }
  })
  .when('/users', {
    templateUrl: 'views/users/index/index.html',
    controller: 'UserIndexController',
    controllerAs: 'user_index_vm',
    allowed: "logged_in",
    title: "Users"
  })
  .when('/users/:id', {
    templateUrl: 'views/users/show/show.html',
    controller: 'UserShowController',
    controllerAs: 'user_show_vm',
    allowed: "logged_in",
    title: "Profile",
    resolve: {
      user_data: function(UserService, $route) {
        return UserService.get({id: $route.current.params.id}).$promise;
      }
    }
  })
  .otherwise({redirectTo: '/home'});
}]);

angular.module('myApp').config(['$authProvider', 'api_base_url', function($authProvider, api_base_url) {
    $authProvider.configure({
        apiUrl: api_base_url+'/api/v1',
        authProviderPaths: {
          facebook: '/auth/facebook',
          google:   '/auth/google_oauth2'
        },
        confirmationSuccessUrl:  window.location.origin+'/#'+'/home',
        passwordResetSuccessUrl: window.location.origin+'/#'+'/users/password/edit'
    });
}]);

/*END-----------CONFIG----------------------------------------*/

/*START---------SERVICES--------------------------------------*/

angular.module('myApp').service('UserAuth', ['$rootScope', '$auth', function($rootScope, $auth) {
  this.current_user = function() {
    return $rootScope.user;
  }

  this.isAuthenticated = function() {
    return !(Object.keys($rootScope.user).length === 0);
  }

}]);

angular.module('myApp').factory('UserService', ['$resource', 'api_base_url', function ($resource, api_base_url) {
  return $resource(
    api_base_url+"/api/v1/users/:id",
    {id: '@id'},
    {
      get: {method: 'GET'},
      query: {method: 'GET'}
      //query: {method: 'GET', isArray: true}
    },
    {
      stripTrailingSlashes: true
    }
  );
}]);

angular.module('myApp').service('ToastFlash', ['$mdToast', function($mdToast) {
  this.showMessage = function(message, $event) {
    $mdToast.show(
      $mdToast
      .simple()
      .textContent(message)
      .action("Dismiss")
      .highlightAction(true)
      //.highlightClass('md-accent')
    );
  };
}]);

angular.module('myApp').service('ErrorResponse', function() {
  this.text = function(reason) {
    console.log(reason);
    if(reason) {
      if(reason.data) {
        return reason.data.errors[0] || reason.data.errors.full_messages[0];
      }
      else if(reason.error) {
        return reason.error;
      }
      else if(reason.errors) {
        if(reason.errors.full_messages) {
          return reason.errors.full_messages[0];
        }
        else {
          return reason.errors[0];
        }
      }
      else {
        return "Network Error.Are you connected?";
      }
    }
    else {
      return "Network Error.Are you connected?";
    }
  };
  this.no_net_text = function() {
    return "Network Error.Are you connected?";
  };
});

/*END-----------SERVICES--------------------------------------*/

angular.module('myApp').run(['$rootScope', '$window', '$route', '$auth', 'ToastFlash', 'ErrorResponse', function($rootScope, $window, $route, $auth, ToastFlash, ErrorResponse) {

  /*START-------LOGIN CHECKS--------------------------------*/
  $rootScope.$on('auth:login-success', function(e, user) {
    $window.location.href = '#/home';
    ToastFlash.showMessage('User logged in successfully.');
  });
  $rootScope.$on('auth:login-error', function(e, reason) {    /**/
    ToastFlash.showMessage(ErrorResponse.text(reason));
  });
  /*END---------LOGIN CHECKS--------------------------------*/

  /*START-------PASSWD RESET CONFRM CHECKS------------------*/
  $rootScope.$on('auth:password-reset-confirm-error', function(ev, reason) {
    ToastFlash.showMessage(ErrorResponse.text(reason));
  });
  $rootScope.$on('auth:password-reset-confirm-success', function() {    /**/
    ToastFlash.showMessage("Enter your new password.");
  });
  /*END---------PASSWD RESET CONFRM CHECKS------------------*/

  /*START-------NEW EMAIL CONFRM CHECKS---------------------*/
  $rootScope.$on('auth:email-confirmation-success', function(e, user) {    /*set by some other on evnt, no state change here needed*/
    ToastFlash.showMessage("Welcome, "+user.email+". Your account has been verified.");
  });
  $rootScope.$on('auth:email-confirmation-error', function(e, reason) {
    ToastFlash.showMessage(ErrorResponse.text(reason));
  });
  /*END---------NEW EMAIL CONFRM CHECKS---------------------*/

  /*START-------ACCNT DESTRY CHECKS-------------------------*/
  $rootScope.$on('auth:account-destroy-success', function(e) {
    $window.location.href = '#/home';
    ToastFlash.showMessage('User destroyed successfully.');
  });
  $rootScope.$on('auth:account-destroy-error', function(e, reason) {    /**/
    ToastFlash.showMessage(ErrorResponse.text(reason));
  });
  /*END---------ACCNT DESTRY CHECKS-------------------------*/

  /*START-------LOGOUT CHECKS-------------------------------*/
  $rootScope.$on('auth:logout-success', function(e) {
    $window.location.href = '#/home';
    ToastFlash.showMessage('User logged out successfully.');
  });
  $rootScope.$on('auth:logout-error', function(e, reason) {    /**/
    ToastFlash.showMessage(ErrorResponse.text(reason));
  });
  /*END---------LOGOUT CHECKS-------------------------------*/

  /*START-------ACCNT UPDATE CHECKS-------------------------*/
  $rootScope.$on('auth:account-update-success', function(e) {
    $window.location.href = '#/home';
    ToastFlash.showMessage('User updated successfully.');
  });
  $rootScope.$on('auth:account-update-error', function(e, reason) {
    ToastFlash.showMessage(ErrorResponse.text(reason));
  });
  /*END---------ACCNT UPDATE CHECKS-------------------------*/

  /*START-------PASSWD CHANGE CHECKS------------------------*/
  $rootScope.$on('auth:password-change-success', function(e) {
    $window.location.href = '#/user/log_in';
    ToastFlash.showMessage('User password updated successfully.');
  });
  $rootScope.$on('auth:password-change-error', function(e, reason) {
    ToastFlash.showMessage(ErrorResponse.text(reason));
  });
  /*END---------PASSWD CHANGE CHECKS------------------------*/

  /*START-------REG EMAIL SEND CHECKS-----------------------*/
  $rootScope.$on('auth:registration-email-success', function(e, message) {
    $window.location.href = '#/home';
    ToastFlash.showMessage("A registration email was sent to " + message.email);
  });
  $rootScope.$on('auth:registration-email-error', function(e, reason) {
    ToastFlash.showMessage(ErrorResponse.text(reason));
  });
  /*END---------REG EMAIL SEND CHECKS-----------------------*/

  /*START-------PASSWD RESET REQ CHECKS---------------------*/
  $rootScope.$on('auth:password-reset-request-success', function(e, data) {
    $window.location.href = '#/users/log_in';
    ToastFlash.showMessage("Password reset instructions were sent to " + data.email);
  });
  $rootScope.$on('auth:password-reset-request-error', function(e, reason) {
    ToastFlash.showMessage(ErrorResponse.text(reason));
  });
  /*END---------PASSWD RESET REQ CHECKS---------------------*/

  /*START-------VALIDN CHECKS-------------------------------*/
  $rootScope.$on('auth:validation-error', function(e, reason) {    /**/
    $window.location.href = '#/users/log_in';
    ToastFlash.showMessage(ErrorResponse.text(reason));
  });
  $rootScope.$on('auth:session-expired', function(e) {
    $window.location.href = '#/users/log_in';
    ToastFlash.showMessage("Session has expired. Please Login again.");
  });
  $rootScope.$on('auth:invalid', function(e) {
    $window.location.href = '#/users/log_in';
    ToastFlash.showMessage("Login failed due to invalid token.");
  });
  /*END---------VALIDN CHECKS-------------------------------*/

  /*START-------OTHER CHECKS--------------------------------*/
  $rootScope.$on('auth:oauth-registration', function(e, user) {    /*no state cahnges by this, just a reminder. resolved*/
    ToastFlash.showMessage('new user registered through oauth:' + user.email);
  });

  //$rootScope.$on('resource:network-error', function(e) {
  //  ToastFlash.showMessage('Network Error.Are you connected?');
  //});
  /*END---------OTHER CHECKS--------------------------------*/

  /*START-------ROUTE AUTH CHECKS---------------------------*/
  $rootScope.$on("$routeChangeStart", function(event, next, current){
    switch(next.allowed) {
      case "logged_in":
        if(current == undefined) {
          $auth.validateUser()
            .catch(function(resp) {
              event.preventDefault();
              $window.location.href = '#/users/log_in';
              ToastFlash.showMessage('You need to login first.');
            });
        }
        else {
          if(!$rootScope.user.id) {
            event.preventDefault();
            ToastFlash.showMessage('You need to login first.');
          }
        }
        break;
      case "not_logged_in":
        if(current == undefined) {
          $auth.validateUser()
            .then(function(resp) {
              event.preventDefault();
              $window.location.href = '#/users/'+resp.id;
              ToastFlash.showMessage('You are already logged in.');
            })
        }
        else {
          if($rootScope.user.id) {
            event.preventDefault();
            ToastFlash.showMessage('You are already logged in.');
          }
        }
        break;
      case "same_logged_in":
        if(current == undefined) {
          $auth.validateUser()
            .then(function(resp) {
              if(resp.id != next.params.id) {
                event.preventDefault();
                $window.location.href = '#/users/'+resp.id;
                ToastFlash.showMessage('Access Denied.');
              }
            })
            .catch(function(resp) {
              event.preventDefault();
              $window.location.href = '#/users/log_in';
              ToastFlash.showMessage('You need to login first.');
            });
        }
        else {
          if(!$rootScope.user.id) {
            event.preventDefault();
            ToastFlash.showMessage('You need to login first.');
          }
          else {
            if($rootScope.user.id != next.params.id) {
              event.preventDefault();
              ToastFlash.showMessage('Access Denied.');
            }
          }
        }
        break;
    }
  });
  /*END---------ROUTE AUTH CHECKS---------------------------*/

  /*START-------ROUTE FAIL CHECKS---------------------------*/
  $rootScope.$on("$routeChangeError", function(event, next, current, reject){
    //if needed here set ur back to old
    ToastFlash.showMessage(ErrorResponse.no_net_text());
  });
  /*END---------ROUTE FAIL CHECKS---------------------------*/

}]);


angular.module('myApp').controller('TitleBarController', ['$route','$rootScope', '$mdSidenav', '$routeParams', function($route, $rootScope, $mdSidenav, $routeParams) {

  var titlebar_vm_c = this;

  titlebar_vm_c.openLeftMenu = function() {
    $mdSidenav('left').open();
  };

  $rootScope.$on("$routeChangeSuccess", function(event, current, previous){
    if(current.$$route) {
      titlebar_vm_c.titlebar_name = current.$$route.title;
    }
  });

}]);