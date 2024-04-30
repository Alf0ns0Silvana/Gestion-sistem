const  mongoose= require("mongoose");
const { mongodb } = require('./keys');
mongoose.connect(mongodb.URI, {})
    .then(db  => console.log('Db Conectada')) 
    .catch(err => console.log(err)) ; 