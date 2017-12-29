const inquirer = require('inquirer');
const Word = require('./word.js');


// configuration
const STARTING_GUESSES = 9;

// globals
let words = [];
let word = null;
let guessed = '';
let guessesLeft = 0;

function renderLine(line) {
  console.log(line); // eslint-disable-line
}

function getRandomWord() {
  const index = Math.floor(Math.random() * words.length);
  return words.splice(index, 1)[0];
}

function renderWord(strWord) {
  renderLine(`\n${strWord.split('').join(' ')}\n`);
}

function validateInput(input) {
  // input must be a letter
  if (input.length !== 1 || !/[a-z]/i.test(input)) {
    return false;
  }
  return true;
}

// handle user guess. returns true if round finished
function handleGuess({ guess }) {
  // is letter or has already been guessed
  if (!validateInput(guess)) {
    renderLine('choose a letter');
    return false;
  }
  if (guessed.includes(guess)) {
    renderLine(`Already guessed ${guess}`);
    return false;
  }
  guessed += guess;

  if (!word.hasLetter(guess)) {
    guessesLeft -= 1;
    renderLine(guessesLeft);
    if (guessesLeft === 0) {
      renderLine(`Round over. You failed to correctly guess '${word.source}'`);
      return true;
    }
    renderLine('Incorrect');
    renderLine(`${guessesLeft} guesses remaining`);
    return false;
  }

  word.showLetter(guess);

  // if all letters in the word have been guessed
  if (word.allLettersVisible()) {
    renderWord(word.toString());
    renderLine('You completed the word!');
    return true;
  }
  renderLine('Success!!');
  return false;
}

function promptUser() {
  return inquirer.prompt({
    type: 'input',
    name: 'guess',
    message: 'Guess a letter!',
  });
}

function startRound() {
  // main loop to prompt user and evaluate input
  function nextGuess() {
    // display prompt and masked word
    renderWord(word.toString());
    promptUser()
      .then(handleGuess)
      .then((startNewRound) => {
        if (startNewRound) return startRound();
        return nextGuess();
      });
  }

  // game continues until no words remain
  if (words.length > 0) {
    // initialize values for the round
    word = new Word(getRandomWord(), '_');
    guessed = '';
    guessesLeft = STARTING_GUESSES;
    nextGuess();
  } else {
    renderLine('No more words left');
  }
}

function start(wordsArr) {
  words = wordsArr;
  startRound();
}

module.exports = { start };
