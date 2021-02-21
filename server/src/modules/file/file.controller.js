import File from './file.model';
import fs from 'fs';
import moment from 'moment';
import path from 'path';
import { slugify } from 'transliteration';

class FileController {
  /* eslint-disable no-param-reassign */

  /**
   * Get all files
   * @param {ctx} Koa Context
   */
  async find(ctx) {
	const query = ctx.request.query;  
	const { filter, skip, limit, sort, projection, population } = aqp(query, {blacklist: ['withCount'],});

    const items =  await File.find(filter)
						.skip(skip)
						.limit(limit)
						.sort(sort)
						.select(projection)
						.populate(population)
						.exec();

	const withCount =  query.withCount || '';
	if(withCount === "1"){					
	  const count = await File.find(filter).countDocuments().exec();	

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
   * Find a file
   * @param {ctx} Koa Context
   */
  async findById(ctx) {
    try {
      const file = await File.findById(ctx.params.id);
      if (!file) {
        ctx.throw(404);
      }
      ctx.body = file;
    } catch (err) {
      if (err.name === 'CastError' || err.name === 'NotFoundError') {
        ctx.throw(404);
      }
      ctx.throw(500);
    }
  }

  /**
   * Add a file
   * @param {ctx} Koa Context
   */
  async add(ctx) {
    try {

	  var file = new File(ctx.request.body);
	  const fileReturn = file.save();
      ctx.body = fileReturn;

    } catch (err) {
      ctx.throw(422);
    }
  }

  /**
   * Update a file
   * @param {ctx} Koa Context
   */
  async update(ctx) {
    try {
	  var opts = { runValidators: true };
      const file = await File.findByIdAndUpdate(
        ctx.params.id,
        ctx.request.body,
		opts
      );
      if (!file) {
        ctx.throw(404);
      }
      ctx.body = file;
    } catch (err) {file
      if (err.name === 'CastError' || err.name === 'NotFoundError') {
        ctx.throw(404);
      }
	  ctx.body =  err;

    }
  }

  /**
   * Delete a file
   * @param {ctx} Koa Context
   */
  async delete(ctx) {
    try {
      const file = await File.findByIdAndRemove(ctx.params.id);
      if (!file) {
        ctx.throw(404);
      }
      ctx.body = file;
    } catch (err) {
      if (err.name === 'CastError' || err.name === 'NotFoundError') {
        ctx.throw(404);
      }
      ctx.throw(500);
    }
  }

  /**
   * upload file
   * @param {ctx} Koa Context
   */
  async upload(ctx) {
        //let file = ctx.request.file; // get uploaded file
        // create read stream
        const reader = fs.createReadStream(ctx.request.files['file']['path']);
		let dirPredix = 'file';
		//console.log(ctx.request.files);

        // create write stream
		let yearMonth = moment().format('YYYY-MM')
		const staticPath = `../../../public/upload/${dirPredix}/${yearMonth}`;
		//make sure dir exist
		let dirpath = path.join( __dirname, staticPath);
		if(!fs.existsSync(dirpath)){
			fs.mkdirSync(dirpath, { recursive: true });
		}
        let cleanfilename = slugify(ctx.request.files['file']['name'], { lowercase: true, separator: '_' });
        let filePath = dirpath + '/' + cleanfilename;
		
		//console.log('filePath',filePath);
        const upStream = fs.createWriteStream(filePath);
        // 可读流通过管道写入可写流
        reader.pipe(upStream);
		fs.unlinkSync(ctx.request.files['file']['path']);
		
		let account = ctx.state.user || {};
		
		//console.log('account',account);
		//let uri =;
		let fileObj = {
		  filename:ctx.request.files['file']['name'],
		  uri:`public://upload/${dirPredix}/${yearMonth}/` + cleanfilename,
		  filemime:ctx.request.files['file']['type'],
		  filesize:ctx.request.files['file']['size'],
		  status:true,
		  uid: account._id || null,
		};
	  var fileModel = new File(fileObj);

      ctx.body = await fileModel.save();	
 
  }
  /* eslint-enable no-param-reassign */
}

export default new FileController();
