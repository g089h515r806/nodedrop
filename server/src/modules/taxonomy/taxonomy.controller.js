import aqp from 'api-query-params';
import {Vocabulary, Term} from './taxonomy.model';

class TaxonomyController {

  /**
   * Get all vocabulary
   * @param {ctx} Koa Context
   */
  async find(ctx) {
    ctx.body = await Vocabulary.find();
  }
  

  /**
   * Find a vocabulary
   * @param {ctx} Koa Context
   */
  async findById(ctx) {
    try {
      const vocabulary = await Vocabulary.findById(ctx.params.id);
      if (!vocabulary) {
        ctx.throw(404);
      }
      ctx.body = vocabulary;
    } catch (err) {
      if (err.name === 'CastError' || err.name === 'NotFoundError') {
        ctx.throw(404);
      }
      ctx.throw(500);
    }
  }

  /**
   * Add a vocabulary
   * @param {ctx} Koa Context
   */
  async add(ctx) {
    try {
      const vocabulary = await new Vocabulary(ctx.request.body).save();
      ctx.body = vocabulary;
    } catch (err) {
      ctx.throw(422);
    }
  }

  /**
   * Update a vocabulary
   * @param {ctx} Koa Context
   */
  async update(ctx) {
    try {
      const vocabulary = await Vocabulary.findByIdAndUpdate(
        ctx.params.id,
        ctx.request.body
      );
      if (!vocabulary) {
        ctx.throw(404);
      }
      ctx.body = vocabulary;
    } catch (err) {
      if (err.name === 'CastError' || err.name === 'NotFoundError') {
        ctx.throw(404);
      }
      ctx.throw(500);
    }
  }

  /**
   * Delete a vocabulary
   * @param {ctx} Koa Context
   */
  async delete(ctx) {
    try {
      const vocabulary = await Vocabulary.findByIdAndRemove(ctx.params.id);
	  

	  
      if (!vocabulary) {
        ctx.throw(404);
      }
	  
	  //delete related terms,  delete it carefully 
	  Term.deleteMany({ vocabulary: ctx.params.id});
	  
      ctx.body = vocabulary;
    } catch (err) {
      if (err.name === 'CastError' || err.name === 'NotFoundError') {
        ctx.throw(404);
      }
      ctx.throw(500);
    }
  }

   /**
   * Get all term of a vocabulary
   * @param {ctx} Koa Context
   */
  async findTermsByVocCode(ctx) {
	const vocCode = ctx.params.code;  
	//console.log(vid);
	const query = ctx.request.query;  
	
	const vocIds = await Vocabulary.find({ code: { $in:  [vocCode] } }).distinct('_id');
	//console.log(vocIds);
	var vid = vocIds[0] || null;
	
	const items = await Term.find({ vocabulary:vid }).exec(); 

	
	ctx.body = items;
  }

  async findTermsByCodes(ctx) {
	//const vocCode = ctx.params.code;  
	//console.log(vid);
	const query = ctx.request.query;  
    let codes = query.codes || '';
	let code_arr = codes.split(",");
	let ret = {};

   for (let code of code_arr) {
	//code_arr.forEach(function(code){
		let vocIds = await Vocabulary.find({ code: { $in:  [code] } }).distinct('_id');
		let vid = vocIds[0] || null;

		let items = await Term.find({ vocabulary:vid },  {name:1, code:1, parent:1,_id:1}).exec(); 
		ret[code] = items;
    };
	
	ctx.body = ret;
  }  
  
  /**
   * Get all term of a vocabulary
   * @param {ctx} Koa Context
   */
  async findTerms(ctx) {
	const vid = ctx.params.vid; 
	const query = ctx.request.query;  
	const { filter, skip, limit, sort, projection, population } = aqp(query, {blacklist: ['withCount'],});
	
	console.log("filter", filter);

    const items =  await Term.find(filter)
						.skip(skip)
						.limit(limit)
						.sort(sort)
						.select(projection)
						.populate(population)
						.exec();
	const withCount =  query.withCount || '';
	if(withCount === "1"){
	  const count = await Term.find(filter).countDocuments().exec();	

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
   * Find a term
   * @param {ctx} Koa Context
   */
  async findTermById(ctx) {
    try {
      const term = await Term.findById(ctx.params.id);
      if (!term) {
        ctx.throw(404);
      }
      ctx.body = term;
    } catch (err) {
      if (err.name === 'CastError' || err.name === 'NotFoundError') {
        ctx.throw(404);
      }
      ctx.throw(500);
    }
  }

  /**
   * Add a term
   * @param {ctx} Koa Context
   */
  async addTerm(ctx) {
    try {
	  //set value for vocabulary
      var request_body = ctx.request.body;
      const term = await new Term(request_body).save();
      ctx.body = term;
    } catch (err) {
      ctx.throw(422);
    }
  }

  /**
   * Update a term
   * @param {ctx} Koa Context
   */
  async updateTerm(ctx) {
    try {
      const term = await Term.findByIdAndUpdate(
        ctx.params.id,
        ctx.request.body
      );
      if (!term) {
        ctx.throw(404);
      }
      ctx.body = term;
    } catch (err) {
      if (err.name === 'CastError' || err.name === 'NotFoundError') {
        ctx.throw(404);
      }
      ctx.throw(500);
    }
  }

  /**
   * Delete a term
   * @param {ctx} Koa Context
   */
  async deleteTerm(ctx) {
    try {
      const term = await Term.findByIdAndRemove(ctx.params.id);
      if (!term) {
        ctx.throw(404);
      }
      ctx.body = term;
    } catch (err) {
      if (err.name === 'CastError' || err.name === 'NotFoundError') {
        ctx.throw(404);
      }
      ctx.throw(500);
    }
  }  
  /* eslint-enable no-param-reassign */
}

export default new TaxonomyController();
