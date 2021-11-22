const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

//Apollo server authentication
module.exports = {
  signToken: function({ username, email, _id }) {
    // create a token with the username, email, and id, signed with the secret
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },

  // function for our authenticated routes
  authMiddleware: function (req, res, next) {
    // allows token to be sent via  req.query or headers
    let token = req.query.token || req.headers.authorization;

    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      return res.status(400).json({ message: 'You have no token!' });
    }

     // if there is no token, return the request object as sent
     if (!token) {
      return req;
  }
  // otherwise...
  try {
      // decode and attach user data to the request object
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
  } catch {
      console.log('Invalid token');
  }
  // return the updated request object
  return req;
}
};
