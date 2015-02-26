angular.module('comrade.controllers', [])


.controller('MainController', function($scope, $window, $http, $ionicLoading, $state, $location, SocialAccounts, $localStorage) {
    $scope.$hasHeader=false;
    $scope.$userStorage = $localStorage.user;
    var baseURL = "http://192.168.1.127:1337";

    if ($scope.$userStorage && $scope.$userStorage.accessToken !== angular.undefined) {

        $http({method: 'POST', url: 'http://192.168.1.127:1337/users/checkAuthToken', data: {id: $scope.$userStorage.id, token: $scope.$userStorage.accessToken}}).
            success(function(data, status, headers, config) {
                //alert(data);
                if (data === 'false') {
                    //do nothing stay here bitch
                } else if (data === 'true') {
                    $location.path('/loggedIn/dashboard');
                }

            }).
            error(function(data, status, headers, config) {
                //alert(data);
                $location.path('/main');
            });

    };

    $scope.login = function(loginData) {
        $ionicLoading.show({
            template: 'Loading'
        });
        $http({method: 'POST', url: baseURL + '/users/login', data: loginData}).
            success(function(data, status, headers, config) {
                $localStorage.user = data[0];
                $location.path('/loggedIn/dashboard');
                $ionicLoading.hide();
            }).
            error(function(data, status, headers, config) {
                $ionicLoading.hide();
            });
    };

    $scope.socialLogin = function(provider) {

        var retrieveStoreAndGo = function(userData) {
            var hasFacebook = userData[0].facebookID ? true : false;
            var hasTwitter = userData[0].twitterID ? true : false;
            var hasGoogle = userData[0].googleID ? true : false;
            var i = 0;
            var l = 0;
            $localStorage.user = userData[0];
            if (hasFacebook) {
                i++;
                hello.login( 'facebook', {redirect_uri: 'http://localhost/'}, function(auth){
                    console.log(auth);
                    hello('facebook').api( '/me' ).success(function(r){
                        console.log(r);
                        UserSession.saveSocial(r, 'facebook');
                        SocialAccounts.setSocialProfileImage('facebook', r.thumbnail);
                        l++;
                        if (l == i) {
                            $ionicLoading.hide();
                            $location.path('/loggedIn/dashboard');
                        }
                    });
                });
            }
            if (hasTwitter) {
                i++;
                hello.login( 'twitter', {redirect_uri: 'http://localhost/'}, function(auth){
                    hello('twitter').api( '/me' ).success(function(r){
                        UserSession.saveSocial(r, 'twitter');
                        SocialAccounts.setSocialProfileImage('twitter', r.thumbnail);
                        l++;
                        if (l == i) {
                            $ionicLoading.hide();
                            $location.path('/loggedIn/dashboard');
                        }
                    });
                });
            }
            if (hasGoogle) {
                i++;
                hello.login( 'google', { redirect_uri: 'http://localhost/'}, function(auth){
                    hello('google').api( '/me' ).success(function(r){
                        UserSession.saveSocial(r, 'google');
                        SocialAccounts.setSocialProfileImage('google', r.thumbnail);
                        l++;
                        if (l == i) {
                            $ionicLoading.hide();
                            $location.path('/loggedIn/dashboard');
                        }
                    });
                });
            }
            console.log("we have this many social account" + i);

        };
        var options = {};
        if (provider == "facebook") {
            options = {scope:'basic, friends, events, create_event, email, notifications, messages', redirect_uri: 'http://localhost/'};
        } else if (provider == "twitter") {
            options = {scope:'basic', oauth_proxy: 'https://auth-server.herokuapp.com/proxy', redirect_uri: 'http://localhost/'};
        } else if (provider == "google") {
            options = {scope:'basic, friends, events, email, offline_access', response_type:'code', oauth_proxy: 'https://auth-server.herokuapp.com/proxy', redirect_uri: 'http://localhost/'};
        } else if (provider == "linkedin") {
            options = {scope:'basic, friends, email', redirect_uri:'http://localhost/', oauth_proxy: 'https://auth-server.herokuapp.com/proxy'};
        };
        hello.login( provider, options, function(auth){

            hello(provider).api( '/me' ).success(function(r){
                $ionicLoading.show({
                    template: 'Loading..'
                });
                var firstName = r.first_name;
                var lastName = r.last_name;
                var baseURL = "http://192.168.1.127:1337";
                $http({method: 'POST', url: baseURL + '/users/loginSocialAccount', data: {provider: auth.network, socialID: r.id, firstName: firstName, lastName: lastName}}).
                    success(function(data, status, headers, config) {
                        retrieveStoreAndGo(data);
                    }).
                    error(function(data, status, headers, config) {
                        $ionicLoading.hide();
                    });
            });
            console.log(auth);
        });

    }


})

