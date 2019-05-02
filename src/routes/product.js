const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const Product = require('../model/products');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'))
        }
        callback(null, true)
    }
}).any()


router.get('/', (req, res) => {
      res.render('product.ejs')
});

//select the product details form DB by id 
router.get('/profile/:id', (req, res) => {
      const message = "";
      const id = req.params.id;
      //finding the data by id
      Product.findById(id)
            .exec()
            .then(doc => {
                  res.render('profile.ejs', { data: doc, message: message });
            })
            .catch(err => console.log(err));
});

//getting product info form web page
router.post('/', urlencodedParser, (req, res) => {
      console.log(req.files);
      upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                console.log(err);
            } else if (err) {
                // An unknown error occurred when uploading.
                console.log(err)
            }
             // Everything went fine.
            if((req.files).length > 0){
                  const product = new Product({
                        _id: new mongoose.Types.ObjectId(),
                        productName: req.body.product_name,
                        image1: req.files[0].originalname,
                        image2: req.files[1].originalname,
                        image3: req.files[2].originalname,
                        price: req.body.price,
                        quantity: req.body.quantity
                    })
                    
                    product
                        .save()
                        .then(result => {
                              console.log(result);
                              res.redirect('product/profile/' + result._id);
                    
                        })
                        .catch(err => console.log(err));
            }
            else{
                console.log("Empty array");
            }
      })
});

module.exports = router;