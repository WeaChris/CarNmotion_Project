const routes = require('./server/routes/routes')
const express = require('express');
const bodyParser= require("body-parser");
const exphbs = require("express-handlebars");
const handlebars = require("handlebars");

const app  = express();
const port = 3000;


//To start server press : npm run start

app.engine('hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));

handlebars.registerHelper('eachInMap', function (map, block) {
    var out = '';
    Object.keys(map).map(function (prop) {
        out += block.fn({ key: prop, value: map[prop] });
    });
    return out;
});

app.use('/' , routes); 

app.listen(port , ()=>{
    console.log(`Server is running on port : ${port}`);
});



