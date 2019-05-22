function crearUsuario(datosUsuario){
  var data = new Date();
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
     var membre = {
       email: datosUsuario.usuario + dominio,
       role: 'MEMBER'
     };
  
     //Llamamos al método INSERT de la API de GRUPOS de Google
     membre = AdminDirectory.Members.insert(membre, datosUsuario.grupo + dominio);
  
     actualitzarFotoUsuario(datosUsuario);
  }
  catch(err){
     Logger.log(err.toString());
  }
}

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

