// server.js
const express = require('express');
const { resolve } = require('path');
const bodyParser = require('body-parser');
const connectDB = require('./src/db'); // Import the DB connection
const Menu = require('./src/schema');  // Your Menu model
require('dotenv').config({path:'./src/.env'})
const app = express();
const port = 3013;
const url=process.env.db_url;


// Middleware
app.use(express.static('static'));
app.use(bodyParser.json());  // Parse JSON bodies

// Connect to the MongoDB database

// Serve the index page
app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

// POST /menu - Create a new menu item
app.post('/menu', async (req, res) => {
  const { name, description, price } = req.body;

  if (!name || !price) {
    return res.status(400).json({ error: 'Name and price are required' });
  }

  try {
    const menuItem = new Menu({ name, description, price });
    await menuItem.save();

    res.status(201).json({
      message: 'Menu item created successfully',
      menuItem,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error creating menu item' });
  }
});

// GET /menu - Get all menu items
app.get('/menu', async (req, res) => {
  try {
    const menuItems = await Menu.find();
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching menu items' });
  }
});

// PUT /menu/:id - Update an existing menu item
app.put('/menu/:id', async (req, res) => {
  
  const { name, description, price } = req.body;

  if (!name || !price) {
    return res.status(400).json({ error: 'Name and price are required' });
  }

  try {
    const menuItem = await Menu.findByIdAndUpdate(id, { name, description, price }, { new: true });

    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.status(200).json({
      message: 'Menu item updated successfully',
      menuItem,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error updating menu item' });
  }
});

// DELETE /menu/:id - Delete an existing menu item
app.delete('/menu/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const menuItem = await Menu.findByIdAndDelete(id);

    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.status(200).json({
      message: 'Menu item deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting menu item' });
  }
});

// Listen on port
app.listen(port, async() => {
  await connectDB(url);
    console.log(`Example app listening at http://localhost:${port}`);
  });
