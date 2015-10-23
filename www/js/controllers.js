angular.module('umovil.controllers', [])

.controller('UsachMovilCtrl', function($scope, $ionicSideMenuDelegate) {
	$scope.toggleLeft = function() {
		$ionicSideMenuDelegate.toggleLeft();
	};
})

.controller('BuscarSalaCtrl', function($scope, $http, $state, $ionicPopup, $ionicLoading, GETservice) {
	$scope.model = {};
	$scope.estado = "Esperando ingreso de sala...";
	$scope.getData = function() {
		$scope.estado = "";

		$ionicLoading.show({
			content: 'Buscando...',
			animation: 'fade-in',
			showBackdrop: false,
			maxWidth: 200,
			showDelay: 150
		});

		GETservice.fetchLugar($scope.model.lugar).then(function(dato){
			$scope.estado = "Buscando...";

			if (!dato) {
				$ionicLoading.hide();
				$scope.estado = "No se pudo hacer la consulta a la Base de Datos. Verifica tu conexión a Internet.";
				$scope.showAlert();
				return;
			}
			else {
				$ionicLoading.hide();
				if (dato.valido === false) {
					$scope.estado = dato.estado;
					$scope.showAlert();
					return;
				}
				else {
					$scope.estado = dato.estado;
					$state.go('salas.resultadosala', { nombre: dato.nombre });  
				}
			}
		});
	};

	$scope.showAlert = function() {
		var alertPopup = $ionicPopup.alert({
			title: "ERROR",
			template: $scope.estado
		});
		alertPopup.then(function(res) {
			console.log('Error descartado');
		});
	};
})

