'use strict';
  $(function(){
 	$(".menu-add-horario").addClass("active");
 });
angular.module('miApp.AddHorarios', ['ngRoute'])
 
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/AddHorarios', {
        templateUrl: 'addHorario/AddHorarios.html',
        controller: 'AddHorariosCtrl',
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
 
.controller('AddHorariosCtrl', ['$scope','$firebaseArray','CommonProp','$location','currentAuth', function($scope,$firebaseArray,CommonProp,$location,currentAuth) {
	//$(".blog-nav-item").removeClass("active");
	CommonProp.setMostrarMenu(true);
	CommonProp.setMenuActual(3);
 	$(".menu-inicio").addClass("active");
	var refProfesores=new Firebase("https://tutsplusangular.firebaseio.com/Profesores");
	var refMaterias=new Firebase("https://tutsplusangular.firebaseio.com/Materias");
	$scope.profesores=$firebaseArray(refProfesores);
	$scope.materias=$firebaseArray(refMaterias);
	if(!CommonProp.getUser()){
		$location.path('/home');
	}
	$scope.AgregarHorarios=function(){
		debugger;
		var dia=$scope.horario.dia;
		var horaDesde=$scope.horario.horaDesde;
		var horaHasta=$scope.horario.horaHasta;
		var idMateria=$scope.horario.idMateria;
		var idProfesor=$scope.horario.idProfesor;
		var materiaFirebase={};
		materiaFirebase[idMateria] = true;
		var profesorFirebase={};
		profesorFirebase[idProfesor] = true;
		var ref = new Firebase("https://tutsplusangular.firebaseio.com/Horarios");
		var fb = $firebaseArray(ref);
		fb.$add({
			dia:dia,
			horaDesde:horaDesde,
			horaHasta:horaHasta,
			materia:materiaFirebase,
			profesor:profesorFirebase
		}).then(function(ref){
			console.log(ref);
			toastr.success('Se agregó el horario');
			$location.path("/verHorarios");
		},function(error){
			console.log(error);
			toastr.error('Ha ocurrido un error. Intente nuevamente');
		});
	};
	$scope.logout = function(){
	    CommonProp.logoutUser();
	};
}]);