import mongoose from 'mongoose';

const { Schema } = mongoose;

// To fix https://github.com/Automattic/mongoose/issues/4291
mongoose.Promise = global.Promise;

const vocabularySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true,
	index:  {unique: true}	
  },  
  updated: {
    type: Date,
    default: Date.now
  }
});

const Vocabulary = mongoose.model('Vocabulary', vocabularySchema);

const termSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  }, 
  weight: {
    type: Number,
	default: 0
  }, 
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Term'
  },
  vocabulary: {
    type: Schema.Types.ObjectId,
    ref: 'Vocabulary'
  },  
  updated: {
    type: Date,
    default: Date.now
  }
});

const Term = mongoose.model('Term', termSchema);

export {Vocabulary, Term};
