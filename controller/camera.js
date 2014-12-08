var express = require('express');
var router  = express.Router();
var db   = require('../models/db');

/* View all users in a <table> */
router.get('/list', function (req, res) {
    db.GetCameras(function (err, result) {
            if (err) throw err;
            res.render('cameraList.ejs', {rs: result, newcamera: req.query.newcamera});
        }
    );
});

// Create User Form
router.get('/create', function(req, res){
    res.render('cameraCreateForm.ejs', {action: '/camera/create'});
});

// Save User to the Database
router.post('/create', function (req, res) {
    db.InsertCamera( req.body, function (err, result) {
            if (err) throw err;

            if(result.CameraID != 'undefined') {
                res.redirect('/camera/list?newcamera='+req.body.model);
			}
            else {
                res.send('Camera was not inserted.');
            }
        }
    );
});

/* View a single user's information */
/* COMPLETE */
router.get('/edit', function (req, res) {
	console.log(req.query.CameraID);
    db.GetCamera(req.query.CameraID, function (err, result) {
            if (err) throw err;

            if(result.length > 0) {
				var placeHolderValues = {
					cameraid: result[0].CameraID,
					manufacturer: result[0].Manufacturer,
					model: result[0].Model
				};

            res.render('cameraEditForm.ejs', placeHolderValues);
			}
        }
    );
});

router.post('/save', function (req, res) {
	console.log('update Camera: ' + req.body.cameraid);
    db.UpdateCamera( req.body, function (err, result) {
            if (err) throw err;

            if(result.CameraID != 'undefined') {
                res.redirect('/camera/list');
            }
            else {
                res.send('Camera was not inserted.');
            }
        }
    );
});

module.exports = router;

