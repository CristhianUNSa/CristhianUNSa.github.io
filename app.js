'use strict';
 
angular.module('miApp', [
  'ngRoute',
  'miApp.home',
  'miApp.register',
  'miApp.welcome',
  'miApp.addMateria',
  'miApp.addProfesor',
  'miApp.verProfesores',
  'miApp.AddHorarios',
  'miApp.addVideo',
  'miApp.verVideos',
  'miApp.verHorarios'
])
.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    var ref = new Firebase("https://tutsplusangular.firebaseio.com");
    return $firebaseAuth(ref);
  }
])
.config(['$routeProvider', function($routeProvider) {
     $routeProvider.otherwise({
     	redirectTo: '/home'
     });
}])
.directive('miYoutube', function($sce) {
  return {
    restrict: 'EA',
    scope: { code:'=' },
    replace: true,
    template: '<div style="height:400px;"><iframe style="overflow:hidden;height:100%;width:100%" width="100%" height="100%" src="{{url}}" frameborder="0" allowfullscreen></iframe></div>',
    link: function (scope) {
        scope.$watch('code', function (newVal) {
           if (newVal) {
               scope.url = $sce.trustAsResourceUrl("https://www.youtube.com/embed/" + newVal);
           }
        });
    }
  };
})
.controller('PrincipalCtrl', ['$scope','CommonProp', function($scope,CommonProp){
  CommonProp.setMenuActual(0);
  $scope.actual=CommonProp.getMenuActual();
  $scope.menu=CommonProp.getMenu();
}])
;