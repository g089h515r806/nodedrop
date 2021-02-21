import Config from './config.model';

class ConfigService {
  /* eslint-disable no-param-reassign */

  /**
   * Get all contact
   * @param {ctx} Koa Context
   */
  async get(key) {
	let config_item = await Config.findOne({ key: key });
	let value = config_item && config_item.value || new Map();
	return value;
    //ctx.body = await Contact.find();
  }
  

  /**
   * Find a contact
   * @param {ctx} Koa Context
   */
  async set(key, value) {
    try {
		let doc ={
		  key: key,
          value: value	  
		}
		await Config.findOneAndUpdate({ key: key}, doc, {
		  new: true,
		  upsert: true // Make this update into an upsert
		});
		return true;
    } catch (err) {
       return false;
    }
  }

  /**
   * Delete a type
   * @param {ctx} Koa Context
   */
  async delete(key) {
    try {
      await Config.deleteOne({ key: key});
      return true;
    } catch (err) {
      return false;
    }
  }

  /* eslint-enable no-param-reassign */
}

export default new ConfigService();
