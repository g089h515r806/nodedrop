import {Vocabulary} from '../taxonomy/taxonomy.model';
import {User, Role} from '../user/user.model';

class SystemController {

  /**
   * check system installed
   * @param {ctx} Koa Context
   */
  async isInstalled(ctx) {
    //check system has a user.
	var exist_user = await User.findOne({});
	if(!exist_user){
		ctx.body = {installed:false};
	}else{
		ctx.body = {installed:true};
	}
  }

  /**
   * install system
   * @param {ctx} Koa Context
   */
  async install(ctx) {
	  
    try {


	  var exist_user = await User.findOne({});

	  if(exist_user){
        ctx.throw(422);
        return;		
	  }
	  
	  //create category vocabulary
	  let category = {
		  code:'category',
		  name:'Category',
	  };
	  
	  await Vocabulary.findOneAndUpdate({ code: category.code}, category, {
	    new: true,
	    upsert: true // Make this update into an upsert
	  });
	  
	  let anonymous = {
		  rid:'anonymous',
		  name:'Anonymous user',
	  };
	  let authenticated = {
		  rid:'authenticated',
		  name:'Authenticated user',
	  };
	  let administrator = {
		  rid:'administrator',
		  name:'Administrator',
	  };	  
	  await Role.findOneAndUpdate({ rid: anonymous.rid}, anonymous, {
	    new: true,
	    upsert: true // Make this update into an upsert
	  });
	  
	  await Role.findOneAndUpdate({ rid: authenticated.rid}, authenticated, {
	    new: true,
	    upsert: true // Make this update into an upsert
	  });	

	  await Role.findOneAndUpdate({ rid: administrator.rid}, administrator, {
	    new: true,
	    upsert: true // Make this update into an upsert
	  });	  
			
	  // create an administrator
      let userObj = ctx.request.body;
	  let roles = userObj.roles || [];
	  //console.log(userObj);
	  if(roles.length === 0) {
		userObj.roles = ['administrator']; 
	  }

       const user = await new User(userObj).save();

	   ctx.body = {message:"sucess"};
       //ctx.body = user;

    } catch (err) {
	  console.log("err",err);
      ctx.throw(422);
    }
  }

}

export default new SystemController();
