const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const session = require('express-session');

// Load environment variables
dotenv.config();

const app = express();   // Create app FIRST

// Now require routes
const reviewRoute = require("./routes/reviewRoute");
const baseController = require('./controllers/baseController');
const inventoryRoute = require('./routes/inventoryRoute');

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'cse340-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 3600000 }
}));

// Middleware for form data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Flash messages middleware
app.use((req, res, next) => {
  res.locals.messages = req.session.messages || {};
  req.session.messages = {};
  next();
});

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', baseController.buildHome);

app.use('/inv', inventoryRoute);
app.use('/review', reviewRoute);   // Use AFTER app is created

// Error handling middleware
app.use((err, req, res, next) => {
  const errMsg = err.message || 'Server Error';
  const errStatus = err.status || 500;

  console.error(`Error at "${req.originalUrl}": ${errMsg}`);

  res.status(errStatus).render('errors/error', {
    title: `Error ${errStatus}`,
    message: errMsg,
    nav: []
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('errors/error', {
    title: '404 - Page Not Found',
    message: 'Sorry, the page you requested could not be found.',
    nav: []
  });
});

// Render port
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
