const Letter = require('./letter.js');

function Word(word, placeholder) {
  if (typeof word !== 'string' || word.length === 0) {
    throw new Error('word must be a non-empty string');
  }
  this.letters = word.split('').map(strLetter => new Letter(strLetter, placeholder));
  this.source = word;
}

Word.prototype.hasHiddenLetters = function testForHiddenLettersInWord() {
  return this.letters.some(letter => letter.isHidden);
};

Word.prototype.hasLetter = function checkForLetter(strLetter) {
  return RegExp(strLetter, 'i').test(this.source);
};
Word.prototype.showLetter = function showLetter(strLetter) {
  this.letters.forEach((letter) => {
    if (strLetter.toLowerCase() === letter.value.toLowerCase()) {
      letter.isHidden = false;
    }
  });
};

Word.prototype.toString = function wordToString() {
  return this.letters.map(letter => letter.toString()).join('');
};

module.exports = Word;
