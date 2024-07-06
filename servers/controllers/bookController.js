const db = require('../models');

const getAllBooks = async (req, res) => {
  try {
    const books = await db.Book.findAll();
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const purchaseBook = async (req, res) => {
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
};

const addNewBook = async (req, res) => {
  const { title, author, genre, price } = req.body;
  try {
    const newBook = await db.Book.create({
      title,
      author,
      genre,
      price,
      availability: 'In Stock'
    });
    res.json(newBook);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateBook = async (req, res) => {
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
    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getAllBooks,
  purchaseBook,
  addNewBook,
  updateBook,
};
