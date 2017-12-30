/* This class provides the model and logic for a game of hangman.
*/

/* class description

Constructor
  accepts a word which must be a string with no white space and must not contain
  the placeholder character ("_")

Properties
  Number guesses  - The number of guesses remaining

Methods
  String getWord(unMask)
    unMask is a boolean
    returns the word with a placeholder for all letters that haven't been guessed
    if unMask is true, returns the word with all letters shown

  Boolean guess(letter)
    letter must be a string and a letter from the english alphabet
    returns true if the letter is in the word (ignores case)
    returns false if the letter is not in the word
    throws an error('No guesses remainomg.') if guesses is <= 0

  Boolean isWon()
    returns true if all letters in the word have been guessed else returns false

 */

// dependencies
const Word = require('./word.js');

// config globals
const placeholder = '_'; // used to mask hidden letters
const maxGuesses = 8; // max failed guesses per word

function Game(word) {
  // throw an error if word is invalid
  if (typeof word !== 'string') throw new Error('Expected word to be a string.');
  if (!/[a-z]/i.test(word)) throw new Error('Expected word to have a letter');
  if (word.includes(placeholder)) throw new Error(`Word must not contain ${placeholder}`);
  if (/\s/g.test(word)) throw new Error('Word cannot contain white space');

  this.word = word;
  this.guesses = maxGuesses;
  this.guessedLetters = '';
}

// Returns the word masking hidden letters with placeholder unless unMask is true.
Game.prototype.getWord = function getWord(unMask = false) {
  if (typeof unMask !== 'boolean') throw new Error('UnMask must be a boolean.');

  const word = this.word
    .split('')
    .map((letter) => {
      if (/[a-z]/i.test(letter) && !this.guessedLetters.includes(letter)) {
        return placeholder;
      }
      return letter;
    })
    .join('');

  return unMask ? this.word : word;
};

// Unhides letter and returns true if letter is in the word else returns false.
Game.prototype.guess = function guessLetter(letter) {
  // throws if letter argument is not valid
  if (typeof letter !== 'string' || !/^[a-z]$/i.test(letter)) {
    throw new Error('Letter must be a single letter (a-z)');
  }

  const lowerCase = letter.toLowerCase();

  // throws if game is over
  if (this.guesses <= 0) throw new Error('No guesses remaining.');

  // decrement guesses if the letter is not in the word and not already guessed
  const isInWord = RegExp(lowerCase, 'i').test(this.word);
  if (!isInWord && !this.guessedLetters.includes(lowerCase)) {
    this.guesses -= 1;
  }

  // track guessed letters
  this.guessedLetters += lowerCase;

  return isInWord;
};

// Game is won if all leters in the word have been guessed
Game.prototype.isWon = function gameIsWon() {
  return this.getWord() === this.word;
};

module.exports = Game;
