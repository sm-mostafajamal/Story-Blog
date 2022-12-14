const express = require('express');
const morgan = require('morgan');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session); 
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const cors = require('cors');
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
// Method override
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let  method = req.body._method
    delete req.body._method
    return method
  }
}))
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
// set global variable
app.use(function(req, res, next){
  res.locals.user = req.user || null
  next()
});
// setting the public folder to static
app.use(express.static('public'));
// parsing the data in json 
app.use(express.json());
// morgan middleware to check the connection logs in console in development mode
if(process.env.NODE_ENV === 'development') app.use(morgan('dev'));
// cors
app.use(cors());


// Routes
app.use('/', loginRoutes)
app.use('/auth', authRoutes)
app.use('/stories', storiesRoutes)



app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on ${PORT}`));