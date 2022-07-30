const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');
const Story = require('../models/Story');
const moment  = require('moment');

// @desc Login/Landing page
// @route GET /
router.get('/', ensureGuest,  (req, res)=>{
    res.render('login.ejs', { layout: './layouts/login.ejs'});
});

// @desc Dashboard
// @route GET /dashboard  
router.get('/dashboard', ensureAuth, async (req, res)=>{
    try {
        const stories = await Story.find({ user: req.user.id }).lean();
        res.render('dashboard.ejs', {
            name: req.user.firstName,
            stories,
            moment: moment,

        });
    } catch (e) {
        console.error(e);
        res.render('error/500')
    }
});


module.exports = router;
