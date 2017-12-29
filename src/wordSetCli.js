// CLI to get user's choice of data set for the hangman game.
const inquirer = require('inquirer');
const worldCountryData = require('./data/countries.json');

const regions = { count: 0 };
worldCountryData.forEach((country) => {
  const { region, subregion } = country;
  if (!(region in regions)) {
    regions[region] = { count: 0 };
  }
  if (!(subregion in regions[region])) {
    regions[region][subregion] = { count: 0 };
  }
  regions.count += 1;
  regions[region].count += 1;
  regions[region][subregion].count += 1;
});

function getWordSet() {
  return inquirer
    .prompt([{
      name: 'region',
      type: 'list',
      message: 'Choose region',
      choices: () => {
        const list = [];
        let name = '';
        list.push({ name: `World (${regions.count})`, value: 'All' });
        Object.entries(regions).forEach((entry) => {
          const region = entry[0];
          if (region !== 'count') {
            name = region || 'Other';
            list.push({ name: `${name} (${regions[region].count})`, value: region });
          }
        });
        return list;
      },
    }, {
      name: 'subregion',
      type: 'list',
      message: 'Choose subregion',
      when: ({ region }) => region !== 'All' && region !== '',
      choices: ({ region }) => {
        console.log('getting choices');
        const list = [];
        list.push({ name: `All (${regions[region].count})`, value: 'All' });
        Object.entries(regions[region]).forEach((entry) => {
          const subregion = entry[0];
          if (subregion !== 'count') {
            list.push({
              name: `${subregion} (${regions[region][subregion].count})`,
              value: subregion,
            });
          }
        });
        return list;
      },
    }])
    .then(({ region, subregion }) => {
      let filteredData = [];
      if (region === 'All') {
        filteredData = worldCountryData;
      } else if (region === 'Other') {
        filteredData = worldCountryData.filter(country => country.region === '');
      } else if (subregion === 'All') {
        filteredData = worldCountryData.filter(country => country.region === region);
      } else {
        filteredData = worldCountryData.filter(country => country.subregion === subregion);
      }
      return filteredData.map(country => country.name.common);
    });
}

// exports an array of strings
module.exports = { getWordSet };
