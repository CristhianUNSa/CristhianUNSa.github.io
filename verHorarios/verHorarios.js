'use strict';
 $(function(){
 	$(".menu-ver-horarios").addClass("active");
 });
angular.module('miApp.verHorarios', ['ngRoute'])
 
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/verHorarios', {
        templateUrl: 'verHorarios/verHorarios.html',
        controller: 'VerHorariosCtrl',
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
 
.controller('VerHorariosCtrl', ['$scope','CommonProp','$firebaseArray','$firebaseObject','$location','currentAuth', function($scope,CommonProp,$firebaseArray,$firebaseObject,$location,currentAuth) {
    CommonProp.setMenuActual(7);
	$scope.username = CommonProp.getUser();
	if(!$scope.username){
	    $location.path('/home');
	}
    $scope.horarios=[];
	var horarios=new Firebase("https://tutsplusangular.firebaseio.com/Horarios");
    horarios.on('child_added',function(objHorario){
        var materia=Object.keys(objHorario.val().materia)[0];
        var refMateria=new Firebase("https://tutsplusangular.firebaseio.com/Materias/"+materia);
        refMateria.on('value',function(materiaObj){
            materia=materiaObj.val();
            var profesor=Object.keys(objHorario.val().profesor)[0];
            var refProfesor=new Firebase("https://tutsplusangular.firebaseio.com/Profesores/"+profesor);
            refProfesor.on('value',function(profesorObj){
                profesor=profesorObj.val();
                var nombrecompleto = profesor.apellido + ' ' + profesor.nombre;
                $scope.horarios.push(
                    {
                        horaDesde:objHorario.val().horaDesde,
                        horaHasta:objHorario.val().horaHasta,
                        dia:objHorario.val().dia,
                        materia: materia.titulo,
                        profesor: nombrecompleto
                    }
                );
                $scope.$apply();
            },function(e){

            });
        },
        function(e){

        });
        
    });
	$scope.confirmarBorrado=function(id){
		var fb= new Firebase("https://tutsplusangular.firebaseio.com/Horarios/"+id);
		$scope.horarioABorrar=$firebaseObject(fb);
		$('#deleteModal').modal();
	};
	$scope.borrarHorario = function() {
        var fb = new Firebase("https://tutsplusangular.firebaseio.com/Horarios/" + $scope.horarioABorrar.$id);
        fb.remove(function(error) {
        	if(error){
        		console.log("Error:", error);
            	toastr.error('Hubo un problema en su solicitud');
        	}  else{
        		toastr.success('Se eliminó el horario con éxito');
            	$('#deleteModal').modal('hide');
        	}
        });
    };
    $scope.logout = function(){
	    CommonProp.logoutUser();
	};
}]);