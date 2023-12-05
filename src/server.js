const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const sequelize = require('./sequelize');
var { expressjwt: jwt } = require('express-jwt');
const path = require('path');
//routes
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');

app.use(bodyParser.json());

app.use('/files', express.static('src/images'));

app.use(
  jwt({
    secret: process.env.JWT_TOKEN_KEY,
    algorithms: ['HS256'],
  }).unless({
    path: [
      '/api/auth/register',
      '/api/auth/login',
      //"/api/post/post-likes*",
      '/files/src/*',
      '/app/src/*',
      '/src/*',
      '/files/*',
      '/files/src/*',
    ],
  })
);

app.use(cors());

app.use('/api/auth', authRoutes);

app.use('/api/post', postRoutes);

sequelize.sync({}).then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
