import Watchdog from './dblog.model';

class DblogService {
  /* eslint-disable no-param-reassign */

  /**
   * Get all permissions
   * 
   */
  async watchdog(type, message, severity, ctx) {

    try {
	  let name = "";
	  let location = "";
	  let hostname = "";
	  //ctx defined
	  if(ctx){
	    let user = ctx.state.user || {};
	    name = user.name || '匿名用户';
		location = ctx.req.url || "";
		hostname = this.getClientIP(ctx.req);
	  }

	  let log = {
		username : name,
		type : type,
        message : message,
        severity : severity,
		location : location,
        hostname : hostname,
        //hostname:"",		
	  };
	  //console.log(log);
	  var watchdog = new Watchdog(log);
	  ctx.body = await watchdog.save();
      return true;
    } catch (err) {
      return false;
    }
  }

  
  /**
   * @getClientIP
   * @desc 获取用户 ip 地址
   * @param {Object} req - 请求
   */
  getClientIP(req) {
	return req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
		req.connection.remoteAddress || // 判断 connection 的远程 IP
		req.socket.remoteAddress || // 判断后端的 socket 的 IP
		req.connection.socket.remoteAddress; 
    
  }
}

export default new DblogService();
