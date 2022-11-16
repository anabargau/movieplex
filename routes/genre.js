const express = require('express');
const router = express.Router();

const genre_controller = require('../controllers/genreController');

router.get('/genre_list', genre_controller.genre_list);
router.get('/create', genre_controller.genre_create_get);
router.post('/create', genre_controller.genre_create_post);
router.get('/:id', genre_controller.genre_movie_list);
router.get('/:id/delete', genre_controller.genre_delete_get);
router.post('/:id/delete', genre_controller.genre_delete_post);
router.get('/:id/update', genre_controller.genre_update_get);
router.post('/:id/update', genre_controller.genre_update_post);

module.exports = router;
