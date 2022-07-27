const express = require('express');
const router = express.Router();

// @desc Login/Landing page
// @route GET /
router.get('/', (req, res)=>{
    res.render('login.ejs', { layout: './layouts/login.ejs'})
})


// @desc Dashboard
// @route GET /dashboard  
router.get('/dashboard', (req, res)=>{
    res.render('dashboard.ejs')
})
module.exports = router;