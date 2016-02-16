var api = angular.module('packsApiFactory', []);

api.factory('packsApi', ['$http', function( $http ){

  var basePacksUrl = '/api/packs/'

  var packsInterface = {};

  packsInterface.getAllPacks = function(){
    return $http.get( basePacksUrl );
  }

  packsInterface.createPack = function( pack ){
    var payload = { pack: pack }
    return $http.post( basePacksUrl, payload );
  }

  packsInterface.deletePack = function( id ){
    return $http.delete( basePacksUrl + id );
  }

  packsInterface.updatePack = function( pack, id ){
    var payload = { pack: pack }
    return $http.patch( basePacksUrl + id, payload );
  }

  packsInterface.getPackLatLng = function( pack ){
    var geocodeLink = 'https://maps.googleapis.com/maps/api/geocode/json?address='+pack.address+','+pack.city
    return $http.get( geocodeLink );
  }

  return packsInterface;

}]);
