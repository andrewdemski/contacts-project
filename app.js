const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const app = express();
const sql = require('mssql');
const config = require('./config/keys').sqlConfig;

// Connect to MSSQL
sql
  .connect(config)
  .then(() => console.log('MSSQL Connected'))
  .catch(err => console.log(err));

//Set default number of contacts to display in dropdown ('-1' = 'All')
const storage = require('node-sessionstorage');
storage.setItem('display', '-1');
   
// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', require('./routes/index.js'));
app.use('/contacts', require('./routes/contacts.js'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
