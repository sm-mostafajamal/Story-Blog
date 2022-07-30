const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
const Story = require('../models/Story');

// @desc show add page
// @route GET /stories/add
router.get('/add', ensureAuth,  (req, res)=>{
    res.render('stories/add.ejs');
});

// @desc Process the add form
// @route POST /stories
router.post('/', ensureAuth, async (req, res)=>{
    try {
        req.body.user = req.user.id;
        await Story.create(req.body);
        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.render('error/500');
    };
});

// @desc Show all stories
// @route GET /stories
router.get('/', ensureAuth, async (req, res)=>{
    try {
        const stories = await Story.find({ status: "public" })
                        .populate('user')
                        .sort({createdAt: 'desc'})
                        .lean()
        res.render('stories/index.ejs', {
            stories,
            truncate: function(str,len){
                if(str.length > len && str.length >0) {
                    let new_str = str + ' ';
                    new_str = str.substr(0, len);
                    new_str = str.substr(0, new_str.lastIndexOf(' '));
                    new_str = new_str.length > 0 ? new_str : str.substr(0, len);
                    return new_str + '...' ;
                }
                return str;
            },
            stripTags: function(input) {
                return input.replace(/<(?:.|\n)*?>/gm, '')
            }
        })
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
});

module.exports = router;


