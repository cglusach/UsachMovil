// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  
	.state('app.inicio', {
      url: "/inicio",
      views: {
        'menuContent' :{
          templateUrl: "app/inicio.html"
        }
      }
    })

    .state('app.opciones', {
      url: "/opciones",
      views: {
        'menuContent' :{
          templateUrl: "app/opciones.html"
        }
      }
    })
    
    .state('app.acercade', {
      url: "/acercade",
      views: {
        'menuContent' :{
          templateUrl: "app/acercade.html"
        }
      }
    })
    
    .state('app.buscarsala', {
      url: "/buscarsala",
      views: {
        'menuContent' :{
          templateUrl: "app/buscarsala.html"
        }
      }
    })
    
    .state('app.mapausach', {
      url: "/mapausach",
      views: {
        'menuContent' :{
          templateUrl: "app/mapausach.html"
        }
      }
    })
    .state('app.get', {
      url: "/get",
      views: {
        'menuContent' :{
          templateUrl: "app/get.html"
        }
      }
    })

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    });

    /*
    .state('app.search', {
      url: "/search",
      views: {
        'menuContent' :{
          templateUrl: "templates/search.html"
        }
      }
    })

    .state('app.browse', {
      url: "/browse",
      views: {
        'menuContent' :{
          templateUrl: "templates/browse.html"
        }
      }
    })
    
    .state('app.playlists', {
      url: "/playlists",
      views: {
        'menuContent' :{
          templateUrl: "templates/playlists.html",
          controller: 'PlaylistsCtrl'
        }
      }
    })

    .state('app.single', {
      url: "/playlists/:playlistId",
      views: {
        'menuContent' :{
          templateUrl: "templates/playlist.html",
          controller: 'PlaylistCtrl'
        }
      }
    });
    */
  
  $urlRouterProvider.otherwise('/app/inicio');
});

