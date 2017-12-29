const Letter = require('./letter.js');

const placeholder = '_';

function Word(word) {
  if (typeof word !== 'string' || !/[a-z]/i.test(word)) {
    throw new Error('word must be a non-empty string with at least one letter');
  }
  if (word.includes('_')) throw new Error('Word cannot contain "_" (underscore)');
  this.letters = word.split('').map(strLetter => new Letter(strLetter, placeholder));
  this.source = word;
}

Word.prototype.allLettersVisible = function allLettersInWordAreVisible() {
  return this.letters.every(letter => !letter.isHidden);
};

Word.prototype.hasLetter = function checkForLetter(strLetter) {
  if (!/[a-z]/i.test(strLetter)) throw new Error(`${strLetter} is not a valid letter`);
  return RegExp(strLetter, 'i').test(this.source);
};

Word.prototype.showLetter = function showLetter(strLetter) {
  for (let index = 0; index < this.letters.length; index += 1) {
    const letter = this.letters[index];
    if (letter.string.toLowerCase() === strLetter.toLowerCase()) letter.isHidden = false;
  }
  return this.hasLetter(strLetter);
};

Word.prototype.toString = function wordToString() {
  return this
    .letters
    .map(letter => (letter.isHidden ? placeholder : letter.string))
    .join(' ');
};

module.exports = Word;
