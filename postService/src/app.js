import express from 'express';
import postRoutes from './routes/postRoutes.js';
import usersPostsRoute from './routes/usersPostsRoute.js';
import requestsLogger from './middlewares/requestsLogger.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/check', (req, res) => {
  res.send('Post route works!');
})

app.use('/posts', requestsLogger, postRoutes);

app.use('/users', requestsLogger, usersPostsRoute)

// app.use(errorHandler);

const PORT = process.env.PORT || 3001;

const start = () => {
  app.listen(PORT, () => {
    console.log(`Post Service running on port ${PORT}`);
  });
};

start();
