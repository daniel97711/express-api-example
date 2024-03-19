const config = require('./config.json');
const {port, url} = config;
const HTTPError = require('http-errors');
const request = require('sync-request');
const {clear} = require('./data.js');

const serverUrl = `${url}:${port}`;

/**
 * A helper function for the route to register the account
 * @param {String} email - the email of the user
 * @param {String} password - the password of the email
 * @param {String} userName - the user name of the user
 * @return {Object} - the body and the status code returned from the route
 */
function registAccount(email, password, userName) {
  const response = request('PUT', serverUrl + '/user/register',
      {
        json: {
          email: email,
          userName: userName,
          password: password,
        },
      });

  const responseParse = {body: JSON.parse(response.body),
    status: response.statusCode};

  if ('error' in responseParse.body) {
    throw new HTTPError(responseParse.status, responseParse.body);
  } else {
    return {body: responseParse.body, status: responseParse.status};
  }
}

/**
 * A helper function for the route to change the user's password
 * @param {String} email - the email of the user
 * @param {String} password - the old password of the user
 * @param {String} newPassword - the new password of the user
 * @return {Object} - the body and the status code returned from the route
 */
function passwordChange(email, password, newPassword) {
  const response = request('POST', serverUrl + '/user/password',
      {
        json: {
          email: email,
          password: password,
          newPassword: newPassword,
        },
      });

  const responseParse = {body: JSON.parse(response.body),
    status: response.statusCode};

  if ('error' in responseParse.body) {
    throw new HTTPError(responseParse.status, responseParse.body);
  } else {
    return {body: responseParse.body, status: responseParse.status};
  }
}

/**
 * A helper function for the route to helper the user to login to the system
 * @param {String} email - the email of the user
 * @param {String} password - the password of the email
 * @return {Object} - the body and the status code returned from the route
 */
function userLogin(email, password) {
  const response = request(
      'POST',
      serverUrl + '/user/login',
      {
        json: {
          email: email,
          password: password,

        },
      });

  const responseParse = {body: JSON.parse(response.body),
    status: response.statusCode};

  if ('error' in responseParse.body) {
    throw new HTTPError(responseParse.status, responseParse.body);
  } else {
    return {body: responseParse.body, status: responseParse.status};
  }
}

/**
 * A helper function for the route to helper the user to logout from the system
 * @param {String} userId - the user id of the user
 * @param {String} token - the session id that is generated when the
 *  user login/register
 * @return {Object} - the body and the status code returned from the route
 */
function userLogout(userId, token) {
  const response = request(
      'POST',
      serverUrl + '/user/logout',
      {
        json: {
          userId: userId,
          token: token,
        },
      },
  );

  const responseParse = {body: JSON.parse(response.body),
    status: response.statusCode};

  if ('error' in responseParse.body) {
    throw new HTTPError(responseParse.status, responseParse.body);
  } else {
    return {body: responseParse.body, status: responseParse.status};
  }
}

/**
 * A helper function to help the database to clear the data
 * @return {Object} - the body and the status code returned from the route
 */
function dataClear() {
  const response = request('DELETE', serverUrl + '/clear',
      {
        qs: {},
      });

  return {status: response.statusCode,
    body: JSON.parse(response.getBody())};
}

module.exports = {clear, registAccount, passwordChange,
  userLogin, userLogout, dataClear};
