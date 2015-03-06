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
		GETservice.fetchLugar($scope.model.lugar).then(function(dato){
      if (!dato) {
				$scope.estado = "ERROR: No se pudo hacer la consulta";
				return;
			}
			else {
        //console.log(dato.estado + " " + dato.valido);
        if (dato.valido === false) {
          $scope.estado = dato.estado;
          return;
        }
        else {
          $scope.estado = dato.estado;
          $state.go('salas.resultadosala', { nombre: dato.nombre });  
        }
			}
		});
	};
})

.controller('MostrarMapaCtrl', function($scope, $stateParams, $ionicLoading, $compile, GETservice) {
    $scope.init = function() {
      $scope.model = GETservice.getLugar();
      $scope.model.periodo = GETservice.getPeriodo();

        var myLatlng = new google.maps.LatLng(parseFloat($scope.model.latitud), parseFloat($scope.model.longitud));
        var Nombre = $scope.model.nombre;
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

        var SRoute = [];
        var LRoute = [];

        

        
        for (var i=0; i<$scope.model.rutaCorta.length; i++){
          var lat = $scope.model.rutaCorta[i].latitud;
          var ln = $scope.model.rutaCorta[i].longitud;
          SRoute[SRoute.length] = new google.maps.LatLng(lat,ln);
        }

        SRoute[SRoute.length] = myLatlng;

        for (var i=0; i<$scope.model.rutaLarga.length; i++){
          var lat = $scope.model.rutaLarga[i].latitud;
          var ln = $scope.model.rutaLarga[i].longitud;
          LRoute[LRoute.length] = new google.maps.LatLng(lat,ln);
        }
//Se instancia un objeto del tipo google.maps.Polyline
//al cual se pasa el arreglo de coordenadas.
        var SPath = new google.maps.Polyline({
          path: SRoute,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 3
        });

        var LPath = new google.maps.Polyline({
          path: LRoute,
          strokeColor: '#0101DF',
          strokeOpacity: 1.0,
          strokeWeight: 3
        });

SPath.setMap(map);
LPath.setMap(map);

        var marker = new google.maps.Marker({
          position: myLatlng,
          map: map,
          title: Nombre
        });

        // Experimento para obtener las coordenadas de cada ruta
        /*
        console.log("RUTA CORTA " + $scope.model.nombre);
        for (var i=0; i<$scope.model.rutaCorta.length; i++) {
          j = i+1;
          console.log(j + " " + $scope.model.rutaCorta[i].latitud + " " + $scope.model.rutaCorta[i].longitud);
        }
        console.log("RUTA LARGA " + $scope.model.nombre);
        for (var i=0; i<$scope.model.rutaLarga.length; i++) {
          j = i+1;
          console.log(j + " " + $scope.model.rutaLarga[i].latitud + " " + $scope.model.rutaLarga[i].longitud);
        }
        */
        
        if($scope.model.tipo === 2) {
          $scope.model.url = "https://registro.usach.cl/registrold/salas/listarsala.php?sala=" + $scope.model.nombre + "&periodo=" + $scope.model.periodo;
          $scope.model.enlace = "onclick=\"window.open(\'" + $scope.model.url + "\', '_system');\"";
          document.querySelector('#infoNombre').innerHTML = "<b>Nombre del Lugar:</b></br>Sala " + $scope.model.nombre;
          document.querySelector('#infoPiso').innerHTML = "<b>Piso:</b></br>" + $scope.model.piso;
          document.querySelector('#infoHorario').innerHTML = "<button class='button button-block button-positive'" + $scope.model.enlace + ">Carga Académica Sala</button>";
          document.querySelector('#infoMetro').innerHTML = "<b>Metro de Origen:</b></br>" + $scope.model.metroOrigen;
        }
        else {
          document.querySelector('#infoNombre').innerHTML = "Nombre del Lugar: " + $scope.model.nombre;
          document.querySelector('#infoPiso').innerHTML = "Piso: " + $scope.model.piso; 
          document.querySelector('#infoMetro').innerHTML = "Metro de Origen: " + $scope.model.metroOrigen;
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
	};
})

.controller('AccordionList', function($scope, $http, $state, GETservice) {

  $scope.groups = [];
  $scope.groups[0] = {
    name: "Facultades, escuelas, departamentos",
    items: ["Auditorio de Química y Biología","Bachillerato","Departamento de Deporte","Departamento de Desarrollo de Talentos Artísticos","Departamento Filosofía","Departamento Física","Escuela de Arquitectura","Escuela de Periodismo y Psicología","Facultad de Administración y Economía - FAE","Facultad de Humanidades","Facultad de Química y Biología","Facultad Tecnológica","Ingeniería en Alimentos","Ingeniería Textil","Licenciatura en Ciencias de la Actividad Física "]
  };
  $scope.groups[1] = {
    name: "Ingeniería",
    items: ["Bienestar Estudiantil - Ingeniería","Departamento de Ingeniería en Minas (dimin)","Departamento de Ingeniería Informática (diinf)","Departamento de Ingeniería Mecánica ","Departamento de Ingeniería Química","Departamento Ingeniería Eléctrica","Departamento Ingeniería Geográfica","Departamento Ingeniería Industrial","Departamento Ingeniería Obras Civiles","Facultad de Ingeniería","Registro Curricular - Ingeniería"]
  };
  $scope.groups[2] = {
    name: "Laboratorios",
    items: ["Laboratorio Central - CECTA","Laboratorio Ciencias Médicas","Laboratorio de Procesos Mecánicos","Laboratorios de Física"]
  };
  $scope.groups[3] = {
    name: "Administrativo",
    items: ["Casa Central - Rectoría ","Departamento de Finanzas","Federación de Estudiantes - FEUSACH","Patio de los Naranjos","Registro Académico","SEGIC","Vicerrectoría de Gestión y Desarrollo Estudiantil"]
  };
  $scope.groups[4] = {
    name: "Varios",
    items: ["Aula Magna","Biblioteca Central","Casino Central","Casino FAE","Casino Ingeniería Eléctrica","Centro de Eventos - CENI ","Centro de Salud","CITE-CAMP","Departamento de Matemáticas ","Depto. Promoción de la Salud Psicológica ","Foro Griego","Estadio USACH","Gimnasio","Kiosko Informática","Paraninfo","Piscina","Planetario","Sala Cuna","Salón Victor Jara","Radio USACH"]
  };
  $scope.groups[5] = {
    name: "Entradas y metros",
    items: ["Entrada - CENI (Vehículos)","Entrada - Centro de Salud (Peatones)","Entrada - Cultura (Peatones)","Entrada - EAO (Peatones)","Entrada - Fac. Tecnológica (Vehículos y Peatones)","Entrada -  Ing. Industrial (Peatones)","Entrada - Rectoría (Peatones)","Frontis","Metro Estación Central","Metro USACH"]
  };
  
  /*
   * if given group is the selected group, deselect it
   * else, select the given group
   */
  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };

  $scope.getData = function(item) {
    $scope.estado = "";
    
    GETservice.fetchLugar(item).then(function(dato){
      if (!dato) {
        $scope.estado = "ERROR: No se pudo hacer la consulta";
        return;
      }
      else {
        //console.log(dato.estado + " " + dato.valido);
        if (dato.valido === false) {
          $scope.estado = dato.estado;
          return;
        }
        else {
          $scope.estado = dato.estado;
          $state.go('salas.resultadosala', { nombre: dato.nombre });  
        }
      }
    });
  };

});
