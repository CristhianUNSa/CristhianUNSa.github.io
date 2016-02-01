'use strict';
angular.module('miApp.verPerfil', ['ngRoute'])
 
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/verPerfil',{
        templateUrl: 'verPerfil/verPerfil.html',
        controller: 'VerPerfilCtrl',
        resolve: {
            // controller will not be loaded until $waitForAuth resolves
            // Auth refers to our $firebaseAuth wrapper in the example above
            "currentAuth": ["Auth", function(Auth) {
              // $waitForAuth returns a promise so the resolve waits for it to complete
              return Auth.$waitForAuth();
            }]
        }
    })
}])
 
.controller('VerPerfilCtrl', ['$scope','CommonProp','Perfil','$firebaseObject','$location','currentAuth', function($scope,CommonProp,Perfil,$firebaseObject,$location,currentAuth) {
    CommonProp.setMostrarMenu(true);
    CommonProp.setMenuActual(8);
    var userId = CommonProp.getUserId();
    if (userId!=''){
        //var ref = new Firebase("http://tutsplusangular.firebaseio.com/Perfiles/"+userId);
        var usuario=Perfil(userId);
        $scope.usuario=usuario;
    }
    else{
        $location.path('/home');
    }

    $scope.GuardarPerfil= function(){
        $scope.usuario.$save()
            .then(function(){
                toastr.success("Perfil guardado con éxito! ");

                $location.path('/verHorarios');
            })
            .catch(function(error){
                toastr.error("El perfil no se pudo guardar.Intente Salir, entrar y corregir sus datos en Mi Perfil");
                console.log(error);
            });
    }

}])
.factory("Perfil", ["$firebaseObject",
  function($firebaseObject) {
    return function(userId) {
      var ref = new Firebase("http://tutsplusangular.firebaseio.com/Perfiles/"+userId);
      return $firebaseObject(ref);
    }
  }
]);








    