import 'babel-polyfill';
import Router from 'koa-router';
import { baseApi } from '../../config';
import userAccess from '../../middlewares/user-access';
import SystemController from './system.controller';

const api = 'system';

const router = new Router();

router.prefix(`/${baseApi}/${api}`);

// GET /api/installed
router.get('/installed', SystemController.isInstalled);

// POST /api/install
router.post('/install', SystemController.install);

export default router;
