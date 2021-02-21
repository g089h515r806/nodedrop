import aqp from 'api-query-params';
import Watchdog from './dblog.model';

class DblogController {
  /* eslint-disable no-param-reassign */

  /**
   * Get all log
   * @param {ctx} Koa Context
   */
  async find(ctx) {
	const query = ctx.request.query;  
	const { filter, skip, limit, sort, projection, population } = aqp(query, {blacklist: ['withCount'],});
	
	console.log("filter", filter);

    const items =  await Watchdog.find(filter)
						.skip(skip)
						.limit(limit)
						.sort(sort)
						.select(projection)
						.populate(population)
						.exec();
	const withCount =  query.withCount || '';
	if(withCount === "1"){
	  const count = await Watchdog.find(filter).countDocuments().exec();	

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
   * Find a log
   * @param {ctx} Koa Context
   */
  async findById(ctx) {
    try {
      const log = await Watchdog.findById(ctx.params.id);
      if (!log) {
        ctx.throw(404);
      }
      ctx.body = log;
    } catch (err) {
      if (err.name === 'CastError' || err.name === 'NotFoundError') {
        ctx.throw(404);
      }
      ctx.throw(500);
    }
  }


}

export default new DblogController();
