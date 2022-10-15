require('dotenv').config();
const express = require('express');
const FileUpload = require("express-fileupload");
const cors = require('cors')
const { engine } = require('express-handlebars');
const path = require('path');
const db = require('./src/config/bpjsDb');
const routes = require('./src/routes');
const bodyParser = require('body-parser');

const app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(FileUpload());

const http = require('http').createServer(app);

db.authenticate()
.then( () => 
    console.log(`\n=========== BPJS SERVICES CONNECTED ===========\nAPPLICATION HOST : www.bpjs.go.id\nAPPLICATION PORT : ${process.env.APP_PORT}\n\n`)
).catch(err => console.log("Error " + err))

app.use(cors({
  //origin : ["http://localhost:8080"], //process.env.CLIENT_URL,
  methods : "GET,POST,PUT,DELETE",
  credentials : true
}));

app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));

/* Handlebars Template Engine */
app.engine('handlebars', engine({ extname: '.handlebars', defaultLayout: "main"}));
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, './public')))

app.use('/api/services/bpjs/v1',routes);

http.listen(process.env.APP_PORT);