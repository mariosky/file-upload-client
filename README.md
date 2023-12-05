
# File Upload Client

Este es el componente del lado del cliente para el proyecto 4, está implementado 
utilizando el freamwork de  React.

El proyecto se basa en el blog post de Radoslav Georgiev
[Direct to S3 file upload with Django](https://www.hacksoft.io/blog/direct-to-s3-file-upload-with-django).
En el ejemplo de Georgiev se incluye la implementación se carga de archivs a `AWS S3` utilizando Django. 
En este caso, además de subir el archivo también vamos a procesar la imgen. 

Para ejecutar el componente solo es cuestión de instalar los requerimientos con 
el cláscio `npm install` y agregar la variable de entorno `REACT_APP_BACKEND_URL`,
es importante aclarar que por la misma [naturaleza de React](https://create-react-app.dev/docs/adding-custom-environment-variables/) 
el valor de las variables de entorno se copian al html generado y son visibles públicamente.

Puedes ejecutar el servidor de esta manera:
```
REACT_APP_BACKEND_URL=http://<host>:<port> npm start
```
