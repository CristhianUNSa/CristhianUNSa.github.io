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
.controller('HomeCtrl', ['$scope','$location','CommonProp','$firebaseAuth','$firebaseObject',function($scope,$location,CommonProp,$firebaseAuth,$firebaseObject) {
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
    debugger;
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
            CommonProp.setUser(user.password.email);//user.password se llama porque usamos el metodo del password de Firebase
            CommonProp.setUserId(user.uid); //el id del usuario
            var ref=new Firebase("https://tutsplusangular.firebaseio.com/Perfiles/"+user.uid);
            var perfil=$firebaseObject(ref);
            perfil.$loaded()
              .then(function(objPerfil){
                  console.log("Entro a escribir nombre y apellido");
                  var nombre=objPerfil.nombre;
                  var apellido=objPerfil.apellido;
                  CommonProp.setNombreApellido(nombre,apellido);
                  $location.path('/verHorarios');
                  login.loading = false;
              })
              .catch(function(error){
                console.log("Entro a un error: "+error);
                $location.path('/verHorarios');
                login.loading = false;
              });
            
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
    var userId='';
    var nombre= '';
    var apellido = '';
    var firebaseObj = new Firebase("https://tutsplusangular.firebaseio.com/");
    var loginObj = $firebaseAuth(firebaseObj);

    //Menu
    var mostrarMenu = {estado:true};
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
        },
        {
          href:"#/verPerfil",
          titulo:"Mi perfil",
          path:8,
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
        getUserId: function() {
            if(userId==''){
                userId=localStorage.getItem("userId");
            }
            return userId;
        },
        setUserId: function(value) {
            localStorage.setItem("userId",value);
            userId = value;
        },
        logoutUser:function(){
            loginObj.$unauth();
            user='';
            nombre='';
            apellido='';
            localStorage.removeItem("userEmail");
            localStorage.removeItem("nombre");
            localStorage.removeItem("apellido");
            toastr.warning('Se ha desloggeado con éxito');
            $location.path('/home');
        },
        setNombreApellido:function(nombre,apellido){
            this.nombre=nombre;
            this.apellido=apellido;
            localStorage.setItem("nombre",nombre);
            localStorage.setItem("apellido",apellido);
        },
        getNombreCompleto:function(){
            if(this.nombre ==''){
                nombre=localStorage.getItem("nombre")
            }
            if(this.apellido ==''){
                apellido=localStorage.getItem("apellido")
            }
            if(nombre==null) nombre = '';
            if(apellido==null) apellido = '';
            return nombre + ' ' + apellido;
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