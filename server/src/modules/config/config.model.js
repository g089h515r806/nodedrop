import mongoose from 'mongoose';

const { Schema } = mongoose;

// To fix https://github.com/Automattic/mongoose/issues/4291
mongoose.Promise = global.Promise;

const configSchema = new Schema({
  //key
  key: {
    type: String,
	index: true
  },
  //value
  value: {
    type: Map,
    of: String
  }
});

export default mongoose.model('Config', configSchema);
