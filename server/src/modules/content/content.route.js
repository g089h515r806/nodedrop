import 'babel-polyfill';
import Router from 'koa-router';
import { baseApi } from '../../config';
import userAccess from '../../middlewares/user-access';
import ContentController from './content.controller';


const api = 'content';

const router = new Router();

router.prefix(`/${baseApi}/${api}`);

// GET /api/content
router.get('/', userAccess('access content'), ContentController.find);

// POST /api/content
router.post('/', userAccess('create content'), ContentController.add);

// GET /api/content/id
router.get('/:id', userAccess('access content'), ContentController.findById);

// PUT /api/content/id
router.put('/:id', userAccess('edit content'), ContentController.update);

// DELETE /api/content/id
router.delete('/:id', userAccess('delete content'), ContentController.delete);

router.post('/viewcount/:id', ContentController.viewCount);

export default router;
