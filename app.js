const express = require("express");
const app = express();
const PORT = 4000;
const ejs = require('ejs');
const bcyrpt = require('bcrypt');
const saltround = 10;


app.use(express.static('public'));

const bodyparser = require("body-parser");


app.use(express.static('public'));

var session = require('express-session');
app.use(session({secret : 'ashid'}));




app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({extended: true}));

app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));
app.use('/', require('./server/routes/manager'));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});











