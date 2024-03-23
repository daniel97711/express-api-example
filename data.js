const fs = require('fs');

const data = {
  users: [],
  invoices: [],
};

/**
 * Retrieve the data from the json file
 * @return { Object } - the data being retrived from the json file
 */
function getData() {
  if (fs.existsSync('data.json')) {
    const dbstr = fs.readFileSync('data.json', 'utf-8');
    const data = JSON.parse(dbstr);
    return data;
  }
  fs.writeFileSync('data.json', JSON.stringify(data), {flag: 'w'});
  return data;
}

/**
 * Update the data from the json file
 * @param {Object} newData - data in js format
 */
function updateData(newData) {
  const jsonstr = JSON.stringify(newData);
  fs.writeFileSync('data.json', jsonstr, {flag: 'w'});
}

/**
 * Clear the whole data.json file
 * @return {Object} - an empty object
 */
function clear() {
  fs.writeFileSync('data.json', JSON.stringify(data), {flag: 'w'});
  return {};
}

module.exports = {getData, updateData, clear};
