const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const verifyToken = require('./verify-token');
const cors = require('cors');
const formidable = require('formidable');
const fs = require('fs');


const app = express();
app.use(cors());
app.use(express.json());

//Schema for Users
const userSchema = new mongoose.Schema({
	username: String,
	email: String,
	password: String,
	mobileno: String,
	role: String,
	country: String
})


//model for Users
const userModel = new mongoose.model('users', userSchema);

const productSchema = new mongoose.Schema({
	productName: String,
	// productImage: String,
	description: String,
	quantity: Number,
	unitPrice: Number,
})

const productModel = new mongoose.model('products', productSchema);

const cartSchema = new mongoose.Schema({
	user_id: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
	product_id: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
	qtyInCart: Number,
	totalPrice: Number,
})

const cartModel = new mongoose.model('cartProducts', cartSchema);

let dummyRes = { "message": "Test Successful!" };

//Salt for Password Encryption
let salt = "Secret-Key";
let tokenKey = "Token-Key";

mongoose.connect("mongodb://127.0.0.1:27017/kabra_db", { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log("connected to database");
	})

app.post('/register', (req, res) => {
	let user = req.body;
	user.password = crypto.pbkdf2Sync(user.password, salt, 1000, 64, "sha512").toString("hex");

	let userObj = new userModel(user);
	userObj.save().then(() => {
		res.send({ "message": "User Registered" });
	})

})

app.post('/login', async (req, res) => {
	let userCredentials = req.body;
	userCredentials.password = crypto.pbkdf2Sync(userCredentials.password, salt, 1000, 64, "sha512").toString("hex");
	let userCount = await userModel.find(userCredentials).countDocuments();
	if (userCount == 1) {
		let userinfo = await userModel.findOne(userCredentials);
		jwt.sign(userCredentials, tokenKey, (err, token) => {
			if (err !== null) {
				res.send({ message: "Some Problem! Try after some time", code: 0 })
			}
			else {
				res.send({ token: token, user: userinfo, code: 1 });
			}
		})
	}
	else {
		res.send({ message: "Wrong Username or Password", code: 0 })
	}

	// console.log(userCount);
	// res.send(userCredentials);
})


app.get('/me', verifyToken, async (req, res) => {

	let me = await userModel.find({ username: req.user.username });

	res.send(me);
})

app.post('/product', verifyToken, (req, res) => {
	let product = req.body;

	// let form = new formidable.IncomingForm();
	// form.parse(req, function (err, data, files) {
	// 	console.log(files.picture.path);
	// 	let tempPath = files.picture.path;
	// 	let newPath = "./pics/hello.jpg"

	// 	fs.rename(tempPath, newPath, function () {
	// 		res.send({ message: "done" });
	// 	})
	// });





	let productObj = new productModel(product);
	productObj.save().then(() => {
		res.send({ "message": "Product Created" });
	})

})

app.get('/products', verifyToken, async (req, res) => {
	let products = await productModel.find();
	// console.log(products);
	res.send(products);
})

app.post('/cart', verifyToken, (req, res) => {
	let cartProduct = req.body
	let cartProductObj = new cartModel(cartProduct);
	cartProductObj.save().then(() => {
		res.send({ "message": "Added to Cart" });
	})
})

app.get('/cart/:user_id', verifyToken, async (req, res) => {
	let user_id = req.params.user_id;
	console.log(user_id);
	let cartProduct = await cartModel.find({ "user_id": user_id }).populate('product_id');
	// console.log(cartProduct);
	res.send(cartProduct);
})
app.put('/cart/:id', verifyToken, async (req, res) => {
	let id = req.params.id;
	let updateProduct = req.body;
	cartModel.updateOne({ "_id": id }, { $set: updateProduct }).then(() => {
		res.send({ "message": "Cart updated successfully" });
	})
})

app.delete('/cart/:id', verifyToken, async (req, res) => {
	let id = req.params.id;
	cartModel.deleteOne({ "_id": id }).then(() => {
		res.send({ "message": "Product deleted from the Cart" })
	})
})
// Start the server 
app.listen(8000);

