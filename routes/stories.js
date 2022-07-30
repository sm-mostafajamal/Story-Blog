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
        res.render('error/500.ejs');
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
            },
            editIcon: function(storyUser, loggedUser, storyId, floating = true){
                if(storyUser._id.toString() == loggedUser._id.toString()){
                    if(floating){
                        return `<a href="/stories/edit/${storyId}" class = "btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`
                    }else{
                        return `<a href="/stories/edit/${storyId}"><i class="fas fa-edit"></i></a>`
                    }
                }else{
                    return ''
                }
            }
        })
    } catch (err) {
        console.error(err);
        res.render('error/500.ejs');
    }
});


// @desc show edit page
// @route GET /stories/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res)=>{
    const story = await Story.findOne({
        _id: req.params.id
    }).lean();

    if(!story) res.render('error/404.ejs');
    if(story.user != req.user.id) res.redirect('/stories');
    else res.render('stories/edit.ejs', { story });
});

// @desc Update story 
// @route PUT /stories/:id
router.put('/:id', ensureAuth, async (req, res)=>{
    let story = await Story.findById(req.params.id).lean();

    if(!story) res.render('error/404.ejs');
    if(story.user != req.user.id) res.redirect('/stories');
    else {story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true
        });

        res.redirect('/dashboard');
    }
});

module.exports = router;


