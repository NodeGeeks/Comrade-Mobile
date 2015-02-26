angular.module('comrade.services', [])

/**
 * A simple example service that returns some data.
 */

.factory('Notifications', function() {
    return {

    }
})

.factory('ComradeInfo', function() {
    return {

    }
})

.factory('Comrades', function() {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var comrades = [];
    var uniqueIds = [];


    return {
        all: function() {
          comradess = angular.fromJson(window.localStorage['comrades']);
          return comradess;
        },
        get: function(id) {
            comradess = angular.fromJson(window.localStorage['comrades']);
            for (var i = 0; i < comradess.length; i++){
                var obj = comradess[i];
                if (obj.id == id) {
                    return obj;
                }

            };

        },

        google: function() {
            hello("google").api("me/friends" ).success( function( json ){
                for (var i = 0; i < json.data.length; i++) {
                    var obj = json.data[i];
                    obj.provider = "google";
                    obj.type = "social";
                    if (uniqueIds.indexOf(obj.id) == -1 && obj.objectType !== 'page'){
                        comrades.push(obj);
                        uniqueIds.push(obj.id);
                        window.localStorage['comrades'] = angular.toJson(comrades);
                    }

                }
            }).error( function(err){
                if (err.error.code = 401) {
                    hello('google').login();
                }
            });
        },

        twitter: function() {
            hello("twitter").api("me/friends" ).success( function( json ){
                for (var i = 0; i < json.data.length; i++) {
                    var obj = json.data[i];
                    obj.provider = "twitter";
                    obj.type = "social";
                    if (uniqueIds.indexOf(obj.id) == -1){
                        comrades.push(obj);
                        uniqueIds.push(obj.id);
                        window.localStorage['comrades'] = angular.toJson(comrades);
                    }
                }
            }).error( function(err){
                hello("twitter").login();
            });
        },

        facebook: function() {

            hello("facebook").api("me/friends" ).success( function( json ){
                for (var i = 0; i < json.data.length; i++) {
                    var obj = json.data[i];
                    obj.provider = "facebook";
                    obj.type = "comrade";
                    if (uniqueIds.indexOf(obj.id) == -1){
                        comrades.push(obj);
                        uniqueIds.push(obj.id);
                        window.localStorage['comrades'] = angular.toJson(comrades);
                    }
                }
            }).error( function(err){
                if( err.error.error_subcode == 463) {
                    hello("facebook").login();
                }
            });

            hello("facebook").api("me/family", "get", {}, function(json){

                for (var i = 0; i < json.data.length; i++) {
                    var obj = json.data[i];
                    obj.provider = "facebook";
                    obj.type = "social";
                    if (uniqueIds.indexOf(obj.id) == -1){
                        obj.thumbnail = 'http://graph.facebook.com/' + obj.id + '/picture';
                        comrades.push(obj);
                        uniqueIds.push(obj.id);
                        window.localStorage['comrades'] = angular.toJson(comrades);
                    }
                }

            });
        }

    }
})

.factory('SocialAccounts', function () {
    return {

        setSocialProfileImage: function (provider, imgURL) {
            var userData = window.localStorage['user'];
            var parsed = angular.fromJson(userData);
            if (provider == 'facebook') {
                parsed.facebookPic = imgURL;
                window.localStorage['user'] = angular.toJson(parsed);
            }
            if (provider == 'google') {
                parsed.googlePic = imgURL;
                window.localStorage['user'] = angular.toJson(parsed);
            }
            if (provider == 'twitter') {
                parsed.twitterPic = imgURL;
                window.localStorage['user'] = angular.toJson(parsed);
            }

        }

    }
})

.factory('ComradeAPI', function ($scope, $http, $window) {

})


.factory('UserSession', function UserSession() {
    //TODO for developmement its okay to use standar localStorage but for product we want to use 'angular-local-storage' git repo by 'grevory'
    return {
        all: function() {
            var userData = window.localStorage['user'];
            console.log(userData);
            if(userData) {
                return angular.fromJson(userData);
            } else {return [];}
        },
        save: function(userData) {

            window.localStorage['user'] = angular.toJson(userData);
            console.log("DATA" + userData);
        },
        saveSocial: function(socialData, provider) {
            window.localStorage[provider] = angular.toJson(socialData);
        }
    }
})

.factory('sockets', function sockets($rootScope) {
    var socket = io.connect('http://192.168.1.127:1337');
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    };
})

.factory('Messages', function () {
  var messages = [];
  var uniqueIds = [];

  return {
    all: function() {
        messagess = angular.fromJson(window.localStorage['messages']);
        return messagess;
    },
    get: function(id) {
      messagess = angular.fromJson(window.localStorage['messages']);
      for (var i = 0; i < messagess.length; i++){
          var obj = messagess[i];
          console.log(obj);
          if (obj.id == id) {
              return obj;
          }

      };

    },
    getSpecMessage: function(object) {
        console.log("THIS IS IT DO OR DIE"+object);
      for (var i = 0; i < object.comments.data.length; i++){
          var obj = object.comments.data[i];
          console.log(obj);
          if (obj.id == id) {
              return obj;
          }

      };

    },
    twitter: function() {
      hello("twitter").api("me/messages" ).success( function( json ){
          console.log(json);

          for (var i = 0; i < json.length; i++) {
              var obj = json[i];
              if (uniqueIds.indexOf(obj.id) == -1) {
                  messages.push(obj);
                  uniqueIds.push(obj.id);
                  window.localStorage['messages'] = angular.toJson(messages);
              }
          }

      }).error( function(err){
          console.log(err);
          if( err.error.error_subcode == 463) {
              hello.login('twitter',{redirect_uri: 'http://localhost'});
          }
      });
    },
    facebook: function() {
      hello("facebook").api("me/messages" ).success( function( json ){
          console.log(json);

          for (var i = 0; i < json.data.length; i++) {
              var obj = json.data[i];
              if (uniqueIds.indexOf(obj.id) == -1) {
                  messages.push(obj);
                  uniqueIds.push(obj.id);
                  window.localStorage['messages'] = angular.toJson(messages);
              }
          }

      }).error( function(err){
          console.log(err);
          if( err.error.error_subcode == 463) {
              hello.login('facebook',{redirect_uri: 'http://localhost'});
          }
      });
    }
  }
})

.factory('Events', function () {
  var events = [
    { id: 0, name: 'Birthday' },
    { id: 1, name: 'Party Time' },
    { id: 2, name: 'Dinner at Dominos' },
    { id: 3, name: 'Harry wedding' }
  ];
     
  return {
    all: function() {
      return events;
    },
    get: function(eventId) {
      // Simple index lookup
      return events[eventId];
    }
  }
})

.factory('SettingsController', function () {

});
