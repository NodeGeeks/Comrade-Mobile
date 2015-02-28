angular.module('comrade', ['ionic', 'comrade.controllers', 'comrade.services', 'ngCordova', 'ngStorage', 'ngMessages', 'growlNotifications'])

.run(function($ionicPlatform, $cordovaStatusbar) {

  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if ($ionicPlatform.is('ios')) {
      var isVisible = $cordovaStatusbar.isVisible();
      if (isVisible) $cordovaStatusbar.styleColor('cyan');
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider

    .state('loading', {
        url: "/",
        templateUrl: "templates/loading.html",
        controller: 'LoadingController'
    })

    .state('main', {
        url: "/main",
        templateUrl: "templates/main.html",
        controller: 'MainController'
    })

    .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginController'
    })

    .state('signup', {
        url: '/signup',
        templateUrl: 'templates/signup.html',
        controller: 'SignupController'

    })

    .state('loggedIn', {
        url: "/loggedIn",
        abstract: true,
        templateUrl: "templates/loggedIn.html"
    })

    .state('loggedIn.dashboard', {
        url: '/dashboard',
        views: {
            'dashboard': {
                templateUrl: 'templates/dashboard.html',
                controller: 'DashboardController'
            }
        }
    })

    .state('loggedIn.comrades', {
        url: '/comrades',
         views: {
            'comrades': {
                templateUrl: 'templates/comrades.html',
                controller: 'ComradesController'
            }
        }
    })

    .state('loggedIn.comrade', {
        url: '/comrade/:id',
        views: {
            'comrades': {
                templateUrl: 'templates/comrade.html',
                controller: 'ComradeInfoController'
            }
        }

    })

    .state('loggedIn.events', {
        url: '/events',
        views: {
            'events': {
                templateUrl: 'templates/events.html',
                controller: 'EventsController'
            }
        }
    })
    .state('loggedIn.messages', {
        url: '/messages',
        views: {
            'messages': {
                templateUrl: 'templates/messages.html',
                controller: 'MessagesController'
            }
        }
    })
    .state('loggedIn.chatRoom', {
        url: '/chatRoom/:id',
        views: {
            'comrades': {
                templateUrl: 'templates/chatRoom.html',
                controller: 'ChatController'
            }
        }
    })
    .state('loggedIn.specMessage', {
        url: '/specMessage/:id',
        views: {
            'messages': {
                templateUrl: 'templates/specMessage.html',
                controller: 'SpecMessageController'
            }
        }
    })
    .state('loggedIn.places', {
        url: '/places',
        views: {
            'places': {
                templateUrl: 'templates/places.html',
                controller: 'PlacesController'
            }
        }
    });


    $urlRouterProvider.otherwise('/');

});

