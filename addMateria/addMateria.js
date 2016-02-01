'use strict';
 $(function(){
 	$(".menu-add-materia").addClass("active");
 });
angular.module('miApp.addMateria', ['ngRoute'])
 
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/addMateria', {
        templateUrl: 'addMateria/addMateria.html',
        controller: 'AddMateriaCtrl',
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
 
.controller('AddMateriaCtrl', ['$scope','$firebaseArray','CommonProp','$location','currentAuth', function($scope,$firebaseArray,CommonProp,$location,currentAuth) {
	//$(".blog-nav-item").removeClass("active");
	CommonProp.setMostrarMenu(true);
	CommonProp.setMenuActual(2);
 	$(".menu-inicio").addClass("active");
	if(!CommonProp.getUser()){
		$location.path('/home');
	}
	$scope.AgregarMateria=function(){
		var titulo=$scope.materia.titulo;
		var descripcion=$scope.materia.descripcion;
		var email=CommonProp.getUser();
		var ref = new Firebase("https://tutsplusangular.firebaseio.com/Materias");
		var fb = $firebaseArray(ref);
		fb.$add({
			titulo:titulo,
			descripcion:descripcion,
			email:email,
			'.priority': email
		}).then(function(ref){
			console.log(ref);
			toastr.success('Se agregó la materia');
			$location.path("/welcome");
		},function(error){
			console.log(error);
			toastr.error('Ha ocurrido un error. Intente nuevamente');
		});
	};
	$scope.logout = function(){
	    CommonProp.logoutUser();
	};
}]);