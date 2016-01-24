'use strict';
 $(function(){
 	$(".menu-ver-videos").addClass("active");
 });
angular.module('miApp.verVideos', ['ngRoute'])
 
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/verVideos', {
        templateUrl: 'verVideos/verVideos.html',
        controller: 'VerVideosCtrl',
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
 
.controller('VerVideosCtrl', ['$scope','CommonProp','$firebaseArray','$firebaseObject','$location','currentAuth', function($scope,CommonProp,$firebaseArray,$firebaseObject,$location,currentAuth) {
    //$(".blog-nav-item").removeClass("active");
    CommonProp.setMenuActual(6);
    $(".menu-inicio").addClass("active");
	$scope.username = CommonProp.getUser();
	if(!$scope.username){
	    $location.path('/home');
	}
	var firebaseObj=new Firebase("https://tutsplusangular.firebaseio.com/Videos");
	$scope.videos=$firebaseArray(firebaseObj);

	$scope.confirmarBorrado=function(id){
		var fb= new Firebase("https://tutsplusangular.firebaseio.com/Videos/"+id);
		$scope.videoABorrar=$firebaseObject(fb);
		$('#deleteModal').modal();
	};
	$scope.borrarVideo = function() {
        var fb = new Firebase("https://tutsplusangular.firebaseio.com/Videos/" + $scope.videoABorrar.$id);
        fb.remove(function(error) {
        	if(error){
        		console.log("Error:", error);
            	toastr.error('Hubo un problema en su solicitud');
        	}  else{
        		toastr.success('Se eliminó el video con éxito');
            	$('#deleteModal').modal('hide');
        	}
        });
    };
    $scope.logout = function(){
	    CommonProp.logoutUser();
	};
}]);