.controller('SignupController', function($scope, $http, $ionicLoading, $location, UserSession, $localStorage) {
    var baseURL = "http://192.168.1.127:1337";

    $scope.signup = function(signupData) {
        $ionicLoading.show({
            template: 'Loading'
        });
        $http({method: 'POST', url: baseURL + '/users/signup', data: signupData}).
            success(function(data, status, headers, config) {
                $ionicLoading.hide();
                $localStorage.user = data[0];
                $location.path('/loggedIn/tutorial');
            }).
            error(function(data, status, headers, config) {
                $ionicLoading.hide();
            });
    };
})

.controller('DashboardController', function($scope, $http, $ionicModal, $location, $ionicActionSheet, $localStorage, Notifications, SocialAccounts, $cordovaCamera) {
    $scope.$userStorage = $localStorage.user;
    if ($scope.$userStorage) {
        if($scope.$userStorage.accessToken !== angular.undefined) {

        $http({method: 'POST', url: 'http://192.168.1.127:1337/users/checkAuthToken', data: {id: $scope.$userStorage.id, token: $scope.$userStorage.accessToken}}).
            success(function (data, status, headers, config) {
                if (data === 'false') {
                    $location.path('/main');
                } else if (data === 'true') {
                    //do nothing your more then welcome to stay
                }

            });
        }
    } else {$location.path('/main')};
    $scope.hasFacebook = $scope.$userStorage.facebookID ? true : false;
    $scope.isComrade = $scope.$userStorage.comradeUsername ? true : false;
    $scope.hasTwitter = $scope.$userStorage.twitterID ? true : false;
    $scope.hasGoogle = $scope.$userStorage.googleID ? true : false;
    var baseURL = "http://192.168.1.127:1337";
    //TODO toggle switch for switching on or off different social accounts.
    $scope.takePicture = function() {
        var options = {
            quality : 75,
            destinationType : Camera.DestinationType.DATA_URL,
            sourceType : Camera.PictureSourceType.CAMERA,
            allowEdit : true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 100,
            targetHeight: 100,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };

        $cordovaCamera.getPicture(options).then(function(imageData) {
            console.log(imageData);
        }, function(err) {
            // An error occured. Show a message to the user
        });
    };
    $scope.profilePhotoAction = function() {
        var hideSheet = $ionicActionSheet.show({
            buttons: [
                { text: 'Your Gallery' },
                { text: 'or Take One' }
            ],
            titleText: 'Choose a photo from',
            cancelText: 'Cancel',
            buttonClicked: function(index) {
                if (index == 0) {

                } else if(index == 1) {
                    $scope.takePicture();
                } else {
                    return true;
                }

            }
        });

    };
    $scope.logout = function() {
        $http({method: 'POST', url: baseURL + '/users/logout', data: {id:$scope.$userStorage.id} }).
            success(function(data, status, headers, config) {
                console.log(data);
                $localStorage.$reset();
                hello().logout(function() {
                });
                $location.path('/main');

            }).
            error(function(data, status, headers, config) {
                console.log(data);
            });


    };


    $scope.socialLogout = function(provider) {

        hello(provider).logout(function(val) {

        });

    };

    $scope.linkSocialAccount = function(provider) {
        var options = {};
        if (provider == "facebook") {
            options = {scope:'basic, friends, events, create_event, email, notifications', redirect_uri: 'http://localhost/'};
        } else if (provider == "twitter") {
            options = {scope:'basic', oauth_proxy: 'https://auth-server.herokuapp.com/proxy', redirect_uri: 'http://localhost/'};
        } else if (provider == "google") {
            options = {scope:'basic, friends, events, email, offline_access', redirect_uri: 'http://localhost/', response_type:'code', oauth_proxy: 'https://auth-server.herokuapp.com/proxy'};
        } else if (provider == "linkedin") {
            options = {scope:'basic, friends, email', redirect_uri: 'http://localhost/', oauth_proxy: 'https://auth-server.herokuapp.com/proxy'};
        }
        hello.login( provider, options, function(auth){
            hello(provider).api( '/me' ).success(function(r){
                var baseURL = "http://192.168.1.127:1337";
                $http({method: 'POST', url: baseURL + '/users/linkSocialAccount', data: {provider: auth.network, id: $scope.$userStorage.id , socialID: r.id, token: $scope.$userStorage.accessToken}}).
                    success(function(data, status, headers, config) {
                        $localStorage.user = data[0];
                        SocialAccounts.setSocialProfileImage(provider, r.thumbnail);
                        $location.path('/loggedIn/dashboard');
                    }).
                    error(function(data, status, headers, config) {
                        console.log(data);
                    });
            });
        });

    }

    $ionicModal.fromTemplateUrl('linkanothersocialaccount.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.linkAnotherSocialAccount = modal;
    });

    $ionicModal.fromTemplateUrl('settings.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.settingsModal = modal;
    });

    $ionicModal.fromTemplateUrl('socialaccounts.html', {
        scope: $scope,
        animation: 'slide-in-left'
    }).then(function(modal) {
        $scope.socialAccountsModal = modal;
    });
    $scope.openSettingsModal = function() {
        $scope.settingsModal.show();
    };
    $scope.closeSettingsModal = function() {
        $scope.settingsModal.hide();
    };
    $scope.openSocialAccountsModal = function() {
        $scope.socialAccountsModal.show();
    };
    $scope.closeSocialAccountsModal = function() {
        $scope.socialAccountsModal.hide();
    };
    $scope.openLinkMoreModal = function() {
        $scope.linkAnotherSocialAccount.show();
    };
    $scope.closeLinkMoreModal = function() {
        $scope.linkAnotherSocialAccount.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.settingsModal.remove();
        $scope.socialAccountsModal.remove();
        $scope.linkAnotherSocialAccount.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
        // Execute action
    });

    $scope.change = function(a) {
        if (a === false) {
            alert(1);
        }
        if (a === true) {
            alert(2);
        }
    };
    $scope.$watch('hasTwitter', function(a) {
        if (a === false) {

        }
        if (a === true) {

        }
    });
    $scope.$watch('hasGoogle', function(a) {
        if (a === false) {

        }
        if (a === true) {

        }
    });
})

