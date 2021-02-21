import Contact from './contact.model';
import aqp from 'api-query-params';

class ContactController {

  /**
   * Get all contact
   * @param {ctx} Koa Context
   */
  async find(ctx) {
	const query = ctx.request.query;  
	const { filter, skip, limit, sort, projection, population } = aqp(query, {blacklist: ['withCount'],});

    const items =  await Contact.find(filter)
						.skip(skip)
						.limit(limit)
						.sort(sort)
						.select(projection)
						.populate(population)
						.exec();
	const withCount =  query.withCount || '';
	if(withCount === "1"){	
	  const count = await Contact.find(filter).countDocuments().exec();	

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
   * Find a contact
   * @param {ctx} Koa Context
   */
  async findById(ctx) {
    try {
      const contact = await Contact.findById(ctx.params.id);
      if (!contact) {
        ctx.throw(404);
      }
      ctx.body = contact;
    } catch (err) {
      if (err.name === 'CastError' || err.name === 'NotFoundError') {
        ctx.throw(404);
      }
      ctx.throw(500);
    }
  }

  /**
   * Add a contact
   * @param {ctx} Koa Context
   */
  async add(ctx) {
    try {
	  var contact = new Contact(ctx.request.body);

	  ctx.body = await contact.save();

    } catch (err) {
      ctx.throw(422);
    }
  }

  /**
   * Update a contact
   * @param {ctx} Koa Context
   */
  async update(ctx) {
    try {
	  var opts = { runValidators: true };
      const contact = await Contact.findByIdAndUpdate(
        ctx.params.id,
        ctx.request.body,
		opts
      );
      if (!contact) {
        ctx.throw(404);
      }
      ctx.body = contact;
    } catch (err) {
      if (err.name === 'CastError' || err.name === 'NotFoundError') {
        ctx.throw(404);
      }
	  ctx.body =  err;
    }
  }

  /**
   * Delete a type
   * @param {ctx} Koa Context
   */
  async delete(ctx) {
    try {
      const contact = await Contact.findByIdAndRemove(ctx.params.id);
      if (!contact) {
        ctx.throw(404);
      }
      ctx.body = contact;
    } catch (err) {
      if (err.name === 'CastError' || err.name === 'NotFoundError') {
        ctx.throw(404);
      }
      ctx.throw(500);
    }
  }

  /* eslint-enable no-param-reassign */
}

export default new ContactController();
