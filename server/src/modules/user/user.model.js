import mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';

const { Schema } = mongoose;

// To fix https://github.com/Automattic/mongoose/issues/4291
mongoose.Promise = global.Promise;

var isEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
	index:  {unique: true}
  },
  email: {
    type: String,
    required: true,
	validate: [isEmail, 'invalid email'],
	index:  {unique: true}
  },
  password: {
	  type: String,
	  match: /\w+/
  },  

  roles: {
    type: [String]
  },
  created: {
    type: Date,
    default: Date.now,
	index: true
  },  
  updated: {
    type: Date,
    default: Date.now,
	index: true
  }
});

userSchema.pre('findOneAndUpdate', function(next){
    var pswd = this._update.password || '';
	if(pswd == ''){

		return next();
	}
    const SALT_WORK_FACTOR = 10;
	var salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
    var hash = bcrypt.hashSync(pswd, salt);
	this._update.password = hash;
	next();	
});
userSchema.pre('save', function(next) {
    var user = this;
	var pswd = user.password || '';
	if(pswd == ''){
		return next();
	}
    const SALT_WORK_FACTOR = 10;
	var salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
    var hash = bcrypt.hashSync(pswd, salt);
	user.password = hash;
	next();

});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

const roleSchema = new Schema({
  rid: {
    type: String,
    required: true,
	index:  {unique: true}
  },
  name: {
    type: String,
    required: true,
  },
  weight: {
    type: Number,
	default: 0
  }, 
  permissions: {
	type: [String]
  },  
});
const User = mongoose.model('User', userSchema);
const Role = mongoose.model('Role', roleSchema);

export {User, Role};
