const cli = require('./src/cli.js');
const wordSetCli = require('./src/wordSetCli.js');

wordSetCli
  .getWordSet()
  .then(cli.start)
  .catch(() => {
    console.log('The program has crashed. Sorry!');
  });
