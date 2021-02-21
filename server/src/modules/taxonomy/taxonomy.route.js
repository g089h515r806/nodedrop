import 'babel-polyfill';
import Router from 'koa-router';
import { baseApi } from '../../config';
import userAccess from '../../middlewares/user-access';
import TaxonomyController from './taxonomy.controller';

const api = 'taxonomy';

const router = new Router();

router.prefix(`/${baseApi}/${api}`);

router.get('/termsbycodes', TaxonomyController.findTermsByCodes);

//rest callback for vocabulary
// GET /api/taxonomy
router.get('/', userAccess('administer taxonomy'),  TaxonomyController.find);

// POST /api/taxonomy
router.post('/', userAccess('administer taxonomy'),  TaxonomyController.add);

// GET /api/taxonomy/id
router.get('/:id', userAccess('administer taxonomy'), TaxonomyController.findById);

// PUT /api/taxonomy/id
router.put('/:id', userAccess('administer taxonomy'), TaxonomyController.update);

// DELETE /api/taxonomy/id
router.delete('/:id', userAccess('administer taxonomy'), TaxonomyController.delete);

//rest callback for term
// GET /api/taxonomy/:vid/terms
router.get('/:vid/terms', userAccess('access term'), TaxonomyController.findTerms);
router.get('/terms/:code', userAccess('access term'), TaxonomyController.findTermsByVocCode);

// POST /api/taxonomy/:vid/terms
router.post('/:vid/terms', userAccess('create term'), TaxonomyController.addTerm);


// GET /api/taxonomy/term/id
router.get('/term/:id', userAccess('access term'),  TaxonomyController.findTermById);

// PUT /api/taxonomy/term/id
router.put('/term/:id', userAccess('edit term'), TaxonomyController.updateTerm);

// DELETE /api/taxonomy/term/id
router.delete('/term/:id', userAccess('delete term'), TaxonomyController.deleteTerm);

export default router;
