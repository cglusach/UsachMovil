angular.module('starter.services', [])

.factory('GETservice', function($http) {
	//en teoria si resulta la recoleccion de datos, deberia de estar latitud y longitud en dato.latitud, dato.longitud
	var dato = {
	  piso:'',
	  tipo:'',
	  nombre:'',
	  latitud:'',
	  longitud:''
	};
	var urlBase = "https://salasusach.herokuapp.com/";
	//por defecto
	var periodo = '2014-02';
	return {
		    //creamos una funcion la cual entra la variable "lugar" (con la sala o lugar) y retorna un dato, si es que existe en la DB
			getData: function(lugar) {
			  //URLs
			  url = urlBase + "coordenada/buscar/" +  lugar;
			  url2 = urlBase + "lugar/buscar/" +  lugar;
		      //La primera busqueda asegura que exista el lugar
			  return $http.get(url2).then(function(resp) {
				  //Si en la primera busqueda obtenemos un dato valido, asignamos su piso, tipo y nombre del lugar
				  if(resp.data.instance != "Nothing")
				  {
					  dato.piso = resp.data.slot1.piso;
					  dato.tipo = resp.data.slot1.tipo;
					  dato.nombre = resp.data.slot1.nombre;
				  }
				  //Si existe la sala o lugar entonces asignamos su latitud y longitud, en caso contrario dejamos vacios los campos
				  if(resp.data.instance == "Just")
				  {
						return $http.get(url).then(function(resp) {
						dato.latitud = resp.data.slot1.latitud;
						dato.longitud = resp.data.slot1.longitud;
						//DEBUG
						//alert("SUCCESS!");
						//alert(resp.data.slot1.longitud);
						//alert(dato.longitud);
						
						return dato;
					}, function(err) {
						console.error('ERR', err);
						alert("Conexion fallida");
						return null;
						// err.status will contain the status code
				   })  
				  }
				  else
				  {
					return null;
				  }
			  }, function(err) {
					console.error('ERR', err);
					alert("Conexion fallida");
					return null;
					// err.status will contain the status code
			   })
			},
			getDetalles: function() {
				return dato;
			},
			setPeriodo: function(per) {
				periodo = per;
			},
			getPeriodo: function() {
				return periodo;
			}
	}
});
