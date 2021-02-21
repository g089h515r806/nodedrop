import 'babel-polyfill';
import Router from 'koa-router';
import { baseApi } from '../../config';
import userAccess from '../../middlewares/user-access';
import DblogController from './dblog.controller';


const api = 'dblog';

const router = new Router();

router.prefix(`/${baseApi}/${api}`);

// GET /api/branch
router.get('/', userAccess('access log'), DblogController.find);


// GET /api/branch/id
// This route is protected, 
router.get('/:id', userAccess('access log'), DblogController.findById);


export default router;
