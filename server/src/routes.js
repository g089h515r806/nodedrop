import glob from 'glob';

export default function(app) {
    const files = glob.sync( `${__dirname}/modules/*/*.route.js`);	
	files.forEach(filepath => {
	  const route = require(filepath); // eslint-disable-line global-require, import/no-dynamic-require
	  // routes.push(route);
      app.use(route.routes());
	  app.use(route.allowedMethods({
          throw: true
        })); 
	});
  
}
