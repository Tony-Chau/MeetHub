//Initialising express and other functions/APIs
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
var tools = require('./Route/functions/tools.js');
//Ports
const server_setup = {
    hostname: '127.0.0.1',
    port : 3000
}
const mainRouter = require('./Route/mainRoute.js'); 

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'views')));
app.use(bodyParser.json());

//Home Page
app.use('/', mainRouter);

app.listen(server_setup.port, function(){
    console.log(`Express app listening at http://${server_setup.hostname}:${server_setup.port}/`);
});
