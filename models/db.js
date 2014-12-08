var mysql   = require('mysql');


/* DATABASE CONFIGURATION */
var connection = mysql.createConnection({
    host: 'cwolf.cs.sonoma.edu',
    user: 'svaishville',
    password: '004337364',
	multipleStatements: true
});

var dbToUse = 'svaishville';

//use the database for any queries run
var useDatabaseQry = 'USE ' + dbToUse;

//create the User table if it does not exist
connection.query(useDatabaseQry, function (err) {
    if (err) throw err;
    var createTableQry = 'CREATE TABLE IF NOT EXISTS User('
        + 'UserID INT PRIMARY KEY AUTO_INCREMENT'
        + ',Username VARCHAR(32)'
        + ',Name VARCHAR(64)'
		+ ', UNIQUE(Username));'
    connection.query(createTableQry, function (err) {
        if (err) throw err;
    });
});

//create the User table if it does not exist
connection.query(useDatabaseQry, function (err) {
    if (err) throw err;
    var createTableQry = 'CREATE TABLE IF NOT EXISTS Camera (Manufacturer VARCHAR(50), Model VARCHAR(50), '
							+ 'Primary Key(Manufacturer, Model));'
    connection.query(createTableQry, function (err) {
        if (err) throw err;
    });
});

connection.query(useDatabaseQry, function (err) {
    if (err) throw err;
    var createTableQry = 'CREATE TABLE IF NOT EXISTS Lens (Manufacturer VARCHAR(50), Model VARCHAR(50),' 
			+ 'MinFocalLength INT, MaxFocalLength INT, Primary Key(Manufacturer, Model));'
    connection.query(createTableQry, function (err) {
        if (err) throw err;
    });
});

connection.query(useDatabaseQry, function (err) {
    if (err) throw err;
    var createTableQry = 'CREATE TABLE IF NOT EXISTS UserComment (UserID INT, PhotoID INT, UserComment VARCHAR(140), PRIMARY KEY(PhotoID, UserID), FOREIGN KEY (UserID) REFERENCES Photo(PhotoID));'
    connection.query(createTableQry, function (err) {
        if (err) throw err;
    });
});

connection.query(useDatabaseQry, function (err) {
    if (err) throw err;
    var createTableQry = 'CREATE TABLE IF NOT EXISTS UserRating(UserID INT, PhotoID INT, UserRating INT, PRIMARY KEY(PhotoID, UserID), FOREIGN KEY (UserID) REFERENCES Photo(PhotoID));'
    connection.query(createTableQry, function (err) {
        if (err) throw err;
    });
});


connection.query(useDatabaseQry, function (err) {
    if (err) throw err;
    var createTableQry = 'CREATE TABLE IF NOT EXISTS Photo (PhotoID INT AUTO_INCREMENT PRIMARY KEY, UserID INT, Filename VARCHAR(30), CameraID INT, LensID INT, '
					+ ' Date VARCHAR(30), ISO INT, FocalLength VARCHAR(10), Fstop VARCHAR(20), Exposure VARCHAR(20), '
					+ ' UNIQUE(UserID, Filename, CameraID));'
    connection.query(createTableQry, function (err) {
        if (err) throw err;
    });
});

connection.query(useDatabaseQry, function (err) {
    if (err) throw err;
    var createTableQry = 'CREATE OR REPLACE VIEW ViewCommentsWithRatings as '
	+ ' SELECT UserComment.UserComment, UserRating.UserRating, User.Username, UserComment.PhotoID, User.UserID '
	+ ' FROM UserComment '
	+ ' JOIN UserRating ON UserComment.PhotoID = UserRating.PhotoID AND UserComment.UserID = UserRating.UserID '
	+ ' JOIN User ON User.UserID = UserComment.UserID;'
    connection.query(createTableQry, function (err) {
        if (err) throw err;
    });
});


connection.query(useDatabaseQry, function (err) {
    if (err) throw err;
    var createTableQry = 'CREATE OR REPLACE VIEW GetPhotosWithRef as '
			+ ' select Photo.*, User.Username, Camera.Model as CameraModel, Lens.Model as LensModel from Photo '
			+ ' left outer join User on Photo.UserID = User.UserID '
			+ ' left outer join Camera on Photo.CameraID = Camera.CameraID '
			+ ' left outer join Lens on Photo.LensID= Lens.LensID; '
    connection.query(createTableQry, function (err) {
        if (err) throw err;
    });
});



exports.GetUsers = function(callback) {
    connection.query('select * from User',
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, result);
        }
    );
}

exports.GetUser = function(userid, callback) {
    connection.query('select * from User WHERE UserID = ' + userid + ';',
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, result);
        }
    );
}


exports.InsertUser = function(userInfo, callback) {
    var query = 'INSERT INTO User (Username, Name) VALUES (\'' 
					+ userInfo.username + '\', \'' + userInfo.name + '\');';
    console.log(query);
    connection.query(query,
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return
            }
            callback(false, result);
        }
    );
}

exports.UpdateUser = function(userInfo, callback) {
    var query = 'UPDATE User SET Username=\''+ userInfo.username + '\', Name=\'' + userInfo.name + '\' WHERE UserID = ' + userInfo.userid + ';';
    console.log(query);
    connection.query(query,
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return
            }
            callback(false, result);
        }
    );
}


