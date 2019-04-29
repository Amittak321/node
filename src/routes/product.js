const express = require('express');
const db = require('../module/db');
const router = express.Router();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/', (req, res) => {
      res.render('product.ejs')
})

//select the product details form DB by id 
router.get('/profile/:id', (req, res) => {
      const message ="";
      const id = req.params.id;
      const sql = "SELECT * FROM `product` WHERE `id`='" + id + "'";
      db.connection.query(sql, function (err, result) {
            if (result.length <= 0) {
                  message = "Profile not found!";
            }
            res.render('profile.ejs', { data: result ,message:message });
      });
})

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
                        var sql = "INSERT INTO `product`(`product_name`,`image`,`image2`,`image3`,`price`,`quantity`) VALUES ('" + product_name + "','" + img_name + "','" + img_name2 + "','" + img_name3 + "','" + price + "','" + quantity + "')";

                        db.connection.query(sql, function (err, result) {
                              res.redirect('product/profile/' + result.insertId);
                        });
                  });
            }
            else{
                  message = "select image only";
                  res.render('product', { message:message});
            }
      }
})

module.exports = router;