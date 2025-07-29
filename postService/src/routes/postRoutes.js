import express from 'express';
import { createPostInDb, getPostById, updatePost, deletePost } from '../controllers/postController.js';
import {authUser} from '../middlewares/auth.js'

const router = express.Router();

router.post('/', authUser, createPostInDb);
router.get('/:id', authUser, getPostById);
router.post('/:id', authUser, updatePost);
router.delete('/:id', authUser, deletePost);

export default router;
