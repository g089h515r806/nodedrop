import mongoose from 'mongoose';

const { Schema } = mongoose;

// To fix https://github.com/Automattic/mongoose/issues/4291
mongoose.Promise = global.Promise;

const contactSchema = new Schema({
  //Name
  name: {
    type: String
  }, 

  phone: {
    type: String
  },

  sex: {
    type: String
  },

  content: {
    type: String
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


export default mongoose.model('Contact', contactSchema);
