const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Product = require('./models/product');
const methodOverride = require('method-override');

mongoose.connect('mongodb://localhost:27017/farmStand', {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=> {
	console.log('MONGODB CONNECTION OPEN!!!');
})
.catch(err => {
	console.log('OH NO MONGO CONNECTION ERROR!!!');
	console.log(err);
})

const categories = ['fruit','vegetable','dairy'];

app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.get('/', (req,res)=> {
	res.redirect('/products');
})

app.get('/products', async (req,res) => {
	const { category } = req.query;
	if(category) {
		const allProduct = await Product.find({ category });
		res.render('products/index', {allProduct, category});		
	}
	else {
		const allProduct = await Product.find({});
		res.render('products/index', {allProduct, category:'All'});
	}
})

app.get('/products/new', (req,res) => {
	res.render('products/new',{categories});
})

app.post('/products',async (req,res)=> {
	const newProduct = new Product(req.body);
	await newProduct.save();
	res.redirect(`/products/${newProduct._id}`);
})

app.get('/products/:id', async (req,res) => {
	const {id} = req.params;
	const product = await Product.findById(id);
	res.render('products/show', {product});
})

app.get('/products/:id/edit', async (req,res) => {
	const {id} = req.params;
	const product = await Product.findById(id);
	res.render('products/edit', {product,categories});
})

app.put('/products/:id', async (req,res) => {
	const {id} = req.params;
	const product = await Product.findByIdAndUpdate(id, req.body, {runValidators: true, new: true});
	res.redirect(`/products/${product._id}`);
})

app.delete('/products/:id', async (req,res)=> {
	const {id} = req.params;
	const product = await Product.findByIdAndDelete(id);
	res.redirect('/products');
})

app.listen(8080, () => {
	console.log('LISTENING TO PORT 8080!!!')
})