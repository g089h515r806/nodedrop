import {User, Role} from './user.model';
import UserService from './user.service';
import DblogService from '../dblog/dblog.service';
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import aqp from 'api-query-params';
import { jwtSecret } from '../../config';

class UserController {
  /* eslint-disable no-param-reassign */

  /**
   * Get all cities
   * @param {ctx} Koa Context
   */
  async find(ctx) {
	const query = ctx.request.query;  
	const { filter, skip, limit, sort, projection, population } = aqp(query, {blacklist: ['withCount'],});
	
	console.log("filter", filter);

    const items =  await User.find(filter)
						.skip(skip)
						.limit(limit)
						.sort(sort)
						.select(projection)
						.populate(population)
						.exec();
	const withCount =  query.withCount || '';
	if(withCount === "1"){
	  const count = await User.find(filter).countDocuments().exec();	

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
   * User login
   * @param {ctx} Koa Context
   */
  async login(ctx) {
    try {
      //const user = await new User({name:'Test1 name',email:'test',realname:'张三'}).save();
	   console.log(ctx.request.body);
	 // ctx.body ={message:'123456'};	  

	  const user = await User.findOne({ name: ctx.request.body.name});
	  
	  //console.log(ctx.params);
      if (!user) {
         ctx.body ={
		   message:'Invalid username',
		   error: true
		};
		return;
      }
      var pswdHash = user.password || '';
      if (pswdHash == '') {
         ctx.body ={
		   message:'Invalid password',
		   error: true
		};
		return;
      }	  
      var valid = bcrypt.compareSync(ctx.request.body.password, pswdHash);
	  
	  if(!valid){
         ctx.body ={
		   message:'Invalid password',
		   error: true
		};
		return;	
	  }

	  ctx.body = {
		  token: jwt.sign(
			{
			  id: user._id,
			  name: user.name,
			  email: user.email,
			  roles: user.roles,
			},
			jwtSecret,
            { expiresIn: 14400 }
			//{ expiresIn: 120 }
		  ),
		  message: 'success'
	  };	 

	 
    } catch (err) {
	  console.log(err);
      ctx.throw(422);
    }
  }   

  /**
   * Find a term
   * @param {ctx} Koa Context
   */
  async findById(ctx) {
    try {
      const user = await User.findById(ctx.params.id);
      if (!user) {
        ctx.throw(404);
      }
      ctx.body = user;
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
  async add(ctx) {
    try {
	  var userSource = new User();
	  let userObj = ctx.request.body;
	  let name = userObj.name || "";
	  var exist_name = await User.findOne({ name: name});
	  let email = userObj.email || "";
	  var exist_email = await User.findOne({ email: email});	  
	  //var errors = userSource.validateSync();
	  let errorMsg = "";
	  if(exist_name){
		errorMsg =  errorMsg + "The username already exists;";
	  }
	  if(exist_email){
		errorMsg =  errorMsg + "The email already exists;";
	  }
       //console.log('123123');
      //set default role	  
	  let roles = userObj.roles || [];
	  //console.log(userObj);
	  if(roles.length === 0) {
		userObj.roles = ['authenticated']; 
	  }

	  if(errorMsg != ""){
		ctx.body = {error:true, message:errorMsg};  
	  }else{
        const user = await new User(userObj).save();
        ctx.body = user;
	  }
    } catch (err) {
      ctx.throw(422);
    }
  }
  /**
   * Add a term
   * @param {ctx} Koa Context
   */
  async register(ctx) {
	  
    try {
	  var userSource = new User();
	  let userObj = ctx.request.body;
	  let name = userObj.name || "";
	  var exist_name = await User.findOne({ name: name});
	  let email = userObj.email || "";
	  var exist_email = await User.findOne({ email: email});	  
	  //var errors = userSource.validateSync();
	  let errorMsg = "";
	  if(exist_name){
		errorMsg =  errorMsg + "The username already exists;";
	  }
	  if(exist_email){
		errorMsg =  errorMsg + "The email already exists;";
	  }
      // console.log('123123');
      //set default role		  
	  let roles = userObj.roles || [];
	  //console.log(userObj);
	  if(roles.length === 0) {
		userObj.roles = ['authenticated']; 
	  }

	  if(errorMsg != ""){
		ctx.body = {error:true, message:errorMsg};  
	  }else{
        const user = await new User(userObj).save();
        ctx.body = user;
	  }
    } catch (err) {
      ctx.throw(422);
    }
  }
  
  /**
   * admin register, to be deleted
   * @param {ctx} Koa Context
   */
  async adminRegister(ctx) {
	  
    try {
	  var userSource = new User();
	  let userObj = ctx.request.body;
	  var exist_user = await User.findOne({});
      let errorMsg = "";
	  if(exist_user){
		errorMsg =  errorMsg + "The administrator already exists;";
		ctx.body = {error:true, message:errorMsg};  
        return;		
	  }
      console.log('userObj', userObj);
       console.log('123123');
      //set default role	  
	  let roles = userObj.roles || [];
	  //console.log(userObj);
	  if(roles.length === 0) {
		userObj.roles = ['administrator']; 
	  }

	  if(errorMsg != ""){
		ctx.body = {error:true, message:errorMsg};  
	  }else{
        const user = await new User(userObj).save();
        ctx.body = user;
	  }
    } catch (err) {
		console.log("err",err);
      ctx.throw(422);
    }
  }  
  /**
   * Update a user
   * @param {ctx} Koa Context
   */
  async update(ctx) {
    try {
	  var opts = { runValidators: true };
	  //when password is empty, skip it.
	  let update = ctx.request.body;
	  let pw = update.password || "";
	  if(pw == ""){
		delete update.password;  
	  }
      const user = await User.findByIdAndUpdate(
        ctx.params.id,
        update,
		opts
      );
      if (!user) {
        ctx.throw(404);
      }
	  await DblogService.watchdog("user", "更新了用户:" + user.name, 5, ctx);
      ctx.body = user;
    } catch (err) {
      if (err.name === 'CastError' || err.name === 'NotFoundError') {
        ctx.throw(404);
      }
	  ctx.body =  err;
	  //console.log(err);
      //ctx.throw(500);
    }
  }

  /**
   * Delete a user
   * @param {ctx} Koa Context
   */
  async delete(ctx) {
    try {
      const user = await User.findByIdAndRemove(ctx.params.id);
      if (!user) {
        ctx.throw(404);
      }
      ctx.body = user;
    } catch (err) {
      if (err.name === 'CastError' || err.name === 'NotFoundError') {
        ctx.throw(404);
      }
      ctx.throw(500);
    }
  }
  /**
   * Find roles
   * @param {ctx} Koa Context
   */  
  async findRole(ctx) {
	//  console.log('123');
    ctx.body = await Role.find();
  }
  /**
   * Find a role
   * @param {ctx} Koa Context
   */
  async findRoleById(ctx) {
    try {
      const role = await Role.findById(ctx.params.id);
      if (!role) {
        ctx.throw(404);
      }
      ctx.body = role;
    } catch (err) {
      if (err.name === 'CastError' || err.name === 'NotFoundError') {
        ctx.throw(404);
      }
      ctx.throw(500);
    }
  }

  /**
   * Add a role
   * @param {ctx} Koa Context
   */
  async addRole(ctx) {
    try {
      const role = await new Role(ctx.request.body).save();
      ctx.body = role;

    } catch (err) {
      ctx.throw(422);
    }
  }

  /**
   * Update a role
   * @param {ctx} Koa Context
   */
  async updateRole(ctx) {
    try {
	  var opts = { runValidators: true };
      const role = await Role.findByIdAndUpdate(
        ctx.params.id,
        ctx.request.body,
		opts
      );
      if (!role) {
        ctx.throw(404);
      }
      ctx.body = role;
    } catch (err) {
      if (err.name === 'CastError' || err.name === 'NotFoundError') {
        ctx.throw(404);
      }
	  ctx.body =  err;

    }
  }

  /**
   * Delete a role
   * @param {ctx} Koa Context
   */
  async deleteRole(ctx) {
    try {
      const role = await Role.findByIdAndRemove(ctx.params.id);
      if (!role) {
        ctx.throw(404);
      }
      ctx.body = role;
    } catch (err) {
      if (err.name === 'CastError' || err.name === 'NotFoundError') {
        ctx.throw(404);
      }
      ctx.throw(500);
    }
  }  
  /**
   * Get all permissions
   * @param {ctx} Koa Context
   */
  async findAllPermissions(ctx) {
	//let perms = await UserService.getPermissions();
	ctx.body = await UserService.getPermissions();
  }
  
   
  /* eslint-enable no-param-reassign */
}

export default new UserController();
