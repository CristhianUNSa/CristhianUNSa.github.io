'use strict';
 $(function(){
    $(".menu-inicio").addClass("active");
 });
angular.module('miApp.home', ['ngRoute','firebase'])
 
// Declared route 
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/home', {
        templateUrl: 'home/home.html',
        controller: 'HomeCtrl'
    });
}])
 
// Home controller
.controller('HomeCtrl', ['$scope','$location','CommonProp','$firebaseAuth',function($scope,$location,CommonProp,$firebaseAuth) {
  debugger;
  var login = {};
  $scope.login=login;
  CommonProp.setMostrarMenu(false);
	var firebaseObj = new Firebase("https://tutsplusangular.firebaseio.com"); 
 	var loginObj = $firebaseAuth(firebaseObj);
    loginObj.$onAuth(function(authData) {//Si ya se loggeo anteriormente
        if(authData){
            CommonProp.setUser(authData.password.email);
            $location.path('/verHorarios');
        }
     });
 	$scope.SignIn = function(event){
 		event.preventDefault();
        login.loading = true;
 		var username= $scope.user.email;
 		var password= $scope.user.password;
 		if (!username || !password){
            login.loading=false;
            return false;
        }
 		loginObj.$authWithPassword({
            email: username,
            password: password
        })
        .then(function(user) {
            // Success callback
            console.log('Authentication successful');
            CommonProp.setUser(user.password.email);//user.password se llama porque usamos el metodo del password de Firebase
            $location.path('/verHorarios');
            login.loading = false;
        }, function(error) {
            // Failure callback
            console.log('Authentication failure');
            toastr.error('Ha proporcionado datos incorrectos');
            login.loading = false;
        });
 	}
}])
.service('CommonProp',['$firebaseAuth','$location' ,function($firebaseAuth,$location) {//usado para mantener información de loggeo
    //Usuario
    var user = '';
    var firebaseObj = new Firebase("https://tutsplusangular.firebaseio.com/");
    var loginObj = $firebaseAuth(firebaseObj);
    var mostrarMenu = {estado:true};
    //Menu
    var menu=[
        {
          href:"#/verHorarios",
          titulo:"Inicio",
          path:0,
          active:false
        },
        {
          href:"#/addProfesor",
          titulo:"Nuevo Profesor",
          path:1,
          active:false
        },
        {
          href:"#/addMateria",
          titulo:"Nueva Materia",
          path:2,
          active:false
        },
        {
          href:"#/AddHorarios",
          titulo:"Agregar Horario",
          path:3,
          active:false
        },
        {
          href:"#/AddVideos",
          titulo:"Agregar video",
          path:4,
          active:false
        },
        {
          href:"#/verProfesores",
          titulo:"Ver Profes",
          path:5,
          active:false
        },
        {
          href:"#/verVideos",
          titulo:"Ver Videos",
          path:6,
          active:false
        },
        {
          href:"#/welcome",
          titulo:"Ver Materias",
          path:7,
          active:false
        }
    ];
    var itemActual=0;
    return {
        getUser: function() {
            if(user==''){
                user=localStorage.getItem("userEmail");
            }
            return user;
        },
        setUser: function(value) {
            localStorage.setItem("userEmail",value);
            user = value;
        },
        logoutUser:function(){
            loginObj.$unauth();
            user='';
            localStorage.removeItem("userEmail");
            toastr.warning('Se ha desloggeado con éxito');
            $location.path('/home');
        },
        getMenu:function(){
            return menu;
        },
        setMenuActual:function(path){
            for (var i = menu.length - 1; i >= 0; i--) {
                if (menu[i].path==path)
                    menu[i].active=true;
                else
                    menu[i].active=false;
            };
        },
        getMenuActual:function(){
            var path=0;
            for (var i = menu.length - 1; i >= 0; i--) {
                if(menu[i].active) path=i;
            };
            return path;
        },
        setMostrarMenu:function(estado){
            mostrarMenu.estado=estado;
            return estado;
        },
        getMostrarMenu:function(){
          return mostrarMenu.estado;
        }
    };
}])
.directive('laddaLoading', [
    function() {
        return {
            link: function(scope, element, attrs) {
                var Ladda = window.Ladda;
                var ladda = Ladda.create(element[0]);
                // Watching login.loading for change
                scope.$watch(attrs.laddaLoading, function(newVal, oldVal) {
                    // Based on the value start and stop the indicator
                    if (newVal) {
                        ladda.start();
                    } else {
                        ladda.stop();
                    }
                });
            }
        };
    }
]);