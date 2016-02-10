'use strict';
angular.module('miApp.verMisHorarios', ['ngRoute'])
 
.config(['$routeProvider', function($routeProvider) {
    $routeProvider
    .when('/verMisHorarios', {
        templateUrl: 'verMisHorarios/verMisHorarios.html',
        controller: 'VerMisHorariosCtrl',
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
 
.controller('VerMisHorariosCtrl', ['$scope','CommonProp','$firebaseArray','$firebaseObject','$location','currentAuth', function($scope,CommonProp,$firebaseArray,$firebaseObject,$location,currentAuth) {
    CommonProp.setMostrarMenu(true);
    CommonProp.setMenuActual(9);
	if(!CommonProp.getUser()){
	    $location.path('/home');
	}
    var nombreCompleto=CommonProp.getNombreCompleto();
    if (nombreCompleto==" " || nombreCompleto == "undefined undefined"){
        $scope.tienePerfil = false;
        $scope.username = CommonProp.getUser();
    }
    else{
        $scope.tienePerfil = true;
        $scope.username = nombreCompleto;
    }
    $scope.arrayLunes=[];
    $scope.arrayMartes=[];
    $scope.arrayMiercoles=[];
    $scope.arrayJueves=[];
    $scope.arrayViernes=[];
	var horarios=new Firebase("https://tutsplusangular.firebaseio.com/Perfiles/"+CommonProp.getUserId()+"/Horarios");
    horarios.on('child_added',function(objHorario1){
        debugger;
        var horario=objHorario1.key();
        var traerHorario=new Firebase("https://tutsplusangular.firebaseio.com/Horarios/"+horario);
        traerHorario.once('value',function(objHorario){
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
                            var oHorario={
                                    horaDesde:objHorario.val().horaDesde,
                                    horaHasta:objHorario.val().horaHasta,
                                    dia:objHorario.val().dia,
                                    materia: materia.titulo,
                                    profesor: nombrecompleto,
                                    id:objHorario.key()
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
        
        
    });
}])
.directive('miHorario',function(){
    return {
        restrict: 'EA',
        scope: { 
            horario: '=' ,
        },
        templateUrl: 'verMisHorarios/templateMisHorarios.html'
    };
});