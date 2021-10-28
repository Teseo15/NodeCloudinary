const Mongoose  = require("mongoose");

Mongoose.connect(process.env.MONGODB_URI,{
    useNewUrlParser : true
})
    .then(db => console.log('Base de datos conectada'))
    .catch(err => console.log('No se logró la conexión'))