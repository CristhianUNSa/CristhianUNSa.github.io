'use strict';
$(function(){
 	$(".menu-add-video").addClass("active");
 }); 
angular.module('miApp.addVideo', ['ngRoute'])
 
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/AddVideos', {
        templateUrl: 'addVideo/addVideo.html',
        controller: 'AddVideoCtrl',
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
 
.controller('AddVideoCtrl', ['$scope','$firebaseArray','CommonProp','$location','currentAuth', function($scope,$firebaseArray,CommonProp,$location,currentAuth) {
	//$(".blog-nav-item").removeClass("active");
	CommonProp.setMostrarMenu(true);
	CommonProp.setMenuActual(4);
 	$(".menu-inicio").addClass("active");
	if(!CommonProp.getUser()){
		$location.path('/home');
	}
	$scope.AgregarVideo=function(){
		var titulo=$scope.video.titulo;
		var urlVideo=$scope.video.urlVideo;
		var email=CommonProp.getUser();
		var ref = new Firebase("https://tutsplusangular.firebaseio.com/Videos");
		var fb = $firebaseArray(ref);
		fb.$add({
			titulo:titulo,
			urlVideo:urlVideo,
			email:email,
			'.priority': email
		}).then(function(ref){
			console.log(ref);
			toastr.success('Se agregó el video');
			$location.path("/verVideos");
		},function(error){
			console.log(error);
			toastr.error('Ha ocurrido un error. Intente nuevamente');
		});
	};
	$scope.logout = function(){
	    CommonProp.logoutUser();
	};
}]);