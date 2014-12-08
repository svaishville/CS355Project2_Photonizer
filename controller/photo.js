var express = require('express');
var router  = express.Router();
var db   = require('../models/db');

/* View all users in a <table> */
router.get('/list', function (req, res) {
    db.GetPhotos(function (err, result) {
            if (err) throw err;
            res.render('photoList.ejs', {rs: result, newphoto: req.query.newphoto});
        }
    );
});

// Create User Form
router.get('/create', function(req, res){
    db.GetPhotoCreate(req, function (err, result) {
            if (err) throw err;
			res.render('photoCreateForm.ejs', {action: '/photo/create', users: result[0], cameras: result[1], lenses: result[2]});
        }
    );
});

// Save User to the Database
router.post('/create', function (req, res) {
    db.InsertPhoto( req.body, function (err, result) {
            if (err) throw err;

            if(result.PhotoID != 'undefined') {
                res.redirect('/photo/list?newphoto='+req.body.fname);
			}
            else {
                res.send('Photo was not inserted.');
            }
        }
    );
});

/* View a single user's information */
/* COMPLETE */
router.get('/edit', function (req, res) {
	console.log(req.query.PhotoID);
    db.GetPhotoEdit(req.query.PhotoID, function (err, result) {
            if (err) throw err;
            if(result.length > 0) {
					var placeHolderValues = {
					photoid: result[0][0].PhotoID,
					fname: result[0][0].Filename,
					userid: result[0][0].UserID,
					username: result[0][0].Username,
					cameraid: result[0][0].CameraID,
					cameramodel: result[0][0].CameraModel,
					lensid: result[0][0].LensID,
					lensmodel: result[0][0].LensModel,
					date: result[0][0].Date,
					iso: result[0][0].ISO,
					focallength: result[0][0].FocalLength,
					fstop: result[0][0].Fstop,
					exposure: result[0][0].Exposure,
					users: result[1],
					cameras: result[2],
					lenses: result[3]
				};
				console.log('placeHolderValues: ' + placeHolderValues);
				res.render('photoEditForm.ejs', placeHolderValues);
			}
        }
    );
});

router.post('/save', function (req, res) {
	console.log('update Photo: ' + req.body.photoid);
    db.UpdatePhoto( req.body, function (err, result) {
            if (err) throw err;

            if(result.PhotoID != 'undefined') {
                res.redirect('/photo/list');
            }
            else {
                res.send('Photo was not inserted.');
            }
        }
    );
});

module.exports = router;

