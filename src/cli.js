const inquirer = require('inquirer');
const Word = require('./word.js');

// globals
const words = [];
let word = null;
let guessed = '';
let guessesLeft = 0;

function getRandomWord() {
  const index = Math.floor(Math.random() * words.length);
  return words.splice(index, 1)[0];
}

function renderWord(strWord) {
  console.log(`\n${strWord.split('').join(' ')}\n`);
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
  // letter or has already been guessed
  if (!validateInput(guess) || guessed.includes(guess)) {
    return false;
  }
  guessed += guess;

  if (!word.hasLetter(guess)) {
    guessesLeft -= 1;
    if (guessesLeft === 0) {
      console.log(`Round over. You failed to correctly guess '${word.source}'`);
      return true;
    }
    console.log('Incorrect');
    console.log(`${guessesLeft} guesses remaining`);
    return false;
  }

  word.showLetter(guess);

  // if all letters in the word have been guessed
  if (!word.hasHiddenLetters()) {
    renderWord(word.toString());
    console.log('You completed the word!');
    return true;
  }
  console.log('Success!!');
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
      })
      .catch(console.log);
  }

  // game continues until no words remain
  if (words.length > 0) {
    // initialize values for the round
    word = new Word(getRandomWord(), '_');
    guessed = '';
    guessesLeft = 12;
    nextGuess();
  } else {
    console.log('No more words left');
  }
}

function start() {
  startRound();
}

module.exports = { words, start };
