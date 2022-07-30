const express = require('express');
const morgan = require('morgan');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session); 
const expressLayouts = require('express-ejs-layouts');
const connectDB = require('./config/database');
const PORT = process.env.PORT || 3000;
const loginRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const storiesRoutes = require('./routes/stories');



// Load config
require('dotenv').config({ path: './config/config.env' });
// Load passport config
require('./config/passport')(passport)

connectDB();

// express Middlewares, layout
app.set('view enigne', 'ejs');
app.use(expressLayouts);
app.set('layout', './layouts/main.ejs');
app.use(express.urlencoded({ extended: false }));
// sesssion middleware
app.use(
  session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({ mongooseConnection: mongoose.connection})
    })
  );
// passport middleware
app.use(passport.session());
app.use(passport.initialize());
// setting the public folder to static
app.use(express.static('public'));
// parsing the data in json 
app.use(express.json());
// morgan middleware to check the connection logs in console in development mode
if(process.env.NODE_ENV === 'development') app.use(morgan('dev'));


// Routes
app.use('/', loginRoutes)
app.use('/auth', authRoutes)
app.use('/stories', storiesRoutes)



app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on ${PORT}`));