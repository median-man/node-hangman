const inquirer = require('inquirer');
const Game = require('./game.js');

function renderLine(line) {
  console.log(line); // eslint-disable-line
}

function renderWord(strWord) {
  renderLine(`\n${strWord.split('').join(' ')}\n`);
}

function promptUser() {
  return inquirer.prompt({
    type: 'input',
    name: 'guess',
    message: 'Guess a letter!',
  });
}

function startRound(word) {
  const game = new Game(word);

  // handle user guess. returns true if round finished
  function handleGuess({ guess: letter }) {
    let isCorrect = false;
    try {
      isCorrect = game.guess(letter);
    } catch (err) {
      if (err.message.includes('Letter must be a single letter')) {
        return false;
      }
      throw err;
    }

    if (isCorrect) {
      renderLine('Success!!');
    }

    if (game.isWon()) {
      renderLine('You won!');
      return true;
    } else if (game.guesses === 0) {
      renderLine(`Game over. You have ${game.guesses} left!`);
      renderLine(`The word is ${game.getWord(true)}`);
      return true;
    }

    if (!isCorrect) {
      renderLine(`Incorrect. ${game.guesses} guesses left!`);
    }
    return false;
  }

  // main loop to prompt user and evaluate input
  function nextGuess() {
    // display prompt and masked word
    renderWord(game.getWord());
    return promptUser()
      .then(handleGuess)
      .then((gameFinished) => {
        if (!gameFinished) return nextGuess();
        return null;
      });
  }
  return nextGuess();
}

// Accepts an array of words to play through.
function start(words) {
  if (!Array.isArray(words)) throw new Error('Expected words to be an array.');
  const index = Math.floor(Math.random() * words.length);
  const word = words.splice(index, 1)[0];
  try {
    renderLine('-'.repeat(20));
    renderLine(''.repeat(20));

    startRound(word).then(() => {
      if (words.length > 0) start(words);
    });
  } catch (error) {
    // skip to next word
    if (words.length > 0) start(words);
  }
}

module.exports = { start };
