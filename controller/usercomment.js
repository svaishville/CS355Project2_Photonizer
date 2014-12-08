var express = require('express');
var router  = express.Router();
var db   = require('../models/db');

/* View all users in a <table> */
router.get('/list', function (req, res) {
	console.log('PhotoID: ' + req.query.PhotoID);
    db.GetCommentsWithRatings(req.query.PhotoID, function (err, result) {
            if (err) throw err;
			console.log('result: ' + result);
            res.render('commentList.ejs', {rs: result, photoid: req.query.PhotoID});
        }
    );
});

// Create User Form
router.get('/create', function(req, res){
    db.GetUsers(function (err, result) {
            if (err) throw err;
			res.render('commentCreateForm.ejs', {rs: result, action: '/usercomment/create', photoid: req.query.PhotoID});
        }
    );

});

// Save User to the Database
router.post('/create', function (req, res) {
    db.InsertComment( req.body, function (err, result) {
            if (err) throw err;

            if(result.PhotoID != 'undefined') {
//                res.redirect('/usercomment/list');
			}
            else {
                res.send('Comment was not inserted.');
            }
        }
    );

    db.InsertRating( req.body, function (err, result) {
            if (err) throw err;

            if(result.PhotoID != 'undefined') {
//                res.redirect('/usercomment/list');
			}
            else {
                res.send('Rating was not inserted.');
            }
        }		
	);

    res.redirect('/usercomment/list/?PhotoID='+req.body.photoid);
});

module.exports = router;

