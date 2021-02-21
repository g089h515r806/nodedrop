import UserService from '../modules/user/user.service';

module.exports = function userAccess(permission) {
    return async function(ctx, next) {

		let user = ctx.state.user || {};
		let name = user.name ||  "";
		//when user not exist, use anonymous user
		if( name === ""){
			user = {
				name:"Anonymous",
				roles:['anonymous']
			};
			ctx.state.user = user;
		}else{
			//load user by name
		    user = await UserService.loadUserByName(name);
			ctx.state.user = user || {};
		}		
		let account = ctx.state.user || {};
		
		let hasPermission = await UserService.userAccess(permission, account);
		if(!hasPermission){
			ctx.throw(403);
	    }		

        await next();
    };
};