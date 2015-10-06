angular.module('starter.services', [])

.factory('GETservice', function($http, $q, opciones) {
	//en teoria si resulta la recoleccion de datos, deberia de estar latitud y longitud en dato.latitud, dato.longitud
	var lugar = {
	  estado:'',
	  valido:'',
	  nombre:'',
	  piso:'',
	  tipo:'',
	  latitud:'',
	  longitud:'',
	  metroOrigen:'',
	  rutaCorta: [ { latitud:'', longitud:'' } ],
	  rutaLarga: [ { latitud:'', longitud:'' } ]
	};

	//por defecto
	var urlBase = opciones.UrlConsulta;
	var periodo = opciones.Semestre;

	return {
			fetchLugar: function(input) {
			  url1 = urlBase + "/lugar/buscar/" + input;
			  url2 = urlBase + "/coordenada/buscar/" + input;
			  url3 = urlBase + "/coordenadas/minimo/" + input;
			  url4 = urlBase + "/coordenadas/largo/" + input;

				var req0 = $http.get(url1);
				var req1 = $http.get(url2);
				var req2 = $http.get(url3);
				var req3 = $http.get(url4);

				return $q.all([req0, req1, req2, req3]).then(function(obj) {
			      if (obj[0].data.instance === 'Just') {
			        lugar.nombre = obj[0].data.slot1.nombre;
			        lugar.piso = obj[0].data.slot1.piso;
			        lugar.tipo = obj[0].data.slot1.tipo;
			        //console.log(lugar.nombre);
			        //console.log(lugar.piso);
			        //console.log(lugar.tipo);
			      }
			      else {
			      	lugar.estado = "Lugar no existe";
			      	lugar.valido = false;
			      	return lugar;
			      }

			      if (obj[1].data.instance === 'Just') {
			        lugar.latitud = obj[1].data.slot1.latitud;
			        lugar.longitud = obj[1].data.slot1.longitud;
			        //console.log(lugar.latitud);
			        //console.log(lugar.longitud);
			      }
			      else {
			      	lugar.estado = "Lugar no existe";
			      	lugar.valido = false;
			      	return lugar;
			      }

			      if (obj[2].data.instance === 'Just') {
			      	lugar.rutaCorta.length = 0;	// IMPORTANTE: Vaciar el arreglo antes de volver a usarlo
			      	for(var i=0; i<obj[2].data.slot1.length; i++) {
			      		if (i === 0) {
			      			if (parseFloat(obj[2].data.slot1[i][0])===-33.4525108565 && parseFloat(obj[2].data.slot1[i][1])===-70.6860424147) {
			      				lugar.metroOrigen = "Universidad de Santiago";
			      			}
			      			else if (parseFloat(obj[2].data.slot1[i][0])===-33.4506444426 && parseFloat(obj[2].data.slot1[i][1])===-70.6792510615) {
			      				lugar.metroOrigen = "Estación Central"
			      			}
			      			else {
			      				lugar.metroOrigen = "Metro no válido";
			      			}
			      		}
				        lugar.rutaCorta[i] = { latitud: obj[2].data.slot1[i][0], longitud: obj[2].data.slot1[i][1] };
				    }
			      }
			      else {
			      	lugar.estado = "Lugar no existe";
			      	lugar.valido = false;
			      	return lugar;
			      }

			      if (obj[3].data.instance === 'Just') {
			      	lugar.rutaLarga.length = 0;	// IMPORTANTE: Vaciar el arreglo antes de volver a usarlo
			      	for(var i=0; i<obj[3].data.slot1.length; i++) {
				        lugar.rutaLarga[i] = { latitud: obj[3].data.slot1[i][0], longitud: obj[3].data.slot1[i][1] };
				    }
			      }
			      else {
			      	lugar.estado = "Lugar no existe";
			      	lugar.valido = false;
			      	return lugar;
			      }

			      lugar.estado = "¡Lugar encontrado!"
			      lugar.valido = true;
  				  return lugar;
			  	}, function(err) {
					console.error('ERR', err);
					//alert("ERROR: No se pueden obtener los datos del lugar a buscar");
					return null;
			   	});
			},
			getLugar: function() {
				return lugar;
			},
		    getNombre: function() {
				return lugar.nombre;
			},
			setPeriodo: function(per) {
				periodo = per;
			},
			getPeriodo: function() {
				return periodo;
			}
	}
})

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}])

.service('ProcesadorOpciones', ['$localstorage', 'opciones', function($localstorage, opciones) {
	return {
		getDefault: function() {
			return {
			 	UrlConsulta: "https://salasusach.herokuapp.com/",
				Semestre: "2015-02",
				ModoOnline: false,
				Geolocalizacion: false
			};
		},
		setDefault: function() {
			$localstorage.setObject('opciones') = this.getDefault();
		},		
		getOpciones: function() {
  			if ($localstorage.getObject('opciones')) {
  				console.log("Cargando opciones guardadas...");
  				return $localstorage.getObject('opciones');
  			}
  			else {
  				console.log("Cargando opciones por defecto...");
  				return this.getDefault();
  			}
		},
		setOpciones: function(valores) {
			console.log("Guardando opciones...");
			$localstorage.setObject('opciones') = valores;
		}
	}
}]);