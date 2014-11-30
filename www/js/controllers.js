angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})


.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Buscar sala', id: 1 },
    { title: 'Créditos', id: 2 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('MapCtrl', function($scope) {
})

.controller('GETController', function($scope, $http) {
	$scope.model = {};
	$scope.model.base = "https://salasusach.herokuapp.com/";
    $scope.getData = function() {
	
      //URLs
	  $scope.model.url = $scope.model.base + "coordenada/buscar/" +  $scope.model.code;
	  $scope.model.url2 = $scope.model.base + "lugar/buscar/" +  $scope.model.code;
	  $http.get($scope.model.url2).then(function(resp) {
		  $scope.model.instance = resp.data.instance;
          //Si existe la sala o lugar entonces asignamos su latitud y longitud, en caso contrario dejamos vacios los campos
		  if($scope.model.instance == 'Just')
		  {
			$http.get($scope.model.url).then(function(resp) {
			$scope.estado = "Existe lugar"
			$scope.latitud = resp.data.slot1.latitud;
			$scope.longitud = resp.data.slot1.longitud;
			}, function(err) {
			console.error('ERR', err);
			// err.status will contain the status code
		   })  
		  }
		  else
		  {
			$scope.estado = "No existe lugar"
			$scope.latitud = "";
			$scope.longitud = "";
		  }
	  }, function(err) {
		console.error('ERR', err);
		// err.status will contain the status code
	   })
	   
	}
})

.controller('MapController', function($scope, $ionicLoading, $compile) {
    $scope.init = function() {
        var myLatlng = new google.maps.LatLng(-33.4489056, -70.6819047);

        var mapOptions = {
			center: myLatlng,
			zoom: 16,
			mapTypeId: google.maps.MapTypeId.HYBRID,
			zoomControl:false,
			streetViewControl: false,
			panControl:false
        };
        var map = new google.maps.Map(document.getElementById("mapa"),
            mapOptions);

        //Marker + infowindow + angularjs compiled ng-click
        var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
        var compiled = $compile(contentString)($scope);

        var infowindow = new google.maps.InfoWindow({
          content: compiled[0]
        });

        var marker = new google.maps.Marker({
          position: myLatlng,
          map: map,
          title: 'USACH'
        });

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.open(map,marker);
        });

        $scope.map = map;
    };

    // google.maps.event.addDomListener(window, 'load', initialize);

    $scope.centerOnMe = function() {
        if(!$scope.map) {
            return;
        }

        $scope.loading = $ionicLoading.show({
          content: 'Getting current location...',
          showBackdrop: false
        });

        navigator.geolocation.getCurrentPosition(function(pos) {
          $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
          $scope.loading.hide();
        }, function(error) {
          alert('Unable to get location: ' + error.message);
        });
    };

    $scope.clickTest = function() {
        alert('Example of infowindow with ng-click')
    };
});
