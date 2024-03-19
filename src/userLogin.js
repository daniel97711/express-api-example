const {getData, updateData} = require('./data.js');

const HTTPError = require('http-errors');

const UIDGenerator = require('uid-generator');
const uidGen = new UIDGenerator();

/**
 * Checking if a token(session Id) is valid by reviewing the userId
 * @param {String} userId - a primary key to check if a user exists
 * @param {String} token - an id to check if the user has registerd/logined
 * @return {Number} -1 - if the user or/and the token is invalid
 * @return {String} userId - if the token and the userId are valid
 * (it can return anything but -1)
 */
function isTokenValid(userId, token) {
  const data = getData();

  // check if a user is valid, if not return -1
  const validUser = data.users.find((user) => user.userId === userId);

  if (!validUser) {
    return -1;
  }

  // check if the token is valid, if not return -1
  const validToken = validUser.tokens.find((item) => item.id ===
  token.id && token.active === true);

  if (!validToken) {
    return -1;
  }

  // return whatever (it isn't used in other functions) but -1
  return userId;
}

/**
 * Help a user to login to the system (for authentication purpose)
 * @param {String} email - an email of the user that is used to register
 * @param {String} password - the password of the email that
 * the user used to register
 * @return {Object} - an object of the user's id and the token,
 * which is { id, token: {} }
 */
function userLogin(email, password) {
  const data = getData();

  // throw an error is no user object is in data.users
  if (data.users.length === 0) {
    throw new HTTPError(400, 'Bad request -- no user');
  }
  const user = data.users.find((user) => user.email === email);

  // throw an error if the email is not found
  if (!user) {
    throw new HTTPError(400, 'Bad request -- cannot find email');
  }

  // throw an error if the password is invalid
  if (password !== user.password) {
    throw new HTTPError(400, 'Bad request -- invalid password');
  }
  const newToken = uidGen.generateSync();
  const userIndex = data.users.findIndex((item) => item.email === email);

  // push the randomly generated token to data.users[userIndex].tokens
  data.users[userIndex].tokens.push({
    id: newToken,
    active: true,
  });

  updateData(data);

  return {
    id: data.users[userIndex].userId,
    token: {id: newToken, active: true},
  };
}

/**
 * Help a user to logout from the system (for authentication purpose)
 * @param {String} userId - the user id of the user
 * @param {String} token - the token that the user used to login/register
 * @return {Object} - return an empty object if logout is successful
 */
function userLogout(userId, token) {
  // throw an error if the token is invalid
  if (isTokenValid(userId, token) === -1) {
    throw new HTTPError(400, 'Bad request');
  }

  const data = getData();
  // find the user and its corresponding token
  const userIndex = data.users.findIndex((item) => item.userId === userId);
  const tokenIndex = data.users[userIndex].tokens.findIndex((item) =>
    item.id === token.id && item.active === true);

  // set the active status of the token to false
  data.users[userIndex].tokens[tokenIndex].active = false;
  updateData(data);
  return {};
}

module.exports = {userLogin, userLogout};
