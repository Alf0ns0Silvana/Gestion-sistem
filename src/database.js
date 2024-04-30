const  mongoose= require("mongoose");
const { mongodb } = require('./keys'); // requiero desde ruta keys al dato "mongodb", el cual es un obj que contiene URI
mongoose.connect(mongodb.URI, {}) // llamo a URI , {objeto de configuracion}
    .then(db  => console.log('Db Conectada')) // cuando se conecte mostrarme 
    .catch(err => console.log(err)) ; // si no logra conectarse, recibo error