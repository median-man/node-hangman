// This module exports an array containing the common english names
// of world countries which is extracted from countries.json
// THe data is used under the Open Database License.
// https://mledoze.github.io/countries/
const data = require('./data/countries.json');

module.exports = data.map(country => country.name.common);
