USACH Móvil
===========

USACH Móvil es una aplicación móvil que pretende ayudar a los estudiantes de la Universidad de Santiago de Chile (USACH) a realizar algunas tareas cotidianas dentro del campus.

Dentro de sus utilidades se destaca:

* Geolocalización de Salas (cortesía de la aplicación web "Salas USACH" de Felipe Garay)
* Atajos rápidos a las páginas web principales de la USACH (Bibliotecas, LOA, Radio, etc.)

Aplicación desarrollada por el Equipo de Desarrollo de Comunidad GNU/Linux USACH para el uso general de la comunidad universitaria.

El Equipo de Desarrollo está compuesto por:

* Daniel Gacitúa (Jefe de Proyecto)
* Jonás Varas (Jefe de Desarollo)
* Ricardo Abarza
* Ian Orellana
* María José Vera
* René Zárate

Compilando USACH Móvil
----------------------

Para compilar la aplicación se necesita un PC con las siguientes dependencias:

* Node.js
* Apache Cordova
* Ionic Framework
* Android SDK (versión 22)

Después de clonar el repositorio, ejecuta los siguientes comandos para compilar:

	$ ionic platform add android
	$ cordova plugin add org.apache.cordova.inappbrowser
	$ cordova plugin add org.apache.cordova.geolocation
	$ cordova plugin add https://github.com/brodysoft/Cordova-SQLitePlugin.git
	$ ionic build android
	$ ionic run android

Contáctanos
-----------

Si te interesa la aplicación, tienes sugerencias o encontraste un fallo; puedes reportar un [issue](https://github.com/cglusach/UsachMovil/issues) o contactarnos a: cgl[arroba]usach[punto]cl

Recuerda revisar nuestros lineamientos (CONTRIBUTING.md) para saber como aportar correctamente al Proyecto.