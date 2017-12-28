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
describe.skip('Word', () => {
  describe('constructor', () => {
    it('accepts a word parameter');
    it('throws if the word is not a string');
    it('throws if the word is an empty string');
    it('adds a letter object to letters for each letter in the word');
  });
});