.controller('MostrarMapaCtrl', function($scope, $stateParams, $ionicLoading, $compile, GETservice, FactoriaOpciones) {
	$scope.init = function() {
		$scope.model = GETservice.getLugar();
		$scope.model.periodo = GETservice.getPeriodo();

		var myLatlng = new google.maps.LatLng(parseFloat($scope.model.latitud), parseFloat($scope.model.longitud));
		var Nombre = $scope.model.nombre;
		var mapOptions = {
			center: myLatlng,
			zoom: 17,
			mapTypeId: google.maps.MapTypeId.HYBRID,
			zoomControl: false,
			streetViewControl: false,
			panControl: false
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

		// GEOLOCALIZACIÓN
		if (FactoriaOpciones.getGeolocalizacion()===true) {
			navigator.geolocation.getCurrentPosition(function(pos) {
				var posicion = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
				var marker = new google.maps.Marker({
					position: posicion,
					map: map,
					title: "Tu Posición Actual",
					icon: "img/marker_youarehere.png"
				});
			}, function(error) {
				alert('No se puede obtener la ubicación: ' + error.message);
			});
		}

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
			strokeColor: '#05FF05',
			strokeOpacity: 1.0,
			strokeWeight: 3
		});

		var LPath = new google.maps.Polyline({
			path: LRoute,
			strokeColor: '#FF0000',
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

		// Experimento para obtener las distancias y tiempos desde el metro
		/*
		var distanciaCorta = distanciaEnMetros(SPath);
		var distanciaLarga = distanciaEnMetros(LPath);
		var tiempoCorto = tiempoCaminando(distanciaCorta);
		var tiempoLargo = tiempoCorriendo(distanciaCorta);
		console.log("ruta " + distanciaCorta + " " + distanciaLarga);
		console.log("tiempo " + formatearTiempo(tiempoCorto) + " " + formatearTiempo(tiempoLargo));
		*/

		$scope.model.distancia = distanciaEnMetros(SPath);
		$scope.model.tiempoCorto = tiempoCaminando($scope.model.distancia);
		$scope.model.tiempoLargo = tiempoCorriendo($scope.model.distancia);

		document.querySelector('#infoNombre').innerHTML = "<b>Nombre del Lugar:</b></br>" + $scope.model.nombre;
		document.querySelector('#infoPiso').innerHTML = "<b>Piso:</b></br>" + $scope.model.piso;
		document.querySelector('#infoMetro').innerHTML = "<b>Metro de Origen:</b></br>" + $scope.model.metroOrigen;
		document.querySelector('#infoDistancia').innerHTML = "<b>Distancia:</b></br>" + $scope.model.distancia + " mt";
		document.querySelector('#infoCamina').innerHTML = "<b>Tiempo Caminando (4 km/h):</b></br>" + formatearTiempo($scope.model.tiempoCorto);
		document.querySelector('#infoCorre').innerHTML = "<b>Tiempo Corriendo (12 km/h):</b></br>" + formatearTiempo($scope.model.tiempoLargo);

		if( !isNaN($scope.model.nombre) ) {
			$scope.model.url = "https://registro.usach.cl/registrold/salas/listarsala.php?sala=" + $scope.model.nombre + "&periodo=" + $scope.model.periodo;
			$scope.model.enlace = "onclick=\"window.open(\'" + $scope.model.url + "\', '_system');\"";
			document.querySelector('#infoHorario').innerHTML = "<button class='button button-block button-positive'" + $scope.model.enlace + ">Carga Horaria Sala</button>";
		}

		/*
		google.maps.event.addListener(marker, 'click', function() {
		  infowindow.open(map,marker);
		});
		*/
		
		$scope.map = map;
	};

	// google.maps.event.addDomListener(window, 'load', initialize);

	google.maps.LatLng.prototype.kmTo = function(a){ 
		var e = Math, ra = e.PI/180; 
		var b = this.lat() * ra, c = a.lat() * ra, d = b - c; 
		var g = this.lng() * ra - a.lng() * ra; 
		var f = 2 * e.asin(e.sqrt(e.pow(e.sin(d/2), 2) + e.cos(b) * e.cos 
			(c) * e.pow(e.sin(g/2), 2))); 
		return f * 6378.137; 
	};

	google.maps.Polyline.prototype.inKm = function(n){ 
		var a = this.getPath(n), len = a.getLength(), dist = 0; 
		for (var i=0; i < len-1; i++) { 
			dist += a.getAt(i).kmTo(a.getAt(i+1)); 
		}
		return dist;
	};

	distanciaEnMetros = function(ruta) {
		return Math.round(ruta.inKm()*1000);
	};

	tiempoCaminando = function(distancia) {
		var velocidad = 1.111111111; // 4 km/h
		return Math.round(distancia/velocidad);
	};

	tiempoCorriendo = function(distancia) {
		var velocidad = 3.333333333; // 12 km/h
		return Math.round(distancia/velocidad);
	};

	formatearTiempo = function(tiempo) {
		// Transforma un lote de segundos en segundos y minutos
		// Ej: 90s -> 1m30s
		var mins = Math.floor(tiempo/60);
		var secs = Math.round(tiempo%60);
		return mins + "m " + get2Digits(secs) + "s";
	};

	get2Digits = function(num) {
		return ( num.toString().length < 2 ? "0"+num : num ).toString();
	}
})

.controller('LugaresCtrl', function($scope, $http, $state, $ionicPopup, $ionicLoading, GETservice) {
	$scope.groups = [];

	$scope.groups[0] = {
		name: "Facultades, Escuelas y Departamentos",
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
		name: "Entradas y Metros",
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

		$ionicLoading.show({
			content: 'Buscando...',
			animation: 'fade-in',
			showBackdrop: false,
			maxWidth: 200,
			showDelay: 150
		});

		GETservice.fetchLugar(item).then(function(dato){
			if (!dato) {
				$ionicLoading.hide();
				$scope.estado = "No se pudo hacer la consulta a la Base de Datos. Verifica tu conexión a Internet.";
				$scope.showAlert();
				return;
			}
			else {
				$ionicLoading.hide();

				if (dato.valido === false) {
					$scope.estado = dato.estado;
					$scope.showAlert();
					return;
				}
				else {
					$scope.estado = dato.estado;
					$state.go('salas.resultadosala', { nombre: dato.nombre });  
				}
			}
		});
	};

	$scope.showAlert = function() {
		var alertPopup = $ionicPopup.alert({
			title: "ERROR",
			template: $scope.estado
		});
		alertPopup.then(function(res) {
			console.log('Error descartado');
		});
	};
})

.controller('OpcionesCtrl', function($scope, $ionicPopup, ProcesadorOpciones, FactoriaOpciones) {
	$scope.form = {};

	$scope.selectorSemestre = {
		estaPresente : true,
		opcionEscogida : {"semestre": FactoriaOpciones.getSemestre() }
	};

	$scope.listaSemestres = [
		{semestre: "2015-01"},
		{semestre: "2015-02"},
		{semestre: "2016-01"},
		{semestre: "2016-02"},
		{semestre: "2017-01"},
		{semestre: "2017-02"}
	];

	$scope.listaOpciones = [
		{ text: "Geolocalización", checked: FactoriaOpciones.getGeolocalizacion() }
		//{ text: "Modo Offline", checked: FactoriaOpciones.getModoOffline() }
	];

	var temp = {};

	$scope.getData = function() {
		// Setear URL Consulta
		if (!$scope.form.url) {
			temp.UrlConsulta = FactoriaOpciones.getUrlConsulta();
		}
		else {
			temp.UrlConsulta = $scope.form.url;
		}

		// Setear Semestre
		if (!$scope.selectorSemestre.opcionEscogida) {
			temp.Semestre = FactoriaOpciones.getSemestre();
		}
		else {
			temp.Semestre = $scope.selectorSemestre.opcionEscogida.semestre;
		}

		//Otros parámetros
		temp.Geolocalizacion = $scope.listaOpciones[0].checked;
		temp.ModoOffline = false; //$scope.listaOpciones[1].checked;
		
		ProcesadorOpciones.setOpciones(temp);
		$scope.showMessage("Configuraciones guardadas con éxito");
	}

	$scope.setDefault = function() {
		console.log("Seteando opciones por defecto...");
		var temp = ProcesadorOpciones.getDefault();
		ProcesadorOpciones.setDefault();
		$scope.showMessage("Configuraciones por defecto restauradas con éxito");
	}

	$scope.showMessage = function(msg) {
		var alertPopup = $ionicPopup.alert({
			title: "Información",
			template: msg
		});
	};
});

