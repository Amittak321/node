const express = require('express');
const path = require('path');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const ejs = require('ejs');
const app = express();

const TWO_HOURS = 1000 * 60 * 60 * 2;
const {
    PORT = 4000,
    NODE_ENV = 'development',
    SESS_LIFETIME = TWO_HOURS,
    SESS_NAME = 'sid',
    SESS_SECRIT = 'iloveit'

} = process.env
const IN_PROD = NODE_ENV === 'production';

app.use(session({
    name: SESS_NAME,
    resave: false,
    saveUninitialized: false,
    secret: SESS_SECRIT,
    cookie: {
        maxAge: SESS_LIFETIME,
        sameSite: true,
        secure: IN_PROD
    }
}));


app.set('view engine', 'ejs');
app.use(fileUpload());
app.use('/', require('./routes/index'));
app.use('/product', require('./routes/product'));
app.use('/' , express.static(path.join(__dirname , '../views')));
//app.use('/' , express.static(path.join(__dirname , '../views/css')));
app.use('/' , express.static(path.join(__dirname , '../public')));

//app.use('/' , express.static(path.join(__dirname)));

module.exports = {
    app
}