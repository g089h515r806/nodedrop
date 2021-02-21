import 'babel-polyfill';
import Router from 'koa-router';
import { baseApi } from '../../config';
import userAccess from '../../middlewares/user-access';
import ContactController from './contact.controller';

const api = 'contact';

const router = new Router();

router.prefix(`/${baseApi}/${api}`);

// GET /api/contact
router.get('/', userAccess('access contact'), ContactController.find);

// POST /api/contact
router.post('/', userAccess('create contact'), ContactController.add);

// GET /api/contact/id
router.get('/:id', userAccess('access contact'), ContactController.findById);

// PUT /api/contact/id
router.put('/:id', userAccess('edit contact'), ContactController.update);

// DELETE /api/contact/id
router.delete('/:id', userAccess('delete contact'),  ContactController.delete);



export default router;
