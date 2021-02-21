import mongoose from 'mongoose';
import { User } from '../user/user.model';
import File from '../file/file.model';
import {Term} from '../taxonomy/taxonomy.model';
const { Schema } = mongoose;

// To fix https://github.com/Automattic/mongoose/issues/4291
mongoose.Promise = global.Promise;

var options = {discriminatorKey: 'type'};

const contentSchema = new Schema({
  //Title

  title: {
    type: String
  },
  //user ID
  uid: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  
  status: {
    type: Boolean,
	default: true,
  }, 
  promote: {
    type: Boolean,
	default: false,
  },
  sticky: {
    type: Boolean,
	default: false,
  }, 
  viewCount : {
    type: Number,
	default: 0,
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
}, options);

contentSchema.index({
  promote: 1,
  status: 1,
  sticky: 1,
  created: 1,
});

var Content = mongoose.model('Content', contentSchema);

const pageContentSchema = new Schema({
   //body
  body: {
    type: String
  }, 
   
}, options);
var Page = Content.discriminator('Page', pageContentSchema);

const articleContentSchema = new Schema({
  image: {
    type: Schema.Types.ObjectId,
    ref: 'File'
  },	
  audio: {
    type: Schema.Types.ObjectId,
    ref: 'File'
  }, 
  video: {
    type: Schema.Types.ObjectId,
    ref: 'File'
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Term'
  },  
   //body
  body: {
    type: String
  }, 
   
}, options);
var Article = Content.discriminator('Article', articleContentSchema);


export {Content, Page, Article};

