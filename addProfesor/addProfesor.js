'use strict';
 $(function(){
 	$(".menu-add-profesor").addClass("active");
 });
angular.module('miApp.addProfesor', ['ngRoute'])
 
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/addProfesor', {
        templateUrl: 'addProfesor/addProfesor.html',
        controller: 'AddProfesorCtrl',
        resolve: {
            // controller will not be loaded until $waitForAuth resolves
            // Auth refers to our $firebaseAuth wrapper in the example above
            "currentAuth": ["Auth", function(Auth) {
              // $waitForAuth returns a promise so the resolve waits for it to complete
              return Auth.$waitForAuth();
            }]
        }
    });
}])
 
.controller('AddProfesorCtrl', ['$scope','$firebaseArray','CommonProp','$location','currentAuth', function($scope,$firebaseArray,CommonProp,$location,currentAuth) {
	//$(".blog-nav-item").removeClass("active");
	CommonProp.setMenuActual(1);
 	$(".menu-inicio").addClass("active");
	if(!CommonProp.getUser()){
		$location.path('/home');
	}
	$scope.AgregarProfesor=function(){
		var nombre=$scope.profesor.nombre;
		var apellido=$scope.profesor.apellido;
		var email=CommonProp.getUser();
		var ref = new Firebase("https://tutsplusangular.firebaseio.com/Profesores");
		var fb = $firebaseArray(ref);
		fb.$add({
			nombre:nombre,
			apellido:apellido,
			email:email,
			'.priority': email
		}).then(function(ref){
			console.log(ref);
			toastr.success('Se agregó el profesor');
			$location.path("/verProfesores");
		},function(error){
			console.log(error);
			toastr.error('Ha ocurrido un error. Intente nuevamente');
		});
	};
	$scope.logout = function(){
	    CommonProp.logoutUser();
	};
}]);