const express = require('express');
const router = express.Router();

const movie_controller = require('../controllers/movieController');

router.get('/movie_list', movie_controller.movie_list);
router.get('/create', movie_controller.movie_create_get);
router.post('/create', movie_controller.movie_create_post);
router.get('/:id', movie_controller.movie_detail);
router.get('/:id/delete', movie_controller.movie_delete_get);
router.post('/:id/delete', movie_controller.movie_delete_post);
router.get('/:id/update', movie_controller.movie_update_get);
router.post('/:id/update', movie_controller.movie_update_post);

module.exports = router;
