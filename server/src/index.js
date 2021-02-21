import bodyParser from 'koa-bodyparser';
import Koa from 'koa';
import logger from 'koa-logger';
import mongoose from 'mongoose';
import helmet from 'koa-helmet';
import cors from '@koa/cors';
import jwt from 'koa-jwt';
import { port, mongodbUri, jwtSecret } from './config';
import routing from './routes';
import koaStatic from 'koa-static';
import path from 'path';

mongoose.set('useCreateIndex', true);
mongoose.connect(mongodbUri);
mongoose.connection.on('error', console.error);

// Create Koa Application
const app = new Koa();

var options = {
	origin: '*'
};

app.use(cors(options));

app.use(jwt({
  secret: jwtSecret,
  passthrough: true 
}));

app
  .use(logger())
  .use(bodyParser())
  .use(helmet());
  
// config static resource
const staticPath = '../public';
app.use(koaStatic(
    path.join( __dirname, staticPath)
));  

//routing
routing(app);


// Start the application
app.listen(port, () =>
  console.log(`✅  The server is running at http://localhost:${port}/`)
);
export default app;
