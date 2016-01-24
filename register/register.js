'use strict';
 
angular.module('miApp.register', ['ngRoute','firebase'])
 
// Declared route 
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/register', {
        templateUrl: 'register/register.html',
        controller: 'RegisterCtrl'
    });
}])
 
// Register controller
.controller('RegisterCtrl', ['$scope','$location','$firebaseAuth',function($scope,$location,$firebaseAuth) {
    var login={};
    $scope.login=login;
	var firebaseObj = new Firebase("https://tutsplusangular.firebaseio.com"); 
 	var auth = $firebaseAuth(firebaseObj);
 	$scope.signUp = function() {
    login.loading = true;
    if (!$scope.regForm.$invalid) {
        var email = $scope.user.email;
        var password = $scope.user.password;
        if (email && password) {
            auth.$createUser({
                email:email,
                password: password
            })
                .then(function() {
                    $location.path('/home');
                    login.loading  = false;
                    toastr.success('Usuario agregado !');
                }).catch( function(error) {
                    // do things if failure
                    console.log(error);
                    $scope.regError=true;
                    $scope.regErrorMessage="Ha ocurrido un error. Por favor verifique los datos ingresados e intente nuevamente";
                    login.loading  = false;
                });
        }
    }
};
}]);