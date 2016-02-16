var api = angular.module('usersApiFactory', []);

api.factory('usersApi', ['$http', function( $http ){

  var baseUsersUrl = '/api/users'

  var usersInterface = {};

  usersInterface.getAll = function(){
    return $http.get( baseUsersUrl );
  }

  usersInterface.createUser = function( user ){
    var payload = { user: user };
    return $http.post( baseUsersUrl, payload );
  }

  usersInterface.authenticate = function(username, password){
    return $http.post(baseUsersUrl + '/authenticate', {username: username, password: password})
  }

  return usersInterface;

}]);
