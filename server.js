const express = require('express');
const morgan = require('morgan');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const connectDB = require('./config/database');
require('dotenv').config({ path: './config/config.env' });
const PORT = process.env.PORT || 3000;
const loginRoutes = require('./routes/index');

connectDB();

// Middlewares
app.set('view enigne', 'ejs');
app.use(expressLayouts)
app.set('layout', './layouts/main.ejs')

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));    
app.use(express.json());
if(process.env.NODE_ENV === 'development') app.use(morgan('dev'));


// Routes
app.use('/', loginRoutes)

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on ${PORT}`));