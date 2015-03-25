var bcrypt = require('bcrypt');
var express = require('express');
var mongodb = require('mongodb');

var user = 'z_zhong';
var password = '00393973';
var host = '127.0.0.1';
var port = '27017'; // Default MongoDB port
var database = 'z_zhong';
// var connectionString = 'mongodb://' + user + ':' + password + '@' +
var connectionString = 'mongodb://' +
    host + ':' + port + '/' + database;

// These will be set once connected, used by other functions below
var usersCollection;
var recordsCollection;

//CORS Middleware, causes Express to allow Cross-Origin Requests
var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
}

var app = express();
app.use(express.bodyParser());
app.use(allowCrossDomain);

mongodb.connect(connectionString, function(error, db) {
  if (error) {
    throw error;
  }

  usersCollection = db.collection('users');
  recordsCollection = db.collection('records');

  // Close the database connection and server when the application ends
  process.on('SIGTERM', function() {
    console.log("Shutting server down.");
    db.close();
    app.close();
  });

  var server = app.listen(7973, function() {
    console.log('Listening on port %d', server.address().port);
  });
});

// Creates a new user in the database
app.post('/saveNewUser', function(request, response) {
  console.log('New user being created.');
  var user = request.body.newUser;
  console.log(request.body);
  if (!user.email || !user.newPassword || !user.firstName || !user.lastName || !user.healthCardNumber || !user.dateOfBirth || !user.cancerType || !user.cancerStage || !user.tshRange) {
    return response.json(400, 'Missing a parameter.');
  }

  var salt = bcrypt.genSaltSync(10);
  var passwordString = '' + user.newPassword;
  user.password = bcrypt.hashSync(passwordString, salt);
  user.agreedToLegal = false;

  usersCollection.find({
    email: user.email
  }, function(err, result) {
    if (err) {
      return response.send(400, 'An error occurred creating this user.');
    }
    if (result.length) {
      return response.send(400, 'A user with this email address already exists.');
    }
    usersCollection.insert(user, function(err, result) {
      if (err) {
        return response.send(400, 'An error occurred creating this user.');
      }
      return response.json(200, 'User created successfully!');
    });
  });
});

// Uses a email address and password to retrieve a user from the database
app.post('/login', function(request, response) {
  console.log('Logging user in');

  if (!request.body.email || !request.body.password) {
    return response.send(400, 'Missing log in information.');
  }

  usersCollection.find({
    email: request.body.email
  }, function(err, result) {
    if (err) {
      throw err;
    }
    result.next(function(err, foundUser) {
      if (err) {
        throw err;
      }
      if (!foundUser) {
        return response.send(400, 'User not found.');
      }
      if (!bcrypt.compareSync('' + request.body.password, foundUser.password)) {
        return response.send(400, 'Invalid password');
      }
      delete foundUser.password;
      return response.send(200, foundUser);
    });
  });
});

// Update user information
app.post('/updateUser', function(request, response) {
  console.log('User being updated.');
  var user = request.body;
  usersCollection.find({
    email: user.email
  }, function(err, result) {
    if (err) {
      throw err;
    }
    result.next(function(err, foundUser) {
      if (err) {
        return response.send(400, 'An error occurred finding a user to update.');
      }
      if (!foundUser) {
        return response.send(400, 'User not found.');
      }
      if (!bcrypt.compareSync('' + request.body.password, foundUser.password)) {
        return response.send(400, 'Invalid password.');
      }
      if (user.newPassword) {
        var salt = bcrypt.genSaltSync(10);
        var passwordString = '' + user.newPassword;
        user.password = bcrypt.hashSync(passwordString, salt);
      }
      delete user._id;
      usersCollection.update({
        email: user.email
      }, user, null, function(err) {
        if (err) {
          console.log(err);
          return response.send(400, 'An error occurred updating users information.');
        }
        return response.send(200, foundUser);
      });
    });
  });
});

// // Get all records associated with the given user
app.post('/getRecords', function(request, response) {
  console.log('Sending records');
  if (!request.body.email || !request.body.password) {
    return response.send(400, 'Missing log in information.');
  }
  usersCollection.find({
    email: request.body.email
  }, function(err, result) {
    if (err) {
      throw err;
    }
    result.next(function(err, foundUser) {
      if (err) {
        throw err;
      }
      if (!foundUser) {
        return response.send(400, 'User not found.');
      }
      if (!bcrypt.compareSync('' + request.body.password, foundUser.password)) {
        return response.send(400, 'Invalid password');
      }
      getRecords(request, function(err, result) {
        if (err) {
          return response.send(400, 'An error occurred retrieving records.');
        }
        result.toArray(function(err, resultArray) {
          if (err) {
            return response.send(400, 'An error occurred processing your records.');
          }
          return response.send(200, resultArray);
        });
      });
    });
  });
});

// Helper function to get all records for a given user
function getRecords(request, callback) {
  console.log('Retrieving records.')
  recordsCollection.find({
    user: request.body.email
  }, callback);
}

// Updates the records in the database with the provided records
app.post('/syncRecords', function(request, response) {
  console.log('Save Records Request Received.');

  if (!request.body.email || !request.body.password) {
    return response.send(400, 'Missing log in information.');
  }

  usersCollection.find({
    email: request.body.email
  }, function(err, result) {
    if (err) {
      throw err;
    }
    result.next(function(err, foundUser) {
      if (err) {
        throw err;
      }
      if (!foundUser) {
        return response.send(400, 'User not found.');
      }
      if (!bcrypt.compareSync('' + request.body.password, foundUser.password)) {
        return response.send(400, 'Invalid password');
      }
      var newRecords = request.body.newRecords;
      for (var i = 0; i < newRecords.length; i++) {
        newRecords[i].user = request.body.email;
        delete newRecords[i]._id;
      }
      syncRecords(request, response, newRecords);
    });
  });
});

// Helper function to remove all old records and insert all new records
//  We do this instead of a combination of UPDATE and
//  INSERT statements to simplify this process
function syncRecords(request, response, recordsToSave) {
  recordsCollection.remove({
    user: request.body.email
  }, null, function(err) {
    if (err) {
      return response.send(400, 'Error occurred syncing records');
    }
    recordsCollection.insert(recordsToSave, function(err, result) {
      if (err) {
        console.log(err);
        return response.send(400, 'Error occurred syncing records');
      }
      return response.send(200, 'Records synced.');
    });
  });
}
