const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();

const bodyParser = require('body-parser');

mongoose
  .connect(
    'mongodb+srv://k_kovshykova:verystrongpassword@kkovcluster.gwnk0hh.mongodb.net/taskcontroll?retryWrites=true&w=majority',
  )
  .then(() => {
    console.log('Connected to DB succesfully');
  })
  .catch((e) => {
    console.log('Error while connecting to DB' + e);
  });

const { listRouter } = require('./routes/listRouter');
const { taskRouter } = require('./routes/taskRouter');
const { userRouter } = require('./routes/userRouter');
const { commentRouter } = require('./routes/commentRouter');
const { authRouter } = require('./routes/authRouter');
const { User } = require('./models/User');

app.use(morgan('tiny'));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE',
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id',
  );

  res.header(
    'Access-Control-Expose-Headers',
    'x-access-token, x-refresh-token',
  );

  next();
});

let verifySession = (req, res, next) => {
  let refreshToken = req.header('x-refresh-token');
  let _id = req.header('_id');

  User.findByIdAndToken(_id, refreshToken)
    .then((user) => {
      if (!user) {
        return Promise.reject({
          error: 'User not found. Make sure id and token are valid',
        });
      }

      req.user_id = user._id;
      req.userObject = user;
      req.refreshToken = refreshToken;

      let isSessionValid = false;

      user.sessions.forEach((session) => {
        if (session.token === refreshToken) {
          if (User.hasRefreshTokenExpired(session.expiresAt) === false) {
            isSessionValid = true;
          }
        }
      });

      if (isSessionValid) {
        next();
      } else {
        return Promise.reject({
          error: 'Refresh token has expired or the session is invalid',
        });
      }
    })
    .catch((e) => {
      res.status(401).send(e);
    });
};

app.use('/lists', listRouter);
app.use('/lists', commentRouter);
app.use('/lists', taskRouter);
app.use('/users', userRouter);

app.get('/users/me/access-token', verifySession, (req, res) => {
  req.userObject
    .generateAccessAuthToken()
    .then((accessToken) => {
      res.header('x-access-token', accessToken).send({ accessToken });
    })
    .catch((e) => {
      res.status(400).send(e);
    });
});

app.get('/', (req, res) => {
  res.end('<h1>OK</h1>');
});

const start = async () => {
  try {
    app.listen(process.env.PORT || 3000, () => {
      console.log('Server is running on 3000');
    });
  } catch (err) {
    console.error(`Error on server startup: ${err.message}`);
  }
};

start();