exports.GetCameras = function(callback) {
    connection.query('select * from Camera',
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, result);
        }
    );
}

exports.GetCamera = function(cameraid, callback) {
    connection.query('select * from Camera WHERE CameraID = ' + cameraid + ';',
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, result);
        }
    );
}

exports.InsertCamera = function(cameraInfo, callback) {
    var query = 'INSERT INTO Camera (Manufacturer, Model) VALUES (\'' 
					+ cameraInfo.manufacturer + '\', \'' + cameraInfo.model + '\');';
    console.log(query);
    connection.query(query,
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return
            }
            callback(false, result);
        }
    );
}

exports.UpdateCamera = function(cameraInfo, callback) {
    var query = 'UPDATE Camera SET Manufacturer=\''+ cameraInfo.manufacturer + '\', Model=\'' + cameraInfo.model + '\' WHERE CameraID = ' + cameraInfo.cameraid + ';';
    console.log(query);
    connection.query(query,
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return
            }
            callback(false, result);
        }
    );
}

exports.GetLenses = function(callback) {
    connection.query('select * from Lens',
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, result);
        }
    );
}

exports.GetLens = function(lensid, callback) {
    connection.query('select * from Lens WHERE LensID = ' + lensid + ';',
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, result);
        }
    );
}

exports.InsertLens = function(lensInfo, callback) {
    var query = 'INSERT INTO Lens (Manufacturer, Model, MinFocalLength, MaxFocalLength) VALUES (\'' 
					+ lensInfo.manufacturer + '\', \'' + lensInfo.model + '\', \'' + lensInfo.minfocallength + '\', \'' + lensInfo.maxfocallength + '\');';
    console.log(query);
    connection.query(query,
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return
            }
            callback(false, result);
        }
    );
}

exports.UpdateLens = function(lensInfo, callback) {
    var query = 'UPDATE Lens SET Manufacturer=\''+ lensInfo.manufacturer + '\', Model=\'' + lensInfo.model + '\', MinFocalLength=\'' + lensInfo.minfocallength + '\', MaxFocalLength=\'' + lensInfo.maxfocallength + '\' WHERE LensID = ' + lensInfo.lensid + ';';
    console.log(query);
    connection.query(query,
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return
            }
            callback(false, result);
        }
    );
}

exports.GetPhotos = function(callback) {
    connection.query('select * from GetPhotosWithRef',
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, result);
        }
    );
}

exports.GetPhoto = function(photoid, callback) {
    connection.query('select * from Photo WHERE PhotoID = ' + photoid + ';',
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, result);
        }
    );
}

exports.GetPhotoCreate = function(photoid, callback) {
    connection.query('select * from User;'
						+ 'select * from Camera;'
						+ 'select * from Lens;',
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, result);
        }
    );
}

exports.GetPhotoEdit = function(photoid, callback) {
    connection.query('select * from Photo WHERE PhotoID = ' + photoid + ';' 
						+ 'select * from User;'
						+ 'select * from Camera;'
						+ 'select * from Lens;',
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, result);
        }
    );
}

exports.InsertPhoto = function(photoInfo, callback) {
    var query = 'INSERT INTO Photo (UserID, Filename, CameraID, LensID, Date, ISO, FocalLength, Fstop, Exposure) VALUES (\'' 
					+ photoInfo.userid + '\', \'' + photoInfo.fname + '\', \'' + photoInfo.cameraid + '\', \'' + photoInfo.lensid + '\', \'' + photoInfo.date + '\', \'' + photoInfo.iso + '\', \'' + photoInfo.focallength + '\', \'' + photoInfo.fstop + '\', \'' + photoInfo.exposure + '\');';
    console.log(query);
    connection.query(query,
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return
            }
            callback(false, result);
        }
    );
}

exports.UpdatePhoto = function(photoInfo, callback) {
    var query = 'UPDATE Photo SET UserID=\'' + photoInfo.userid + '\', Filename=\'' + photoInfo.fname + '\', CameraID=\'' + photoInfo.cameraid + '\', LensID=\'' + photoInfo.lensid + '\', Date=\'' + photoInfo.date + '\', focallength=\'' + photoInfo.focallength + '\', iso=\'' + photoInfo.iso + '\', exposure=\'' + photoInfo.exposure + '\' WHERE PhotoID = ' + photoInfo.photoid + ';';
    console.log(query);
    connection.query(query,
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return
            }
            callback(false, result);
        }
    );
}



exports.GetCommentsWithRatings = function(photoid, callback) {
    connection.query('select * from ViewCommentsWithRatings WHERE PhotoID = ' + photoid + ';',
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, result);
        }
    );
}

exports.InsertComment = function(commentInfo, callback) {
    var query = 'INSERT INTO UserComment (UserID, PhotoID, UserComment) VALUES (' 
					+ commentInfo.userid + ', ' + commentInfo.photoid + ', \'' + commentInfo.usercomment + '\');';
    console.log(query);
    connection.query(query,
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return
            }
            callback(false, result);
        }
    );
}

exports.InsertRating = function(commentInfo, callback) {
    var query = 'INSERT INTO UserRating (UserID, PhotoID, UserRating) VALUES (' 
					+ commentInfo.userid + ', ' + commentInfo.photoid + ', ' + commentInfo.userrating + ');';
    console.log(query);
    connection.query(query,
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return
            }
            callback(false, result);
        }
    );
}