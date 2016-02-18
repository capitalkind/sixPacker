var control = angular.module('appControllers', ['ngRoute']);

control.config(['$routeProvider', function( $routeProvider ){

  $routeProvider.when('/details',{
    templateUrl: '/views/partials/pack-details.html',
    controller: 'detailsController'
  })
  .otherwise({
    redirectTo: '/'
  });


}]);

control.controller('appController', ['$scope', '$rootScope', '$http', '$location', '$cookies', 'usersApi', 'packsApi', function($scope, $rootScope, $http, $location, $cookies, usersApi, packsApi){

  $scope.isActive = function(viewLocation) {
    return viewLocation === $location.path();
  };

  $scope.packs = [];

  $scope.users = [];

  $scope.user = {
    username: null,
    password: null,
    token: null
  }


   $scope.createUser = function(user){
    usersApi.createUser(user).then(function(response){
      $scope.logInUser(user.username, user.password);
    });
  }


   $scope.logInUser = function(username, password ){
    usersApi.authenticate(username, password).then(function(response){
      if(response.data.token){
        $scope.cookieTime(response);
        $scope.getUser(response);
        $rootScope.mapTime();
      } else {
        $scope.username = ''; $scope.password = '';
      }
    });
  }


  $scope.cookieTime = function(response){
    $cookies.put('user', response.config.data.username);
    $cookies.put('token', response.data.token);
  }


  $scope.getUser = function(response){
    $rootScope.currentUser = response.config.data.username;
    $scope.loggedIn = true;
    $scope.loggedOut = false;
    $scope.username = '';
    $scope.password = '';
  }


  $scope.logOutUser = function(){
    $cookies.remove('token');
    $cookies.remove('user');
    $rootScope.currentUser = '';
    $scope.loggedIn = false;
    $scope.loggedOut = true;
    $location.path('#/')
  }


  $scope.tokenTime = function(){
    var token = $cookies.get('token');
    if(token){
      $scope.loggedIn = true;
      if($cookies.get('user')){
        $rootScope.currentUser = $cookies.get('user')
      }
    } else {
      $scope.loggedIn = false;
    }
  }


  var cheersBud = function () {
   $scope.tokenTime();
  };

  cheersBud();

}]);



control.controller('mapController', ['$scope', '$rootScope', '$cookies', '$location', 'packsApi', function($scope, $rootScope, $cookies, $location, packsApi){

  $scope.isActive = function(viewLocation) {
    return viewLocation === $location.path();
  };

  $scope.packs = [];

    var theMap = {};

    var selectedInfoWindow;

    theMap.initMap = function(){

      var scope = this;

      this.map;
      this.currentLatLng;
      this.mapEl;
      this.zoom;

      this.mapEl = document.querySelector('#map');
      this.zoom = 16;
      navigator.geolocation.getCurrentPosition(function(position) {
        scope.init(position.coords)
      })

      this.init = function(position){

        var styleArray = [
           {
            featureType: "poi.business",
            elementType: "labels",
            stylers: [
              { visibility: "off" }
            ]
          }
        ];

        scope.currentLatLng = new google.maps.LatLng(position.latitude, position.longitude);
        scope.map = new google.maps.Map(scope.mapEl, {
          center: scope.currentLatLng,
          zoom: scope.zoom,
          mapTypeControl: false,
          streetViewControl: false,
          styles: styleArray,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        google.maps.event.addDomListener(window, 'resize', function() {
          theMap.map.setCenter(scope.currentLatLng);
        });

        google.maps.event.addListener(theMap.map, 'click', function(){
          selectedInfoWindow.close(theMap.map, selectedInfoWindow);
        })

        var userMarker = new google.maps.Marker({
          icon: './public/images/user.png',
          position: scope.currentLatLng,
          map: theMap.map,
          animation: google.maps.Animation.DROP
        });

        $scope.getAllPacks();

      }


      $scope.packDetails = function(pack){

        return '<div class="infoWindowContent"><h6>' + 'Posted by ' + '<span class="redspan">' + pack.username + '</span>' + '</h6><p>' + pack.address + '</p>' + '<p>' + pack.city + '</p>' + '<p>' + 'Brand: ' + pack.brand + '</p><p>' + 'Price: $' + pack.price.toFixed(2) + '</p></div>';

      }


      $scope.infoWindow = function(marker, pack){

        var iw = new google.maps.InfoWindow({
          content: $scope.packDetails(pack)
        })

        google.maps.event.addListener(marker, 'click', function() {
          if (selectedInfoWindow != null && selectedInfoWindow.getMap() != null){
            selectedInfoWindow.close();
            if (selectedInfoWindow == iw) {
              selectedInfoWindow = null;
              return;
            }
          }
          selectedInfoWindow = iw;
          selectedInfoWindow.open(theMap.map, marker);
        });

      }


      $scope.createPack = function(pack){

        pack.username = $cookies.get('user');
        pack.position = {};

          packsApi.getPackLatLng(pack).then(function (response){

            var min = .999999;
            var max = 1.000002;

            pack.position.lat = response.data.results[0].geometry.location.lat * (Math.random() * (max - min) + min);
            pack.position.lng = response.data.results[0].geometry.location.lng * (Math.random() * (max - min) + min);

            packsApi.createPack(pack).then(function (response){
              $scope.packs.push(response.data)
              $scope.pack = {};
              $scope.newMarker(response.data);
              $rootScope.renderUserPacks();

            })
          })
        }


      $scope.newMarker = function(pack){

        var marker = new google.maps.Marker({
            map: theMap.map,
            position: new google.maps.LatLng(pack.position.lat, pack.position.lng),
            icon: './public/images/icon.png'
        });

        $scope.infoWindow(marker, pack)
        marker.setMap(theMap.map);
      }

      $scope.getAllPacks = function(){
        packsApi.getAllPacks().then(function (response){
          $scope.packs = response.data.packs

          $scope.packs.forEach(function (pack) {
          $scope.newMarker(pack);
          })
        })
      }

    }


  $rootScope.mapTime = function(){
    theMap.initMap();
    $scope.getAllPacks();
  }

  $rootScope.mapTime();


}]);


control.controller('detailsController', ['$scope', '$rootScope', '$http', '$cookies', '$location', 'usersApi', 'packsApi', '$routeParams', function($scope, $rootScope, $http, $cookies, $location, usersApi, packsApi, $routeParams){

  $scope.isActive = function(viewLocation) {
    return viewLocation === $location.path();
  };


  $rootScope.renderUserPacks = function(){
    packsApi.getAllPacks().then(function(response){

    var data = response.data.packs;
    var curUsername = $rootScope.currentUser;

    $scope.packs = []

    for(var i = 0; i < data.length; i++){
      if(data[i].username === curUsername){
         $scope.packs.push(data[i]);

        }
      }
    });
  }


  $scope.getAllPacks = function(){
      packsApi.getAllPacks().then(function (response){
        $scope.packs = response.data.packs
        })
      $rootScope.mapTime();
    }


  $scope.deletePack = function(id){
    packsApi.deletePack(id).then(function(response){
      $scope.getAllPacks();
      $rootScope.renderUserPacks();
    });
  }


$rootScope.renderUserPacks();

}]);

