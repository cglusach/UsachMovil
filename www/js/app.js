// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

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

  .state('umovil', {
      url: "/umovil",
      abstract: true,
      templateUrl: "app/um_sidemenu.html"
    })

  .state('umovil.inicio', {
      url: "/inicio",
      views: {
        'menuContent' :{
          templateUrl: "app/um_inicio.html"
        }
      }
    })

  .state('umovil.opciones', {
      url: "/opciones",
      views: {
        'menuContent' :{
          templateUrl: "app/um_opciones.html"
        }
      }
    })

  .state('umovil.buscarsala', {
      url: "/buscarsala",
      views: {
        'menuContent' :{
          templateUrl: "app/um_buscarsala.html"
        }
      }
    })

  .state('umovil.resultadosala', {
      url: "/resultadosala/:lat,:long,:nombre",
      views: {
        'menuContent' :{
          templateUrl: "app/um_resultadosala.html"
        }
      }
    })

  .state('umovil.links', {
      url: "/links",
      views: {
        'menuContent' :{
          templateUrl: "app/um_links.html"
        }
      }
    })

  .state('umovil.acercade', {
      url: "/acercade",
      views: {
        'menuContent' :{
          templateUrl: "app/um_acercade.html"
        }
      }
    })

  .state('salas', {
      url: "/salas",
      abstract: true,
      templateUrl: "app/um_salasmenu.html"
    })

  .state('salas.resultadosala', {
      url: "/resultadosala/:lat,:long,:nombre",
      views: {
        'menuContent' :{
          templateUrl: "app/um_resultadosala.html"
        }
      }
    })
	
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

    .state('app.mapausach', {
        url: "/mapausach/:lat,:long",
      views: {
        'menuContent' :{
          templateUrl: "app/mapausach.html"
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
    })
    
    /*.state('app.mapadatos', {
      url: "/app",
      abstract: true,
      templateUrl: "app/mapausach_datos.html",
      controller: 'AppCtrl'
    })*/

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
  
  $urlRouterProvider.otherwise('/umovil/inicio');
});

