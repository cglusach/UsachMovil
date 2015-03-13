# Lineamientos para contribuir a USACH Móvil

Creado por Daniel Gacitúa (daniel.gacitua[arroba]usach[punto]cl) el 10/03/2015

Este texto es redactado para que todos los desarrolladores y colaboradores de USACH Móvil tengan una serie de reglas comunes para contribuir código con el proyecto.

## Sobre los Errores, Bugs y Problemas

Cualquier error, bug o problema con la aplicación, debe ser reportada como un [issue](https://github.com/cglusach/UsachMovil/issues). El issue debe incluir la descripción del problema y la plataforma sobre la cual ocurrió el error (Android, iOS, etc). El equipo desarrollador intentará solucionar el problema y actualizará la aplicación según corresponda.

## Sobre las solicitudes de nuevas características

Si se desea solicitar una nueva característica, se debe reportar como un [issue](https://github.com/cglusach/issues), indicando con la mayor cantidad de detalles la característica a pedir. El equipo desarrollador se reserva el derecho de admitir o rechazar características dependiendo de la factibilidad técnica.

## Sobre los aportes en código y los "Pull Requests"

Para aportar con código a USACH Móvil (para solucionar problemas y/o añadir nuevas características), primero debes hacer un Fork del repositorio principal, implementar los aportes en el fork, y luego levantar un "Pull Request" al repositorio principal. El equipo desarrollador revisará el Pull Request y aceptará el código si éste significa un aporte para la aplicación.

## Sobre el versionamiento (para Mantenedores)

Para los Mantenedores del repositorio principal, los commits marcados para publicación en los Stores deben ir marcados con un tag que identifique su versión y fecha de publicación.

Por ejemplo:

	$ git tag -a 1.1.0 -m "28/03/2015"
	$ git push origin --tags

Marcará al último commit con un tag de versión 1.1.0, que fue publicado el 28 de marzo del 2015 y subirá el tag al repositorio.

Sobre el número de versión, se usará el siguiente esquema para el incremento de versiones:

	A.B.C

> Donde A es el número de versión mayor (cambios del roadmap a largo plazo), B es el número de versión medio (cambios del roadmap a corto plazo) y C es el número de versión menor (arreglos de errores y cambios menores).

El incremento de versión se debe incluir en el archivo config.xml para que pueda ser visible en los Stores.