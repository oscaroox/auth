var app = angular.module('myApp', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state("home", {
    url: "/home",
    templateUrl: "partials/index.html",
    authenticate: false
  })
  .state("login", {
    url: "/login",
    templateUrl: "partials/login.html",
    controller: function($scope, $http, AuthService) {
      AuthService.isAuthenticated()
                .then(function(){
                  $scope.auth = true;
          });

      $scope.main = { username:'', password:''};
      $scope.login = function() {
        $scope.main.username = this.username;
        $scope.main.password = this.password;
        $http.post('login.php', $scope.main)
        .success(function(res) {
          console.log(res);
        });
      }
      $scope.logout = function() {
        $http.get('logout.php')
      }
    },
    authenticate: false
  })
  .state("secret", {
    url: "/secret",
    templateUrl: "partials/restrict.html",
    authenticate: true
  });

  $urlRouterProvider.otherwise("/home");

});

app.run(function($rootScope, $state, AuthService) {
  $rootScope.$on("$stateChangeStart",
  function(event, toState, toParams, fromState, fromParams){
      if(toState.authenticate) {
        AuthService.isAuthenticated().then(function(res) {
          console.log(res);
          $state.transitionTo("secret");
        }, function(err){
          $state.transitionTo("login");
          event.preventDefault();
        })
      }
  })
});

app.factory('AuthService', function($http,$q) {
  return {
    isAuthenticated: function() {
      var deferred = $q.defer();
      $http.get('auth.php')
      .success(function(res) {

        if(res.authenticated) {
          deferred.resolve(true)
        }else{
          deferred.reject('logged out');
        }
      });
      return deferred.promise;
    },
    check: function() {

      this.isAuthenticated().then(function(res) {
        console.log('authenticated')
          return true;
      }, function(){
        console.log('error')
        return false;
      });
    }
  }
});
