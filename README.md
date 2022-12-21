# Consigna Desafío 14: Loggers. gzip y analisis de performance
#### Backend CoderHouse

- Incorporar al proyecto de servidor de trabajo la compresión gzip.
- Verificar sobre la ruta /info con y sin compresión, la diferencia de cantidad de bytes devueltos en un caso y otro.
- Luego implementar loggueo (con alguna librería vista en clase) que registre lo siguiente:
    - Ruta y método de todas las peticiones recibidas por el servidor (info)
    - Ruta y método de las peticiones a rutas inexistentes en el servidor (warning)
    - Errores lanzados por las apis de mensajes y productos, únicamente (error)
- Considerar el siguiente criterio:
    - Loggear todos los niveles a consola (info, warning y error)
    - Registrar sólo los logs de warning a un archivo llamada warn.log
    - Enviar sólo los logs de error a un archivo llamada error.log
- Vamos a trabajar sobre la ruta '/info', en modo fork, agregando ó extrayendo un console.log de la información colectada antes de devolverla al cliente. Además desactivaremos el child_process de la ruta '/randoms'. Para ambas condiciones (con o sin console.log) en la ruta '/info' OBTENER:
    - El perfilamiento del servidor, realizando el test con --prof de node.js. Analizar los resultados obtenidos luego de procesarlos con --prof-process. 
    - Utilizaremos como test de carga Artillery en línea de comandos, emulando 50 conexiones concurrentes con 20 request por cada una. Extraer un reporte con los resultados en archivo de texto.
- Luego utilizaremos Autocannon en línea de comandos, emulando 100 conexiones concurrentes realizadas en un tiempo de 20 segundos. Extraer un reporte con los resultados (puede ser un print screen de la consola)
    - El perfilamiento del servidor con el modo inspector de node.js --inspect. Revisar el tiempo de los procesos menos performantes sobre el archivo fuente de inspección.
    - El diagrama de flama con 0x, emulando la carga con Autocannon con los mismos parámetros anteriores.
- Realizar un informe en formato pdf sobre las pruebas realizadas incluyendo los resultados de todos los test (texto e imágenes). 
- Se entrega una conclusion a partir del analisis de datos.


## Resultados:

En el presente challenge se encuentran como resultados las carpetas 0X y atillery, ademas que se anexa el docuemnto en pdf Challenge 14 Resultados donde se reportan imagenes de las pruebas ejecutadas.

