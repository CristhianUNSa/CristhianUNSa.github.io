'use strict';
 $(function(){
 	$(".menu-ver-horarios").addClass("active");
 });
angular.module('miApp.verHorarios', ['ngRoute'])
 
.config(['$routeProvider', function($routeProvider) {
    $routeProvider
    .when('/verHorarios', {
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
    CommonProp.setMostrarMenu(true);
    CommonProp.setMenuActual(0);
	if(!CommonProp.getUser()){
	    $location.path('/home');
	}
    $scope.username = CommonProp.getNombreCompleto()==" " ? CommonProp.getUser() : CommonProp.getNombreCompleto();
    $scope.tienePerfil = CommonProp.getNombreCompleto()==" " ? false : true;
    $scope.arrayLunes=[];
    $scope.arrayMartes=[];
    $scope.arrayMiercoles=[];
    $scope.arrayJueves=[];
    $scope.arrayViernes=[];
	var horarios=new Firebase("https://tutsplusangular.firebaseio.com/Horarios");
    horarios.on('child_added',function(objHorario){
        var materia=Object.keys(objHorario.val().materia)[0];
        var refMateria=new Firebase("https://tutsplusangular.firebaseio.com/Materias/"+materia);
        refMateria.on('value',function(materiaObj){
                materia=materiaObj.val();
                var profesor=Object.keys(objHorario.val().profesor)[0];
                var refProfesor=new Firebase("https://tutsplusangular.firebaseio.com/Profesores/"+profesor);
                refProfesor.on('value',function(profesorObj){
                    $scope.$evalAsync(function(){
                        profesor=profesorObj.val();
                        var nombrecompleto = profesor.apellido + ' ' + profesor.nombre;
                        debugger;
                        var oHorario={
                                horaDesde:objHorario.val().horaDesde,
                                horaHasta:objHorario.val().horaHasta,
                                dia:objHorario.val().dia,
                                materia: materia.titulo,
                                profesor: nombrecompleto,
                                id:objHorario.$id
                            };
                        switch (oHorario.dia){
                            case "Lunes":
                                $scope.arrayLunes.push(oHorario);
                                break;
                            case "Martes":
                                $scope.arrayMartes.push(oHorario);
                                break;
                            case "Miercoles":
                                $scope.arrayMiercoles.push(oHorario);
                                break;
                            case "Jueves":
                                $scope.arrayJueves.push(oHorario);
                                break;
                            case "Viernes":
                                $scope.arrayViernes.push(oHorario);
                                break;
                        }})
                
                //$scope.$apply();
            },function(e){

            });
        },
        function(e){

        });
        
    });
	$scope.confirmarBorrado=function(id,evento){
        evento.stopPropagation();
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
}])
.directive('horarios',function(){
    return {
        restrict: 'EA',
        scope: { 
            horario: '=' ,
            borrarHorario: '&'
        },
        templateUrl: 'verHorarios/templateHorario.html',
        link: function($scope,element,attrs){
            $scope.anotarHorario=function(horarioId){
                debugger;
                console.log(horarioId);
            };
        }
    };
});