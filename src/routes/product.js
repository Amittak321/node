const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const Product = require('../model/products');

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
      const post = req.body;
      const product_name = post.product_name;
      const price = post.price;
      const quantity = post.quantity;

      if (!req.files) {
            return res.status(400).send('No files were uploaded.');
      }
      else {
            let message = "";
            const file = req.files.uploaded_image1;
            const file2 = req.files.uploaded_image2;
            const file3 = req.files.uploaded_image3;
            const img_name = file.name;
            const img_name2 = file2.name;
            const img_name3 = file3.name;

            if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif") {

                  file.mv('public/images/' + file.name, function (err) {

                        if (err) {

                              return res.status(500).send(err);
                        }
                        const product = new Product({
                              _id: new mongoose.Types.ObjectId(),
                              productName: product_name,
                              image1: img_name,
                              image2: img_name2,
                              image3: img_name3,
                              price: price,
                              quantity: quantity
                        })

                        product
                              .save()
                              .then(result => {
                                    console.log(result);
                                    res.redirect('product/profile/' + result._id);

                              })
                              .catch(err => console.log(err));
                  });
            }
            else {
                  message = "select image only";
                  res.render('product', { message: message });
            }
      }
});

module.exports = router;