import mongoose from 'mongoose';
import User from '../user/user.model';
const { Schema } = mongoose;

// To fix https://github.com/Automattic/mongoose/issues/4291
mongoose.Promise = global.Promise;

const watchdogSchema = new Schema({
  //The {users}.uid of the user
  username: {
    type: String,
	index: true
  },
  
  //Type of log message
  type: {
    type: String,
	index: true
  },
  
  //Text of log message
  message: {
    type: String
  },
  //The severity level of the event;,ranges from 0 (Emergency) to 7 (Debug);0,EMERGENCY; 1,ALERT; 2,CRITICAL; 3,ERROR; 4,WARNING; 5,NOTICE; 6,INFO; 7,DEBUG
  severity: {
    type: Number,
	index: true,
	default: 5
  },
  //URL of the origin of the event.
  location: {
    type: String
  },        
  //Hostname of the user who triggered the event.
  hostname: {
    type: String
  },   

  timestamp: {
    type: Date,
    default: Date.now,
	index: true
  }
});



export default mongoose.model('Watchdog', watchdogSchema);
