const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const baseController = require('./controllers/baseController');
const inventoryRoute = require('./routes/inventoryRoute');

// Home route
app.get('/', baseController.buildHome);

// Inventory routes
app.use('/inv', inventoryRoute);

// Account route placeholder
app.get('/account', (req, res) => {
  let nav = [];
  res.render('account', {
    title: 'My Account | CSE Motors',
    nav
  });
});

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

const PORT = 3001;
app.listen(PORT, () => console.log(`Server: http://localhost:${PORT}`));