.controller('SocialAccountsController', function ($scope, SocialAccounts) {

})

.controller('SettingsController', function ($scope) {
})

.controller('ComradesController', function($scope, Comrades, SocialAccounts, UserSession, $state) {
    $scope.UserData = UserSession.all();
    $scope.hasFacebook = $scope.UserData.facebookID ? true : false;
    $scope.hasTwitter = $scope.UserData.twitterID ? true : false;
    $scope.hasGoogle = $scope.UserData.googleID ? true : false;
    $scope.search = false;
    $scope.addComrade = false;
    $scope.isComrade = function (id) {
        comradess = angular.fromJson(window.localStorage['comrades']);
        for (var i=0;i<comradess.length;i++){
            if (comradess[i].id==id && comradess[i].type == 'comrade'){
                return true;
            }
        }
    };

    $scope.isSocialComrade = function (id) {
        comradess = angular.fromJson(window.localStorage['comrades']);
        for (var i=0;i<comradess.length;i++){
            if (comradess[i].id==id && comradess[i].type == 'social'){
                return true;
            }
        }
    };

    if ($scope.hasFacebook) {
        Comrades.facebook();
    };
    if ($scope.hasGoogle) {
        Comrades.google();
    };
    if ($scope.hasTwitter) {
        Comrades.twitter();

    };
    $scope.comrades = Comrades.all();
    $scope.predicate = '+name';
})

.controller('ComradeInfoController', function($scope, $stateParams, Comrades) {
    $scope.comrade = Comrades.get($stateParams.id);
})

.controller('SpecMessageController', function($scope, $stateParams, Messages) {
    $scope.message = Messages.get($stateParams.id);
})

.controller('ChatController', function($scope, $stateParams, sockets, Comrades, UserSession, $animate) {
        $animate.addClass($('#main-tabs'), 'tabs-item-hide');
        $scope.comrade = Comrades.get($stateParams.id);
        $scope.conversation = [];

        sockets.emit('user', {id: UserSession.all().id, friendID: $stateParams.id});
        $scope.$on("$destroy", function(){
            $animate.removeClass($('#main-tabs'), 'tabs-item-hide');
        });
        socket.on('message', function(data) {console.log("Global message: ", data.msg)});

})

.controller('EventsController', function($scope, Events) {
    $scope.events = Events.all();
})

.controller('MessagesController', function($scope, Messages, UserSession) {
    $scope.UserData = UserSession.all();
    $scope.hasFacebook = $scope.UserData.facebookID ? true : false;
    $scope.hasTwitter = $scope.UserData.twitterID ? true : false;
    $scope.hasGoogle = $scope.UserData.googleID ? true : false;
    if ($scope.hasFacebook) {
        Messages.facebook();
    };
    if ($scope.hasGoogle) {
        //Messages.google();
    };
    if ($scope.hasTwitter) {
        Messages.twitter();

    };
    $scope.messages = Messages.all();
})

.controller('PlacesController', function($scope) {

})

.controller('LoadingController', function($scope, $location, $http, $localStorage) {
    $scope.$storage = $localStorage.$default({
        user: {id: angular.undefined, accessToken: angular.undefined}
    });
    if ($scope.$storage.user.accessToken == angular.undefined) {
        $location.path('/main');
    }
    if ($scope.$storage && $scope.$storage.user.accessToken !== angular.undefined) {

        $http({method: 'POST', url: 'http://192.168.1.127:1337/users/checkAuthToken', data: {id: $scope.$storage.user.id, token: $scope.$storage.user.accessToken}}).
            success(function(data, status, headers, config) {
                if (data === 'false') {
                    $location.path('/main');
                } else if (data === 'true') {
                    $location.path('/loggedIn/dashboard');
                }
            });

    }

});
