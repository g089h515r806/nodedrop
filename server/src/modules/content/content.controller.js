import aqp from 'api-query-params';
import {Content, Page, Article} from './content.model';


class ContentController {
  /* eslint-disable no-param-reassign */

  /**
   * Get all content
   * @param {ctx} Koa Context
   */
  async find(ctx) {
	const query = ctx.request.query;  
	const { filter, skip, limit, sort, projection, population } = aqp(query, {blacklist: ['withCount'],});

    const items =  await Content.find(filter)
						.skip(skip)
						.limit(limit)
						.sort(sort)
						.select(projection)
						.populate(population)
						.exec();

	const withCount =  query.withCount || '';
	if(withCount === "1"){					
	  const count = await Content.find(filter).countDocuments().exec();	

	  ctx.body = {
		items:items,
		count:count,
	  }
    }else{
	  ctx.body = {
		items:items,
	  }		
	}	  
	
  }

  /**
   * Find a content
   * @param {ctx} Koa Context
   */
  async findById(ctx) {
    try {
      const content = await Content.findById(ctx.params.id).
	  populate({
		path: 'uid',
		select: 'name realname _id'
	  }).populate('category').populate('image').populate('audio').populate('video').exec();
	  //const content = await Content.findById(ctx.params.id);

      if (!content) {
        ctx.throw(404);
      }
      ctx.body = content;
    } catch (err) {
      if (err.name === 'CastError' || err.name === 'NotFoundError') {
        ctx.throw(404);
      }
      ctx.throw(500);
    }
  }

  /**
   * Add a content
   * @param {ctx} Koa Context
   */
  async add(ctx) {
    try {
	  //console.log(ctx.request);
	  //console.log(ctx.request.body);
	  let requestBody = ctx.request.body || {};
	  if(!requestBody.uid){
		requestBody.uid = ctx.state.user._id || null;  
	  }	  
	  var content = new Content(requestBody);
	  

	  //var errors = Contact.validateSync();
	  //console.log(errors);
	  ctx.body = content.save();

    } catch (err) {
      ctx.throw(422);
    }
  }

  /**
   * Update a content
   * @param {ctx} Koa Context
   */
  async update(ctx) {
    try {
	  var opts = { runValidators: true };
	  //console.log("user",ctx.state.user);
	  let requestBody = ctx.request.body || {};
	  if(!requestBody.uid){
		requestBody.uid = ctx.state.user._id || null;  
	  }		  
	  let type = ctx.request.body.type || "Page";
	  let content = {};
	  if(type === "Page"){
		  content = await Page.findByIdAndUpdate(
			ctx.params.id,
			requestBody,
			opts
		  );
	  }else if(type === "Article"){
		  content = await Article.findByIdAndUpdate(
			ctx.params.id,
			requestBody,
			opts
		  );		  
	  }
	  
      if (!content) {
        ctx.throw(404);
      }
      ctx.body = content;
    } catch (err) {
      if (err.name === 'CastError' || err.name === 'NotFoundError') {
        ctx.throw(404);
      }
	  ctx.body =  err;

    }
  }

  /**
   * Delete a content
   * @param {ctx} Koa Context
   */
  async delete(ctx) {
    try {
      const content = await Content.findByIdAndRemove(ctx.params.id);
      if (!content) {
        ctx.throw(404);
      }
      ctx.body = content;
    } catch (err) {
      if (err.name === 'CastError' || err.name === 'NotFoundError') {
        ctx.throw(404);
      }
      ctx.throw(500);
    }
  }
  
  async viewCount(ctx) {
    try {
			
	  const updatedContent = await Content.findByIdAndUpdate(
		ctx.params.id,
		{
			$inc: { viewCount: 1 }
		},
		{ new: true } //to return the new document
	  );

      ctx.body = {message:"success"};
    } catch (err) {
      if (err.name === 'CastError' || err.name === 'NotFoundError') {
        ctx.throw(404);
      }
      ctx.throw(500);
    }
  }  

  /* eslint-enable no-param-reassign */
}

export default new ContentController();
