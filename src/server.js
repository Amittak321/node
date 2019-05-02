const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();

//Connection to mongoDB Atlas
mongoose.connect('mongodb+srv://amit:ajmer@hackgod-4akca.mongodb.net/test?retryWrites=true',
    {
        useNewUrlParser: true
    })
    .then(result => {
        console.log("Connected");
    }
    )
    .catch(err => console.log(err));

app.set('view engine', 'ejs');
app.use('/', require('./routes/index'));
app.use('/product', require('./routes/product'));
app.use('/', express.static(path.join(__dirname, '../views')));
//app.use('/' , express.static(path.join(__dirname , '../views/css')));
app.use('/', express.static(path.join(__dirname, '../public')));

module.exports = {
    app
}