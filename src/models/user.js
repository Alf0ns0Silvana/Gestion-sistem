const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const { Schema } = mongoose; // de mongoose requerimos a Schema

const userSchema = new Schema ({
    email: String,
    password: String,
}, {
    timestamps: true
})

// escriptar contraseña al registrar 
userSchema.methods.encryptPassword = (password) => { // llamo al esquema, defino .metodo.nombre (cualquier nombre), 
    // esta funcion recibe la contraseña y cuando la reciba la pasamos a bcrypt 
   return bcrypt.hashSync(password, bcrypt.genSaltSync(10)) // gentSS guarda la cantidad de veces que se ejecuta el algoritmo p/cifrar
};

// comparar contraseña cifrada al loguearse luego del registro 
userSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};
// userSchema.methods.comparePassword = (password) => {
//     return bcrypt.compareSync(password, this.password)
// } Error: incorrect arguments, explicacion: cuando intentas acceder a this.password dentro de la función de flecha, 
// this no se refiere al objeto user, y por lo tanto, this.password es undefined, lo que causa el error 
// "Incorrect args" cuando intentas comparar la contraseña. En => () el valor de this dentro se refiere 
// al contexto global en lugar del objeto user al que pertenece el método.

module.exports = mongoose.model( 'users', userSchema);
 // .model le da un nombre y llama al esquema, crea y guarda los users con ese nombre