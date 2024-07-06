const express = require('express');
const cors = require('cors');
const booksRouter = require('./routers/booksRouter');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());

const corsOptions = {
  origin: 'http://localhost:8081', // Corrected the origin URL
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Set up static files and views directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve styles.css file
app.use('/styles', express.static(path.join(__dirname, 'styles')));

// Serve assets
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));


app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// Use the books router for /api/books endpoint
app.use('/api/books', booksRouter);
app.use('/books', booksRouter);

// Routes
app.get('/', (req, res) => {
  res.render('LoginPage.html');
});

// Routes
app.get('/user', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'user.html'));
});

app.get('/explore', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'explore.html'));
});

app.get('/bill', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'bill.html'));
});


app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

app.get('/admininventory', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admininventory.html'));
});

app.get('/tables-data', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'tables-data.html'));
});

app.get('/addbook' , (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'addbook.html'))
});



// New route for generating charts
app.get('/charts', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'charts.html'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
