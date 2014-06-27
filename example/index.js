// Get Feathers
var feathers = require('feathers');
var bodyParser = require('body-parser');
// Get Mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var morgan = require('morgan');
// Connect to your MongoDB
mongoose.connect('mongodb://localhost/test');

// Get Mongoose-Service
var mongooseService = require('../lib'); // Mongoose-Service

var UserSchema = new Schema({
  email: {type : String, required : true, index: {unique: true, dropDups: true}},
  firstName: {type : String, required : true},
  lastName: {type : String, required : true},
  age: {type : Number, required : true},
  password: {type : String, required : true, select: false},
  skills: {type : Array, required : true}
});
var UserModel = mongoose.model('User', UserSchema);

// Create your Mongoose-Service, for a `User`
var userService = mongooseService(UserModel);

// Setup Feathers
var app = feathers();

// Configure Feathers
// Enable logger (morgan)
app.use(morgan('dev')); // For debugging purposes.
// ................
var port = 8080;
// ................
app.configure(feathers.rest())
  .configure(feathers.socketio())
  .use(bodyParser({extend:true}))
  .use('/user', userService) // <-- Register your custom Mongoose-Service with Feathers
  .listen(port, function() {
        console.log('Express server listening on port ' + port);
    });
