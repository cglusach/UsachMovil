angular.module('starter.controllers', [])

.controller('UsachMovilCtrl', function($scope, $ionicSideMenuDelegate) {
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
})

.controller('BuscarSalaCtrl', function($scope, $http, $state, GETservice) {
	$scope.model = {};
    $scope.getData = function() {
		$scope.estado = "";
		GETservice.getData($scope.model.lugar).then(function(dato){
      if (!dato) {
				$scope.estado = "No existe el lugar";
				return;
			}
			else {
        $scope.estado = "Lugar encontrado";
				$state.go('salas.resultadosala', {lat: dato.latitud, long: dato.longitud, nombre: dato.nombre});
			}
		});
	}
})

.controller('MostrarMapaCtrl', function($scope, $stateParams, $ionicLoading, $compile, GETservice) {
    $scope.init = function() {
    $scope.model = {};
        var myLatlng = new google.maps.LatLng(parseFloat($stateParams.lat), parseFloat($stateParams.long));
        var Nombre = $stateParams.nombre;
        var mapOptions = {
          center: myLatlng,
          zoom: 17,
          mapTypeId: google.maps.MapTypeId.HYBRID,
          zoomControl:false,
          streetViewControl: false,
          panControl:false
        };
        var map = new google.maps.Map(document.getElementById("mapa"), mapOptions);

        //Marker + infowindow + angularjs compiled ng-click
        /*
        var contentString = "<div><a ng-click='clickTest()'>"+Nombre+"</a></div>";
        var compiled = $compile(contentString)($scope);

        var infowindow = new google.maps.InfoWindow({
          content: compiled[0]
        });
        */

        var marker = new google.maps.Marker({
          position: myLatlng,
          map: map,
          title: Nombre
        });

        $scope.model = GETservice.getDetalles();
        $scope.model.periodo = GETservice.getPeriodo();
        
        if($scope.model.tipo === "sala") {
          $scope.model.url = "https://registro.usach.cl/registrold/salas/listarsala.php?sala=" + $scope.model.nombre + "&periodo=" + $scope.model.periodo;
          $scope.model.enlace = "onclick=\"window.open(\'" + $scope.model.url + "\', '_system');\"";
          document.querySelector('#infoNombre').innerHTML = "Nombre del Lugar: Sala " + $scope.model.nombre;
          document.querySelector('#infoPiso').innerHTML = "Piso: " + $scope.model.piso;
          document.querySelector('#infoHorario').innerHTML = "<button class='button button-block button-positive'" + $scope.model.enlace + ">Carga Académica Sala</button>";
        }
        else {
          document.querySelector('#infoNombre').innerHTML = "Nombre del Lugar: " + $scope.model.nombre;
          document.querySelector('#infoPiso').innerHTML = "Piso: " + $scope.model.piso; 
        }

        /*
        google.maps.event.addListener(marker, 'click', function() {
          infowindow.open(map,marker);
        });
        */
        
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
    
    $scope.toggleRight = function() {
        $ionicSideMenuDelegate.toggleRight();
  };
})



.controller('GETController', function($scope, $http, GETservice) {
	$scope.model = {};
    $scope.getData = function() {
		//funcion getData se puede llamar en cualquier controlador, pertenece al servicio GETservice el cual esta en services.js
		//al ejecutar la funcion se puede tomar el valor retornado usando ".then(function(valorRetornado)){ X codigo }"
		//tambien se puede usar de la siguiente forma : variable = GETservice.getData(sala);
		GETservice.getData($scope.model.code).then(function(dato){
			if(!dato){
				$scope.estado = "No existe lugar";
				$scope.latitud = "";
				$scope.longitud = "";
				$scope.piso = "";
				$scope.nombre = "";
				$scope.tipo = "";
				return;
			}
			$scope.estado = "Existe lugar";
			$scope.latitud = dato.latitud;
			$scope.longitud = dato.longitud;
			$scope.piso = dato.piso;
			$scope.nombre = dato.nombre;
			$scope.tipo = dato.tipo;

		});
	}
});
