const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const session = require('express-session');

// Load environment variables
dotenv.config();

const app = express();

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'cse340-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 3600000 } // 1 hour
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
const baseController = require('./controllers/baseController');
const inventoryRoute = require('./routes/inventoryRoute');

// Home route
app.get('/', baseController.buildHome);

// Inventory routes
app.use('/inv', inventoryRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  let nav = [];
  const errMsg = err.message || 'Server Error';
  const errStatus = err.status || 500;
  
  console.error(`Error at "${req.originalUrl}": ${errMsg}`);
  
  res.status(errStatus).render('errors/error', {
    title: `Error ${errStatus}`,
    message: errMsg,
    nav: nav
  });
});

// 404 handler
app.use((req, res) => {
  let nav = [];
  res.status(404).render('errors/error', {
    title: '404 - Page Not Found',
    message: 'Sorry, the page you requested could not be found.',
    nav: nav
  });
});

// Use Render's port or default to 3000
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});