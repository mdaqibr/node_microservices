import pg from 'pg';

import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

export const Post1 = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

export const Post2 = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB2_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

export const getShardPool = (userId) => {
  if (userId <= 2) {
    return Post1;
  } else {
    return Post2;
  }
};