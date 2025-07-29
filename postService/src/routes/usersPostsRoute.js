import express from 'express';
import { getUserPosts } from '../controllers/postController.js';

const router = express.Router();

router.get('/:id/posts', getUserPosts);

export default router;