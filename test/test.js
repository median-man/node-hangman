const { expect } = require('chai');

const Letter = require('../src/letter.js');

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
    it('throws if the letter is not a valid string for a single letter', () => {
      const throwTests = [null, { a: 'a' }, 5, '', 'ab', '5', '_b', '_'];
      expect(() => new Letter(), 'no arguements').to.throw();
      expect(() => new Letter('Z', '_'), 'Z').to.not.throw();
      throwTests.forEach((value) => {
        expect(() => new Letter(value, '_'), `value = ${value}`).to.throw();
      });
    });
    it('throws if the placeholder is not a string with a length of at least 1', () => {
      const throwTests = [null, '', 5];
      const passTests = ['_', 'abc', ' '];
      throwTests.forEach((placeholder) => {
        expect(() => new Letter('a', placeholder), `placeholder = ${placeholder}`).to.throw();
      });
      passTests.forEach((placeholder) => {
        expect(() => new Letter('a', placeholder), `placeholder = ${placeholder}`).to.not.throw();
      });
    });
    it('sets the isHidden property to true', () => {
      expect(new Letter('a', ' ').isHidden).to.be.true;
    });
  });
  describe('prototype', () => {
    describe('toString', () => {
      it('returns the value property if isHidden is false', () => {
        const letter = new Letter('a', ' ');
        letter.isHidden = false;
        expect(letter.isHidden, 'precondition not met').to.be.false;
        expect(letter.value, 'precondition not met').to.equal('a');
        expect(letter.toString()).to.equal('a');
      });
      it('returns the placeholder property if isHidden is true', () => {
        const letter = new Letter('a', ' ');
        letter.isHidden = true;
        expect(letter.isHidden, 'precondition not met').to.be.true;
        expect(letter.placeholder, 'precondition not met').to.equal(' ');
        expect(letter.toString()).to.equal(' ');
      });
    });
  });
});
