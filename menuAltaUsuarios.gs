/*
  Aquí vemos un ejemplo para crear un nuevo menú en una hoja de cálculo que nos permitirà dar de alta de forma automática
  una lista de usuarios.
  Partimos de una hoja de cálculo con las siguientes columnas
  DNI   ->   NOMBRE   ->   APELLIDOS   ->   USUARIO   ->   CONTRASEÑA   ->   GRUPO   ->   FECHA ACTUALIZACIÓN
  */
  
// La función onOpen se ejecuta automáticamente cuando detecta que abrimos la hoja de cálculo
// Se encarga de crear una nueva opción en los menús
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('GSuite')
      .addItem('Alta de usuarios', 'altaUsuarios')
      .addToUi();
}

/*
  La función AltaUsuarios se ejecuta cuando seleccionamos la opción creada en el menú
  Se encarga de recorrer las filas de la hoja de cálculo y hacer las llamadas correspondientes a las funciones
  que tenemos en el archivo adminDirectory.gs
*/
function altaUsuarios() {
  var datosUsuario = {};
  var fecha = new Date();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("USUARIOS");
  var data = sheet.getDataRange().getValues();
  
  for (var i = 1; i < data.length; i++) {
    datosUsuario.dni = data[i][0];
    datosUsuario.nombre = data[i][1];
    datosUsuario.apellidos = data[i][2];
    datosUsuario.usuario = data[i][3];
    datosUsuario.contrasena = data[i][4];
    datosUsuario.grupo = data[i][5];
    datosUsuario.fechaCreacion = data[i][6];
    
    // Comprobamos si anteriormente ya hemos creado el usuario
    if (datosUsuario.fechaCreacion.length==0) 
    {
       crearUsuario(datosUsuario);     
       //Indicamos la fecha en que se ha actualizado
       sheet.getRange(fila+1, 6).setValue(fecha);
  }
}
