import 'babel-polyfill';
import Router from 'koa-router';
import koaBody from 'koa-body';
import { baseApi } from '../../config';
import userAccess from '../../middlewares/user-access';
import UserController from './user.controller';

const api = 'user';

const router = new Router();

router.prefix(`/${baseApi}/${api}`);

// GET /api/roles
router.get('/role', userAccess('access role'), UserController.findRole);

router.post('/role', userAccess('create role'), UserController.addRole);

router.get('/role/:id', userAccess('access role'), UserController.findRoleById);

router.put('/role/:id', userAccess('edit role'), UserController.updateRole);

router.delete('/role/:id', userAccess('delete role'), UserController.deleteRole);

router.get('/permissions', UserController.findAllPermissions);

// GET /api/user
router.get('/', userAccess('access user'), UserController.find);
router.post('/login', UserController.login);
//router.post('/register', UserController.register);
//router.post('/admin/register', UserController.adminRegister);

// POST /api/user
router.post('/', userAccess('create user'), UserController.add);

// GET /api/user/id
router.get('/:id', userAccess('access user'), UserController.findById);

// PUT /api/user/id
router.put('/:id', userAccess('edit user'), UserController.update);

// DELETE /api/user/id
// This route is protected, call POST /api/authenticate to get the token
router.delete('/:id', userAccess('delete user'), UserController.delete);
	

export default router;
