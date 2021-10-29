const express = require('express');
const morgan = require('morgan');
const multer = require('multer');
const path = require('path');
const exphbs = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const Handlebars = require('handlebars');
//Inicializaciones
const app = express();
require('./database');
//setting
app.set('port',process.env.PORT || 3000);

app.set('views',path.join(__dirname, 'src/views'));

//configurando el motor de plantilla
app.engine('.hbs',exphbs({
    //es para decirle cual es el archivo html que tiene las partes en común
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'),'partial'),
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    extname:'.hbs'

}));
app.set('view engine','.hbs');

//Configurando Midlewars
app.use(morgan('dev'));
//para que pueda entender los datos json
app.use(express.json());
//sirve para entender los datos que se suben a travéz del formulario, pero nada pesado como las imagenes
//-> para eso esta multer
app.use(express.urlencoded({extended: false}));
const storage = multer.diskStorage({
    //Ubicación de donde se guardaran las imagenes
    destination: path.join(__dirname, 'src/public/img/uploads'),
    // file -> Contiene toda la informacón de la imagen
    //file.originalname -> obtiene el nombre original de la imagen
    //path.extname(file.originalname) -> obtiene la extensión de la imagen (png,jpg,etc)
    filename:(req, file, callback) =>{
        callback(null,new Date().getTime()+path.extname(file.originalname));
    }
    
});
//procesa cada vez que pasamos una imagen
app.use(multer({storage}).single('image'));
// static files
app.use(express.static(path.join(__dirname, 'public')));
//Routes
app.use(require('./src/routers'));
module.exports = app;