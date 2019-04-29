const express = require('express');
const db = require('../module/db');
const router = express.Router();
const bodyParser = require('body-parser');
const pdfMake = require('../../pdfmake/pdfmake');
const vfsFonts = require('../../pdfmake/vfs_fonts');

pdfMake.vfs = vfsFonts.pdfMake.vfs;

const urlencodedParser = bodyParser.urlencoded({ extended: false });

const redirectLogin = (req, res, next) => {
    if (!req.session.user) {
        res.redirect('/');
    }
    else {
        next();
    }
}

const redirectHome = (req, res, next) => {
    if (req.session.user) {
        res.redirect('/home');
    }
    else {
        next();
    }
}

router.get('/', redirectHome, (req, res) => {
    res.sendFile('/login.html', { root: './views' })
});

router.post('/', urlencodedParser, function (req, res) {
    const { username, password } = req.body;
    db.connection.query("SELECT email, password FROM mysampletable", function (error, rows) {
        if (!!error) {
            console.log('Error in the query');
        }
        else {
            if (rows[0].email === username && rows[0].password === password) {
                console.log("login");
                req.session.user = username;
                res.redirect('/product');
            }
            else {
                res.redirect('/');
            }
        }
    });
});

router.get('/home', redirectLogin, (req, res) => {
    res.sendFile('/home.html', { root: './views' })
});

router.post('/logout', redirectLogin, logout);

function logout(req, res) {
    console.log("logout");
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/product');
        }
        res.clearCookie('sid');
        res.redirect('/');

    });
}
router.post('/pdf', (req, res,)=>{
    var documentDefinition = {
        content: [
          {
            layout: 'lightHorizontalLines', // optional
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 1,
              widths: [ '*', 'auto', 100, '*' ],
      
              body: [
                [ 'First', 'Second', 'Third', 'The last one' ],
                [ 'Value 1', 'Value 2', 'Value 3', 'Value 4' ],
                [ { text: 'Bold value', bold: true }, 'Val 2', 'Val 3', 'Val 4' ]
              ]
            }
          }
        ]
      };

    const pdfDoc = pdfMake.createPdf(documentDefinition);
    pdfDoc.getBase64((data)=>{
        res.writeHead(200, 
        {
            'Content-Type': 'application/pdf',
            'Content-Disposition':'attachment;filename="filename.pdf"'
        });

        const download = Buffer.from(data.toString('utf-8'), 'base64');
        res.end(download);
    });

});


module.exports = router;
