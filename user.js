const validator = require('validator');
const isEmail = validator.isEmail;
const {getData, updateData} = require('./data.js');

const HTTPError = require('http-errors');

const UIDGenerator = require('uid-generator');
const uidGen = new UIDGenerator();


/**
 * for route /user/register
 * @param {String} email - string, require valid email address
 * @param {String} password - string, need to include at
 * least one upppercase, one lowerCase and one number
 * @param {String} userName - string, alphabetical characters and spaces.
 * @param {String} imagePath - string, path to the user's profile image
 * @return {string}  returns generated userId
 * @return {object}  returns token object with token string
 * id and active boolean
 */
function userRegister(email, password, userName, imagePath) {
  const data = getData();

  const pattern = /^[a-zA-Z\s-'']*$/;
  const syntax = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).+$/;

  if (!pattern.test(userName)) {
    throw new HTTPError(400, 'Invalid user name');
  } else if (isEmail(email) === false) {
    throw new HTTPError(400, 'Please provide existed email');
  } else if (!syntax.test(password)) {
    throw new HTTPError(400, 'Invalid password syntax');
  } else if (data.users.find((user) => user.email === email)) {
    throw new HTTPError(400, 'Email already registered');
  } else if (!imagePath) {
    throw new HTTPError(400, 'Profile image path is required');
  }

  const newToken = {
    id: uidGen.generateSync(),
    active: true,
  };

  const uid = String(Math.floor(Math.random()* 1000));

  const newUser = {
    userId: uid,
    userName: userName,
    email: email,
    password: password,
    imagePath: imagePath,
    tokens: [],
    invoiceList: [],
  };

  newUser.tokens.push(newToken);
  data.users.push(newUser);
  updateData(data);

  return {userId: uid, token: newToken};
}

/**
 * for route /user/password
 * @param {String} email - string, require valid email address
 * @param {String} password - string, need to include at least
 * one uppperCase /one lowerCase and one number
 * @param {String} newPassword - string, same standard as password.
 * @return {String} - telling the result if success
 */
function changePassword(email, password, newPassword) {
  const data = getData();

  const syntax = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).+$/;

  const find = data.users.find((user) => user.email === email);
  if (find === undefined) {
    throw new HTTPError(400, 'Invalid email address');
  } else if (find.password !== password) {
    throw new HTTPError(400, 'Incorrect original password');
  }

  if (!syntax.test(newPassword)) {
    throw new HTTPError(400, 'Invalid password syntax for new password');
  } else if (find.password === newPassword) {
    throw new HTTPError(400, 'newPassword can not be same as old password');
  }

  find.password = newPassword;
  updateData(data);

  // console.log("success!!!!!!!!!");
  return {result: 'successful change password'};
}


function userDetail (userId) {
  const data = getData();

  const user = data.users.find((user) => user.userId === userId);
  if (user !== undefined) {
    let object = {
      userId: user.userId,
      userName: user.userName,
      email: user.email,
      password: user.password,
      imagePath: user.imagePath,
      tokens: user.tokens,
      invoiceList: user.invoiceList
    }
    return object;
  }
  throw new HTTPError(400, 'user not existed');
}



// functions below haven't finish
// const {clear, getData, updateData} = require('./data.js');


// only for testing, will never use in practical env
// function testToken(email, password, userName) {
//   let data = getData();

//   data = {
//     users: [],
//     invoice: [],
//   };

//   const newUser = {
//     userId: '100000',
//     userName: userName,
//     email: email,
//     password: password,
//     tokens: [],
//     invoiceList: [],
//   };
//   const newToken = {
//     id: '100000',
//     active: true,
//   };

//   newUser.tokens.push(newToken);
//   data.users.push(newUser);
//   updateData(data);

//   return token;
// }

module.exports = {userRegister, changePassword, userDetail};
