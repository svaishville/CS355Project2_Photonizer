var express = require('express');
var router  = express.Router();
var db   = require('../models/db');



/* View all users in a <table> */
router.get('/list', function (req, res) {
    db.GetUsers(function (err, result) {
            if (err) throw err;
            res.render('userList.ejs', {rs: result, newuser: req.query.newuser});
        }
    );
});

/* View all Users and their info in a <table> */
router.get('/allusersinfo', function (req, res) {
    db.GetEmail(function (err, result) {
            if (err) throw err;
            res.render('displayAllUsersInfo.ejs', {rs: result});
        }
    );
});

/* Create a User */

// Create User Form
router.get('/create', function(req, res){
    res.render('userCreateForm.ejs', {action: '/user/create'});
});

// Save User to the Database
router.post('/create', function (req, res) {
    db.InsertUser( req.body, function (err, result) {
            if (err) throw err;

            if(result.UserID != 'undefined') {
                res.redirect('/user/list?newuser='+req.body.username);
			}
            else {
                res.send('User was not inserted.');
            }
        }
    );
});

/* View a single user's information */
/* COMPLETE */
router.get('/edit', function (req, res) {
	console.log(req.query.UserID);
    db.GetUser(req.query.UserID, function (err, result) {
            if (err) throw err;

            if(result.length > 0) {
				console.log('Username: ' + result[0].Username);
				var placeHolderValues = {
					userid: result[0].UserID,
					username: result[0].Username,
					name: result[0].Name
				};

            res.render('userEditForm.ejs', placeHolderValues);
			}
        }
    );
});

router.post('/save', function (req, res) {
	console.log('update User: ' + req.body.userid);
    db.UpdateUser( req.body, function (err, result) {
            if (err) throw err;

            if(result.UserID != 'undefined') {
                res.redirect('/user/list');
            }
            else {
                res.send('User was not inserted.');
            }
        }
    );
});

/* View all users in a <table> */
router.get('/editdropdown', function (req, res) {
    db.GetEmail(function (err, result) {
            if (err) throw err;
            res.render('displayUserDropDown18.ejs', {rs: result});
        }
    );
});

router.post('/view', function (req, res) {
	console.log('edit AccountID: ' + req.body.AccountID);
    db.GetAll( req.body.AccountID, function (err, result) {
            if (err) {
                throw err;
            }
            if(result.length > 0) {
				console.log('Username: ' + result[0].Username);
				var placeHolderValues = {
					accountid: result[0].AccountID,
					email: result[0].Email,
					password: result[0].Password,
					username: result[0].Username,
					fname: result[0].Fname,
					lname: result[0].Lname,
					bio: result[0].Bio
				};
				res.render('editSelectedUserAndPosts.ejs', placeHolderValues);
				//render handles empty result set
			}
        }
    );
});



module.exports = router;

