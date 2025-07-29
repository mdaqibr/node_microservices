import {getShardPool} from '../config/db.js';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FILE_PATH = path.join(__dirname, '../../posts.json');

export const createPostInDb = async (req, res) => {
  const { user_id, content } = req.body;
  console.log("Request body: ", req.body)

  const pool = getShardPool(user_id);

  try {
    if(user_id === '') {
      return res.status(404).json({ error: 'User cannot be blank.' });
    }
    else if(content === '') {
      return res.status(404).json({ error: 'Post content cannot be blank.' });
    }
    const result = await pool.query(
      `INSERT INTO posts (user_id, content) VALUES ($1, $2) RETURNING *`,
      [user_id, content]
    );

    const newPost = result.rows[0];

    res.status(201).json({ post: newPost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Failed to create post - ${err}` });
  }
};

export const getUserPosts = async (req, res) => {
  const { id } = req.params;

  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;

  if (page < 1) page = 1;
  if (limit < 1) limit = 10;

  const offset = (page - 1) * limit;

  const pool = getShardPool(id)

  try {
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM posts WHERE user_id = $1`,
      [id]
    );
    const totalPosts = parseInt(countResult.rows[0].count);

    const result = await pool.query(
      `SELECT id, content 
       FROM posts 
       WHERE user_id = $1 
       ORDER BY id DESC 
       LIMIT $2 OFFSET $3`,
      [id, limit, offset]
    );

    res.status(200).json({
      user_id: id,
      posts: result.rows,
      page,
      limit,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      success: true
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: `Something went wrong while processing data.`
    });
  }
};

const readPosts = async () => {
  const data = await fs.readFile(FILE_PATH, 'utf-8');
  console.log("Data: ", data);
  return JSON.parse(data)
}

const writePosts = async (posts) => {
  await fs.writeFile(FILE_PATH, JSON.stringify(posts, null, 2))
}

export const getPosts =  async(req, res) => {
  try {
    const posts = await readPosts()
    res.json(posts);
  } catch(err) {
    res.status(500).json({ message: 'Failed to read posts.', err });
  }
}

export const getPostById = async(req, res) => {
  try {
    const posts = await readPosts();
    const post = posts.find((p) => p.id === parseInt(req.params.id))
    if (!post) return res.status(404).json({ message: 'Post not found.' });
    res.json(post);
  }
  catch(err) {
    res.status(500).json({ message: 'Failed to read post.' });
  }
}

export const createPost = async (req, res) => {
  const { user_id, content } = req.body;

  if(!user_id || !content) {
    return res.status(404).json({ message: 'Title and content are required.'  })
  }

  try {
    console.log("Start......");
    const posts = await readPosts();

    console.log("Start1......");
    const newPost = {
      id: posts.length > 0 ? posts[posts.length - 1].id + 1 : 1,
      user_id: user_id,
      content: content,
    }

    posts.push(newPost);
    await writePosts(posts);
    res.status(201).json(newPost);
  }
  catch(err) {
    res.status(500).json({ message: 'Failed to create post.', err });
  }
}

export const updatePost = async (req, res) => {
  const { user_id, content } = req.body

  try {
    const posts = await readPosts()
    const index = posts.findIndex((p) => p.id === parseInt(req.params.id));

    if (index === -1) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    posts[index] = {
      ...posts[index],
      user_id: user_id || posts[index].user_id,
      content: content || posts[index].content,
    };

    await writePosts(posts);
    res.json(posts[index]);
  }
  catch(err) {
    res.status(500).json({ message: "Failed to update the post." })
  }
};

export const deletePost = async(req, res) => {
  try {
    const posts = await readPosts();
    const index = posts.findIndex((p) => p.id === parseInt(req.params.id));

    if (index === -1) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    const deletedPost = posts.splice(index, 1);
    await writePosts(posts);
    res.json({ message: 'Post deleted.', deletedPost: deletedPost[0] });
  }
  catch(err) {
    res.status(500).json({ message: 'Failed to delete post.' });
  }
}