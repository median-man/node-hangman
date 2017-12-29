const chai = require('chai');
const Word = require('../src/word.js');

const should = chai.should();
const { expect } = chai;

// unit tests for Word class
describe('Word', () => {
  describe('when the constructor is called', () => {
    it('should throw if "_" is in the word', () => {
      should.throw(() => Word('_'));
      should.throw(() => Word('a_c'));
      should.throw(() => Word('a _b'));
    });
    it('should throw if there are no letters in the word', () => {
      expect(() => Word(' '), "Word(' ')").to.throw();
    });
    it('hides all the letters', () => {
      let word = new Word('a');
      word.letters[0].isHidden.should.be.true;

      word = new Word('abc');
      word.letters.forEach(letter => letter.isHidden.should.be.true);
    });
    it('shows all symbols and white space', () => {
      let word = new Word(' a ');
      word.letters[0].isHidden.should.be.false;

      word = new Word('(-)$%!#a');
      word.letters.forEach((letter) => {
        if (letter.string !== 'a') expect(letter.isHidden).to.be.false;
      });

      word = new Word('(foo)');
      word.letters[0].isHidden = false;
      word.letters.slice(1, 3).forEach(letter => letter.isHidden.should.be.true);
      word.letters[4].isHidden = false;
    });
  });
  describe('showLetter()', () => {
    it('accepts a letter argument', () => {
      const word = new Word('abc');
      word.showLetter('a');
    });
    it('does nothing if the letter is not in the word', () => {
      const word = new Word('abc');
      word.showLetter('d');
    });
    it('should unhide the letter if it is in the word', () => {
      let word = new Word('abc');
      word.showLetter('b');
      word.letters[0].isHidden.should.be.true;
      word.letters[1].isHidden.should.be.false;
      word.letters[2].isHidden.should.be.true;

      word.showLetter('c');
      word.letters[0].isHidden.should.be.true;
      word.letters[1].isHidden.should.be.false;
      word.letters[2].isHidden.should.be.false;


      word = new Word('foo bar');
      word.showLetter('o');
      word.letters[0].isHidden.should.be.true;
      word.letters[1].isHidden.should.be.false;
      word.letters[2].isHidden.should.be.false;
    });
    it('ignores case', () => {
      let word = new Word('A');
      word.showLetter('a');
      word.letters[0].isHidden.should.be.false;

      word = new Word('a');
      word.showLetter('A');
      word.letters[0].isHidden.should.be.false;
    });
    it('returns true if the letter is in the word', () => {
      const tests = [
        { word: 'abc', letter: 'b' },
        { word: 'foo bar', letter: 'f' },
        { word: 'Foo (bar)', letter: 'r' },
      ];
      tests.forEach((test) => {
        const word = new Word(test.word);
        expect(word.showLetter(test.letter)).to.be.true;
      });
    });
    it('returns false if the letter is not in the word', () => {
      const tests = [
        { word: 'abc', letter: 'd' },
        { word: 'foo bar', letter: 'g' },
        { word: 'Foo (bar)', letter: 'n' },
      ];
      tests.forEach((test) => {
        const word = new Word(test.word);
        expect(word.showLetter(test.letter)).to.be.false;
      });
    });
    it('throws if the parameter is not in the english alphabet', () => {
      const tests = [
        { word: 'abc', letter: '(' },
        { word: 'foo-bar', letter: '-' },
        { word: 'Foo (bar)', letter: ')' },
      ];
      tests.forEach((test) => {
        const word = new Word(test.word);
        expect(() => word.showLetter(test.letter), `word: ${test.word}, letter: ${test.letter}`)
          .to.throw(Error, 'is not a valid letter');
      });
    });
  });
  describe('allLettersVisible()', () => {
    it('returns true if there are no hidden letters', () => {
      const word = new Word('abc efg');
      for (let index = 0; index < word.letters.length; index += 1) {
        word.letters[index].isHidden = false;
      }
      expect(word.allLettersVisible()).to.be.true;
    });
    it('returns false if there are any hidden letters', () => {
      const word = new Word('abc efg');
      word.letters[2].isHidden = false;
      expect(word.allLettersVisible()).to.be.false;
    });
  });
  describe('toString()', () => {
    it('adds a space between all letters and symbols and replaces hidden letters with an "_"', () => {
      let tests = [
        { word: 'a', result: '_' },
        { word: 'aa', result: '_ _' },
        { word: '(a)', result: '( _ )' },
        { word: 'foo-bar', result: '_ _ _ - _ _ _' },
      ];
      tests.forEach((test) => {
        const word = new Word(test.word);
        expect(word.toString(), test.word).to.equal(test.result);
      });

      tests = [
        { word: 'a', result: 'a' },
        { word: 'ba', result: '_ a' },
        { word: '(ab)', result: '( a _ )' },
        { word: 'foo-bar', result: '_ _ _ - _ a _' },
      ];
      tests.forEach((test) => {
        const word = new Word(test.word);
        const index = test.word.indexOf('a');
        word.letters[index].isHidden = false;
        expect(word.toString(), test.word).to.equal(test.result);
      });
    });
  });
});
