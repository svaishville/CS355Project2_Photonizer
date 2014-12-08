var express = require('express');
var router  = express.Router();
var db   = require('../models/db');

/* View all users in a <table> */
router.get('/list', function (req, res) {
    db.GetLenses(function (err, result) {
            if (err) throw err;
            res.render('lensList.ejs', {rs: result, newlens: req.query.newlens});
        }
    );
});

// Create User Form
router.get('/create', function(req, res){
    res.render('lensCreateForm.ejs', {action: '/lens/create'});
});

// Save User to the Database
router.post('/create', function (req, res) {
    db.InsertLens( req.body, function (err, result) {
            if (err) throw err;

            if(result.LensID != 'undefined') {
                res.redirect('/lens/list?newlens='+req.body.model);
			}
            else {
                res.send('Lens was not inserted.');
            }
        }
    );
});

/* View a single user's information */
/* COMPLETE */
router.get('/edit', function (req, res) {
	console.log(req.query.LensID);
    db.GetLens(req.query.LensID, function (err, result) {
            if (err) throw err;

            if(result.length > 0) {
				var placeHolderValues = {
					lensid: result[0].LensID,
					manufacturer: result[0].Manufacturer,
					model: result[0].Model,
					minfocallength: result[0].MinFocalLength,
					maxfocallength: result[0].MaxFocalLength
				};

            res.render('lensEditForm.ejs', placeHolderValues);
			}
        }
    );
});

router.post('/save', function (req, res) {
	console.log('update Lens: ' + req.body.lensid);
    db.UpdateLens( req.body, function (err, result) {
            if (err) throw err;

            if(result.LensID != 'undefined') {
                res.redirect('/lens/list');
            }
            else {
                res.send('Lens was not inserted.');
            }
        }
    );
});

module.exports = router;

