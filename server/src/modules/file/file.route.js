import 'babel-polyfill';
import Router from 'koa-router';
import koaBody from 'koa-body';
import { baseApi } from '../../config';
import userAccess from '../../middlewares/user-access';
import FileController from './file.controller';


const api = 'file';

const router = new Router();

router.prefix(`/${baseApi}/${api}`);

// GET /api/file
router.get('/', userAccess('access file'), FileController.find);


// POST /api/file
router.post('/', userAccess('create file'), FileController.add);

// GET /api/file/id
router.get('/:id', userAccess('access file'), FileController.findById);

// PUT /api/file/id
router.put('/:id', userAccess('edit file'), FileController.update);

// DELETE /api/file/id
router.delete('/:id', userAccess('delete file'), FileController.delete);

router.post('/upload', userAccess('create file'), koaBody({
        multipart: true,
        formidable: {
            maxFileSize: 20 * 1024 * 1024    // set max file size，default 20M
        }
    }), FileController.upload);


export default router;
