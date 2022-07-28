const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');

// @desc Login/Landing page
// @route GET /
router.get('/', ensureGuest,  (req, res)=>{
    res.render('login.ejs', { layout: './layouts/login.ejs'});
});

// @desc Dashboard
// @route GET /dashboard  
router.get('/dashboard', ensureAuth, (req, res)=>{
    res.render('dashboard.ejs', {
        name: req.user.firstName,
    });
});


module.exports = router;