/*
   La función crearUsuario nos permite dar de alta un usuario en el directorio de GSuite. 
   Al mismo tiempo lo añadiremos a un grupo existente y actualizaremos su imagen de perfil
   La función recibe un objeto con la informació del usuario:
   
   var datosUsuario = {};
   datosUsuario.dni = '40677829R';
   datosUsuario.nombre = 'Nombre';
   datosUsuario.apellidos = 'Apellido1 Apellido2';
   datosUsuario.usuario = 'usuario';
   datosUsuario.grupo = 'grupo';
   
   El DNI se utiliza para buscar en Drive la imagen que asociaremos al usuario
*/

function crearUsuario(datosUsuario){
  var dominio = "@dominio_propio";

  try{
     //Creamos un objeto con los datos del usuario
     var user = {
       primaryEmail: datosUsuario.usuario + dominio,
       name: {
         givenName: datosUsuario.nombre,
         familyName: datosUsuario.apellidos,
         fullName: datosUsuario.nombre + " " + datosUsuario.apellidos
       },
       password: "123456",
       changePasswordAtNextLogin: true,
       orgUnitPath: "/Alumnado"
     };
     //Llamamos al metodo INSERT de la API de USUARIOS de Google
     user = AdminDirectory.Users.insert(user);
  
     //Añadimos el usuario al grupo
     var miembro = {
       email: datosUsuario.usuario + dominio,
       role: 'MEMBER'
     };
  
     //Llamamos al método INSERT de la API de GRUPOS de Google
     miembro = AdminDirectory.Members.insert(miembro, datosUsuario.grupo + dominio);
  
     actualizarFotoUsuario(datosUsuario);
  }
  catch(err){
     Logger.log(err.toString());
  }
}

/*
  La función actualizarFotoUsuario se encarga de localizar una imagen cuyo nombre es el DNI con extensión JPEG.
  Convertimos la imagen a formato Base64 para poder actualizar la imagen de perfil
*/
function actualizarFotoUsuario(datosUsuario){
  var dominio = "@dominio_propio";
  try{
     var userEmail = datosUsuario.usuario + dominio;
     var fileName  = datosUsuario.dni + ".jpg";  
     var blob = DriveApp.getFilesByName(fileName).next().getBlob();
     var data = Utilities.base64EncodeWebSafe(blob.getBytes());
    
     //Llamamos al método UPDATE de la API de FOTOS de los usuarios de Google
     AdminDirectory.Users.Photos.update({photoData: data}, userEmail);
  }
  catch(err) {
    Logger.log(err.toString());
  }  
}

/*
  La función buscarUsuario nos permite saber si un usuario está o no creado en nuestro directorio de GSuite
*/
function buscarUsuario(datosUsuario){
  var userEmail = datosUsuario.usuario+"@dominio_propio";
  try{
     //Llamamos al método GET de la librería USERS de Google
     var user = AdminDirectory.Users.get(userEmail);
     return true;  
  }
  catch(err) {
    //Si se ha producido algun error en la llamada al método GET devolvemos FALSE
    //Si no encuentra el usuario el método GET devuelve un error
    return false;
  }
}

