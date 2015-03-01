angular.module('starter.services', [])

.factory('GETservice', function($http, $q) {
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
	var urlBase = "https://salasusach.herokuapp.com/";
	var periodo = "2015-01";

	return {
			fetchLugar: function(input) {
			  url1 = urlBase + "/lugar/buscar/" + input;
			  url2 = urlBase + "/coordenada/buscar/" + input;
			  url3 = urlBase + "/coordenadas/minimo/" + input;
			  url4 = urlBase + "/coordenadas/largo/" + input;

				var req0 = $http.get(url1);
				var req1 = $http.get(url2);

				return $q.all([req0, req1]).then(function(obj) {
			      if (obj[0].data.instance === 'Just') {
			        lugar.nombre = obj[0].data.slot1.nombre;
			        lugar.piso = obj[0].data.slot1.piso;
			        lugar.tipo = obj[0].data.slot1.tipo;
			        console.log(lugar.nombre);
			        console.log(lugar.piso);
			        console.log(lugar.tipo);
			      }
			      else {
			      	lugar.estado = "Lugar no existe";
			      	lugar.valido = false;
			      	return lugar;
			      }

			      if (obj[1].data.instance === 'Just') {
			        lugar.latitud = obj[1].data.slot1.latitud;
			        lugar.longitud = obj[1].data.slot1.longitud;
			        console.log(lugar.latitud);
			        console.log(lugar.longitud);
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
					alert("ERROR: No se pueden obtener los datos del lugar a buscar");
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
});