import {User, Role} from './user.model';
import glob from 'glob';
import { rootDir } from '../../config';

class UserService {
  /* eslint-disable no-param-reassign */

  /**
   * Get all permissions
   * 
   */
  async getPermissions() {
    const files = glob.sync( `${rootDir}/modules/*/*.permissions.js`);
	//console.log(files); 
    let permissions = [];	
    files.forEach(filepath => {
	  let module_permissions = require(filepath); // eslint-disable-line global-require, import/no-dynamic-require
      permissions = permissions.concat(module_permissions);
    });
    return permissions;
  }
  
  /**
   * Get all permissions
   * 
   */
  async loadUserByName(name) {
    let user = 	await User.findOne({ name: name});
	// console.log(report); 
	return user;
    //return permissions;
  }

  async loadRolePermissions(rids) {
	var condition = {};  
	condition.rid ={ '$in': rids};  
	let roles = await Role.find(condition,  null, {}).exec();

	return roles;
    //return permissions;
  } 

  async userAccess(permission, user) {
	  /*
		let name = user.name ||  "";
		if( name == ""){
			return false;
		}
		
		//get user's all permissions
		let account = await this.loadUserByName(name);
		*/
		let account = user;
		//console.log(user);
		//todo support 'anonymous' role
		let rids = account && account.roles || [];
		console.log(rids);
		//超级管理员具有所有权限 administrator
		if(rids.includes('administrator')){
			console.log('administrator');
			return true;
		}
		//console.log(rids); 
		let roles = await this.loadRolePermissions(rids);
		console.log(roles);  
		let perms = [];
		for(let role of roles) { 
           let role_perms = role.permissions || [];	
		   //console.log("role_perms",role_perms);
		   perms = perms.concat(role_perms);
           //console.log(v);  
        };
		perms = Array.from(new Set(perms));
		if(perms.indexOf(permission) != -1){
			return true;
	    }
		
		return false;
  }  

  /* eslint-enable no-param-reassign */
}

export default new UserService();
