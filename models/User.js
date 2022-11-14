const mongoose = require('mongoose');
const _ = require('lodash');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const jwtSecret = '124144556sdfsegddggf45566546546hhhh553333652';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 1,
  },
  sessions: [
    {
      token: {
        type: String,
        required: true,
      },
      expiresAt: {
        type: Number,
        required: true,
      },
    },
  ],
});

userSchema.method.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  return _.omit(userObject, ['password', 'sessions']);
};

userSchema.methods.generateAccessAuthToken = function () {
  const user = this;
  return new Promise((res, rej) => {
    jwt.sign(
      { _id: user._id.toHexString() },
      jwtSecret,
      { expiresIn: '15m' },
      (err, token) => {
        if (!err) {
          res(token);
        } else {
          rej();
        }
      },
    );
  });
};

userSchema.methods.generateRefreshAuthToken = function () {
  return new Promise((res, rej) => {
    crypto.randomBytes(64, (err, buf) => {
      if (!err) {
        let token = buf.toString('hex');
        return res(token);
      }
    });
  });
};

userSchema.methods.createSession = function () {
  let user = this;

  return user
    .generateRefreshAuthToken()
    .then((refreshToken) => {
      return saveSessionToDatabase(user, refreshToken);
    })
    .then((refreshToken) => {
      return refreshToken;
    })
    .catch((e) => {
      return Promise.reject('Failed to save session to database.\n' + e);
    });
};

/* MODEL METHODS*/
userSchema.statics.getJWTSecret = () => {
  return jwtSecret;
};

userSchema.statics.findByIdAndToken = function (_id, token) {
  const User = this;

  return User.findOne({ _id, 'sessions.token': token });
};

userSchema.statics.findByCredentials = function (email, password) {
  let User = this;

  return User.findOne({ email }).then((user) => {
    if (!user) {
      return Promise.reject();
    } else {
      return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (err, res) => {
          if (res) {
            resolve(user);
          } else {
            reject();
          }
        });
      });
    }
  });
};

userSchema.statics.hasRefreshTokenExpired = (expiresAt) => {
  let secondsSinceEpoch = Date.now() / 1000;
  if (expiresAt > secondsSinceEpoch) return false;
  else {
    return true;
  }
};

/*MIDDLEWARE*/

userSchema.pre('save', function (next) {
  let user = this;
  let costFactor = 10;

  if (user.isModified('password')) {
    bcrypt.genSalt(costFactor, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

/*HELPER METHODS*/

let saveSessionToDatabase = (user, refreshToken) => {
  return new Promise((res, rej) => {
    let expiresAt = generateRefreshTokenExpiryTime();

    user.sessions.push({ token: refreshToken, expiresAt });

    user
      .save()
      .then(() => {
        return res(refreshToken);
      })
      .catch((e) => {
        rej(e);
      });
  });
};

let generateRefreshTokenExpiryTime = () => {
  let daysUntilExpire = '10';
  let secondsUntilExpire = daysUntilExpire * 24 * 60 * 60;
  return Date.now() / 1000 + secondsUntilExpire;
};

const User = mongoose.model('User', userSchema);
module.exports = { User };
