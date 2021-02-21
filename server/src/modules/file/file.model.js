import mongoose from 'mongoose';
import { User } from '../user/user.model';
const { Schema } = mongoose;

// To fix https://github.com/Automattic/mongoose/issues/4291
mongoose.Promise = global.Promise;

const fileSchema = new Schema({
  //Name of the file with no path components.
  filename: {
    type: String
  },
  
  //uri,The URI to access the file (either local or remote)
  uri: {
    type: String,
	index: true
  },
  
  //filemime,The file's MIME type.
  filemime: {
    type: String
  },

  //filesize,The size of the file in bytes
  filesize: {
    type: Number
  },
 
  //status,The status of the file, temporary (FALSE) and permanent (TRUE).
  status: {
    type: Boolean,
	index:  true
  },

  //The user ID of the file.
  uid: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },

  created: {
    type: Date,
    default: Date.now,
	index: true
  }, 
  
  changed: {
    type: Date,
    default: Date.now,
	index: true
  }
});



export default mongoose.model('File', fileSchema);
