const { expect } = require('chai');

const Letter = require('../src/letter.js');
const Word = require('../src/word.js');

// unit tests for Letter class
describe('Letter', () => {
  describe('constructor', () => {
    it('accepts value and placeholder parameters', () => {
      expect(() => new Letter('a', '_')).to.not.throw();
    });
    it('initializes the value and placeholder properties from the parameters', () => {
      expect(new Letter('a', '_')).to.haveOwnProperty('value');
      expect(new Letter('a', '_').value).to.equal('a');
      expect(new Letter('a', '_')).to.haveOwnProperty('placeholder');
      expect(new Letter('a', '_').placeholder).to.equal('_');
    });
    it('throws if the letter is not a valid string for a single letter or space', () => {
      const throwTests = [null, { a: 'a' }, 5, '', 'ab', '5', '_b', '_'];
      expect(() => new Letter(), 'no arguements').to.throw();
      expect(() => new Letter('Z', '_'), 'Z').to.not.throw();
      expect(() => new Letter(' ', '_'), '" "').to.not.throw();
      throwTests.forEach((value) => {
        expect(() => new Letter(value, '_'), `value = ${value}`).to.throw();
      });
    });
    it('throws if placeholder is not a valid placeholder string', () => {
      const throwTests = [null, '', 5];
      const passTests = ['_', '--', '0'];
      // must not be a space
      expect(() => new Letter('a', ' '), 'single space').to.throw();
      throwTests.forEach((placeholder) => {
        expect(() => new Letter('a', placeholder), `placeholder = ${placeholder}`).to.throw();
      });
      passTests.forEach((placeholder) => {
        expect(() => new Letter('a', placeholder), `placeholder = ${placeholder}`).to.not.throw();
      });
    });
    it('sets the isHidden property to true if letter is not a space', () => {
      expect(new Letter('a', '_').isHidden).to.be.true;
    });
    it('sets the isHidden property to false if letter is a space', () => {
      expect(new Letter(' ', '_').isHidden).to.be.false;
    });
  });
  describe('prototype', () => {
    describe('toString', () => {
      it('returns the value property if isHidden is false', () => {
        const letter = new Letter('a', '_');
        letter.isHidden = false;
        expect(letter.isHidden, 'precondition not met').to.be.false;
        expect(letter.value, 'precondition not met').to.equal('a');
        expect(letter.toString()).to.equal('a');
      });
      it('returns the placeholder property if isHidden is true', () => {
        const letter = new Letter('a', '-');
        letter.isHidden = true;
        expect(letter.isHidden, 'precondition not met').to.be.true;
        expect(letter.placeholder, 'precondition not met').to.equal('-');
        expect(letter.toString()).to.equal('-');
      });
    });
  });
});

// unit tests for Word class
describe('Word', () => {
  it('it responds to hasHiddenLetters, showLetter, and hasLetter', () => {
    const methods = ['hasHiddenLetters', 'showLetter', 'hasLetter'];
    methods.forEach((method) => {
      expect(new Word('abc', '-'), method).to.respondTo(method);
    });
  });
  describe('constructor', () => {
    it('accepts a word parameter and a placeholder paremeter', () => {
      Word('hello', '-');
    });
    it('throws if the word is not a string', () => {
      expect(() => new Word(10, '-')).to.throw();
    });
    it('throws if the word is an empty string', () => {
      expect(() => new Word('', '-')).to.throw();
    });
    it('adds a letter object to letters for each letter in the word', () => {
      const placeholder = '-';
      const word = new Word('abc', placeholder);
      const letters = [
        new Letter('a', placeholder),
        new Letter('b', placeholder),
        new Letter('c', placeholder),
      ];
      expect(word.letters).to.be.an('array');
      expect(word.letters.length).to.equal(3);
      expect(word.letters).to.have.deep.members(letters);
    });
    it('initializes the source property as the word argument', () => {
      expect(new Word('abc', '-')).to.haveOwnProperty('source');
      expect(new Word('abc', '-').source).to.equal('abc');
      expect(new Word('a c', '-').source).to.equal('a c');
    });
  });
  describe('toString', () => {
    it('returns the word with hidden letters replaced with the placeholder', () => {
      let word = new Word('abc', '-');
      expect(word.toString()).to.equal('---');

      word = new Word('a b', '-');
      expect(word.toString()).to.equal('- -');

      word = new Word('a b', '-');
      word.letters[2].isHidden = false;
      expect(word.toString()).to.equal('- b');

      word = new Word('a b', '-');
      word.letters[0].isHidden = false;
      word.letters[2].isHidden = false;
      expect(word.toString()).to.equal('a b');
    });
  });
  describe('hasHiddenLetters', () => {
    it('returns true if any of the letters in the word are hidden', () => {
      let word = new Word('abc', '-');
      expect(word.hasHiddenLetters()).to.be.true;

      word = new Word('abc', '-');
      word.letters[1].isHidden = false;
      word.letters[2].isHidden = false;
      expect(word.hasHiddenLetters()).to.be.true;
    });
    it('returns false if all letters are not hidden', () => {
      let word = new Word('a', '-');
      word.letters[0].isHidden = false;
      expect(word.hasHiddenLetters()).to.be.false;

      word = new Word('abc', '-');
      word.letters[0].isHidden = false;
      word.letters[1].isHidden = false;
      word.letters[2].isHidden = false;
      expect(word.hasHiddenLetters()).to.be.false;
    });
  });
  describe('hasLetter', () => {
    it('returns true if the letter is in the source word', () => {
      let word = new Word('a', '-');
      expect(word.hasLetter('a')).to.be.true;

      word = new Word('abc', '-');
      expect(word.hasLetter('b')).to.be.true;

      word = new Word('frodo baggins', '-');
      expect(word.hasLetter('g')).to.be.true;
    });
    it('returns false if the letter is not in the source word', () => {
      let word = new Word('a', '-');
      expect(word.hasLetter('d')).to.be.false;

      word = new Word('abc', '-');
      expect(word.hasLetter('g')).to.be.false;

      word = new Word('frodo baggins', '-');
      expect(word.hasLetter('z')).to.be.false;
    });
  });
  describe('showLetter', () => {
    it('changes the isHidden propery on all matching letters', () => {
      let word = new Word('a', '-');
      word.showLetter('a');
      expect(word.letters[0].isHidden).to.be.false;

      word = new Word('aa', '-');
      word.showLetter('a');
      expect(word.letters).to.satisfy(letters => letters.every(letter => !letter.isHidden));

      word = new Word('a a', '-');
      word.showLetter('a');
      expect(word.letters).to.satisfy(letters => letters.every(letter => !letter.isHidden));
    });
    it('does nothing if there is no matching letter', () => {
      let word = new Word('a', '-');
      expect(() => word.showLetter('d')).to.not.throw();
      expect(word.letters[0].isHidden).to.be.true;
    });
  });
});
