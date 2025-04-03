const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Category = require('./models/Category');
const Product = require('./models/Product');

const app = express();
app.use(bodyParser.json());

// Kết nối đến MongoDB
mongoose.connect('mongodb://localhost:27017/yourDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

// API để lấy tất cả sản phẩm theo category
app.get('/slug/:category', async (req, res) => {
  try {
    const categorySlug = req.params.category;
    const category = await Category.findOne({ slug: categorySlug });

    if (!category) {
      return res.status(404).send('Category not found');
    }

    const products = await Product.find({ category: category._id });
    res.json(products);
  } catch (err) {
    res.status(500).send(err);
  }
});

// API để lấy sản phẩm theo category và slug sản phẩm
app.get('/slug/:category/:product', async (req, res) => {
  try {
    const categorySlug = req.params.category;
    const productSlug = req.params.product;

    const category = await Category.findOne({ slug: categorySlug });
    if (!category) {
      return res.status(404).send('Category not found');
    }

    const product = await Product.findOne({ slug: productSlug, category: category._id });
    if (!product) {
      return res.status(404).send('Product not found');
    }

    res.json(product);
  } catch (err) {
    res.status(500).send(err);
  }
});

// API để tạo category mới
app.post('/category', async (req, res) => {
  try {
    const { name } = req.body;
    const category = new Category({ name });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).send(err);
  }
});

// API để tạo product mới
app.post('/product', async (req, res) => {
  try {
    const { name, categoryId } = req.body;
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).send('Category not found');
    }

    const product = new Product({ name, category: category._id });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Khởi động server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
