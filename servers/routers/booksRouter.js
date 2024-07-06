const express = require('express');
const router = express.Router();
const db = require('../models');

//get books
router.get('/', async (req, res) => {
  try {
    const books = await db.Book.findAll(); // Access the Book model using db.Book
    res.json(books);
  } catch (error) {
    console.error(error); // Log the error to the console for debugging
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to get available books by genre
router.get('/inventory-by-genre', async (req, res) => {
  try {
    const genres = await db.Book.findAll({
      attributes: ['genre', [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']],
      where: { availability: 'In Stock' },
      group: ['genre'],
    });
    res.json(genres);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Endpoint to get inventory status distribution for Pie Chart
router.get('/status-pie-chart', async (req, res) => {
  try {
    const statusCounts = await db.Book.findAll({
      attributes: ['availability', [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']],
      group: ['availability'],
    });
    res.json(statusCounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Purchase Book
router.post('/purchase', async (req, res) => {
  const { title } = req.body;
  try {
    const book = await db.Book.findOne({ where: { title } });
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    if (book.availability === 'In Stock') {
      book.availability = 'Out of Stock';
      await book.save();
      return res.json(book);
    } else {
      return res.status(400).json({ error: 'Book is already out of stock' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add New Book
router.post('/add-book', async (req, res, next) => {
  try {
    // Extract book details from the form submission
    const { title, author, genre, price } = req.body;

    // Create a new book in the database
    const newBook = await db.Book.create({
      title,
      author,
      genre,
      price,
      availability: 'In Stock', // Assuming the default availability is 'In Stock'
    });

    // Optionally, you can send a response back to the client
    res.redirect('/tables-data');
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Update Book Information
router.put('/update-book/:id', async (req, res) => {
  const { id } = req.params;
  const { title, author, genre, price } = req.body;
  try {
    const book = await db.Book.findByPk(id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    book.title = title;
    book.author = author;
    book.genre = genre;
    book.price = price;

    await book.save();
    return res.json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//genre specified segregation in user.html file 
router.get('/genre/:genre', async (req, res) => {
  const { genre } = req.params;
  try {
    const books = await Book.findAll({
      where: {
        genre: genre,
        availability: 'In Stock', // Assuming there's a field called 'availability' in your Book model
      },
    });
    res.render('genre.html', { books, genre });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;


// Endpoint to get data for generating charts
router.get('/api/charts', async (req, res) => {
  try {
    const genres = await db.Book.findAll({
      attributes: ['genre', [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']],
      where: { availability: 'In Stock' }, // Fetch available books
      group: ['genre'],
    });

    const statusCounts = await db.Book.findAll({
      attributes: ['availability', [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']],
      group: ['availability'],
    });

    res.json({ genres, statusCounts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
