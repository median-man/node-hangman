const chai = require('chai');
const Game = require('../src/game.js');

const { expect } = chai;

// validate the guesses property
function validateGuesses(game) {
  expect(game.guesses, 'guesses property invalid')
    .to.be.a('number').that.satisfies(guesses => Number.isInteger(guesses))
    .and.to.be.at.least(0);
}

describe('Game', () => {
  function hasMethod(methodName) {
    it(`has a ${methodName} method`, () => {
      expect(new Game('Yew')).to.respondsTo(methodName);
    });
  }
  it('is a constructor function', () => {
    expect(Game).to.be.a('function');
  });

  // test for error conditions
  it('throws if no argument is passed in', () => {
    expect(() => Game()).to.throw();
  });
  it('throws if word argument is not a string', () => {
    const tests = [45, ['abc'], { word: 'abc' }];
    tests.forEach((test) => {
      expect(() => Game(test), test).to.throw();
    });
  });

  it('throws if there are no letters in word', () => {
    expect(() => Game('--')).to.throw();
  });

  it('throws if the placeholder is in the word', () => {
    expect(() => Game('Valley_Oak')).to.throw();
  });

  it('throws if there is white space or line breaks in the word', () => {
    const tests = ' \f\n\r\t\v\u00a0\u1680\u2000\u200a\u2028\u2029\u202f\u205f\u3000\ufeff';
    tests.split('').forEach((character) => {
      const word = `Valley${character}oak`;
      expect(() => new Game(word), word).to.throw();
    });
  });

  it('has a valid guesses property', () => {
    expect(new Game('pine')).to.haveOwnProperty('guesses');
    validateGuesses(new Game('pine'));
  });

  // test for existance of api methods
  ['getWord', 'guess', 'isWon'].forEach(hasMethod);

  describe('getWord', () => {
    // placeholder used by Word for hidden letters
    const placeHolder = '_';

    // accepts array of test objects and evaluates each test
    function runTests(tests) {
      tests.forEach(({
        word,
        result: expectedResult,
        unMask,
        guess,
      }) => {
        const game = new Game(word);
        if (guess) game.guess(guess);
        if (!unMask) expect(game.getWord(), word).to.equal(expectedResult);
        else expect(game.getWord(unMask), word).to.equal(expectedResult);
      });
    }

    it('returns a string', () => {
      expect(new Game('birch').getWord()).to.be.a('string');
    });

    it('throws if unMask exists and is not a boolean', () => {
      ['true', ['true'], null, { unMask: true }].forEach((argument) => {
        expect(() => new Game('aspen').getWord(argument), typeof argument).to.throw();
      });
    });

    it('reveals all characters (no placeholders) when unMask is true', () => {
      runTests([
        { word: 'oak', result: 'oak', unMask: true },
        { word: 'joshua!', result: 'joshua!', unMask: true },
        { word: 'sequoia', result: 'sequoia', unMask: true },
      ]);
    });

    describe('when no letters have been guessed', () => {
      it('all letters are replaced with a placeholder', () => {
        runTests([
          { word: 'oak', result: placeHolder.repeat(3) },
          { word: 'birch', result: placeHolder.repeat(5) },
          { word: 'sequoia', result: placeHolder.repeat(7) },
        ]);
      });

      it('symbols are not replaced with a placeholder', () => {
        runTests([
          { word: '(oak)', result: `(${placeHolder.repeat(3)})` },
          { word: 'joshua!', result: `${placeHolder.repeat(6)}!` },
          { word: 'elm-tree', result: `${placeHolder.repeat(3)}-${placeHolder.repeat(4)}` },
        ]);
      });
    });

    describe('when a letter has been guessed', () => {
      it('symbols and the guessed letter are not replaced with a placeholder', () => {
        runTests([
          { word: 'fir', guess: 'i', result: `${placeHolder}i${placeHolder}` },
          { word: '(fir)', guess: 'i', result: `(${placeHolder}i${placeHolder})` },
        ]);
      });
    });
  });

  describe('guess', () => {
    function testGuess({ word, guess, result }) {
      if (result) expect(new Game(word).guess(guess)).to.be.true;
      else expect(new Game(word).guess(guess)).to.be.false;
    }
    it('throws when letter argument is not a single letter (a-z). (ignores case)', () => {
      expect(() => new Game('willow').guess(), 'no argument').to.throw();
      [true, { o: 'o' }, ['o'], 'ab', '!'].forEach((guess) => {
        expect(() => new Game('willow').guess(guess), guess).to.throw();
      });
    });
    it(
      'throws with a message "No guesses remaining." if guesses remaining is 0 or less',
      () => {
        const game = new Game('z');

        // call game.guess to reduce guesses
        expect(() => {
          const allLetters = 'abcdefghijklmnopqrstuvwxyz';
          let letterIndex = 0;
          while (game.guesses > -1) {
            game.guess(allLetters[letterIndex]);
            letterIndex += 1;
          }
        }).to.throw('No guesses remaining.');
      },
    );
    describe('when the letter is in the word', () => {
      it('returns true', () => {
        const tests = [
          { word: 'cottonwood', guess: 'n', result: true },
          { word: 'Cottonwood', guess: 'c', result: true },
          { word: 'CottonWood', guess: 'w', result: true },
          { word: 'cottonwood', guess: 'T', result: true },
        ];
        tests.forEach(testGuess);
      });
      it('guesses remaining remains unchanged', () => {
        const game = new Game('pine');
        expect(() => game.guess('i')).not.change(game, 'guesses');
        validateGuesses(game); // ensure guesses property is valid
      });
    });
    describe('when the letter is not in the word', () => {
      it('returns false if letter is not in the word', () => {
        const tests = [
          { word: 'beech', guess: 'a', result: false },
          { word: 'beech', guess: 'D', result: false },
        ];
        tests.forEach(testGuess);
      });
      it('decrements guesses remaining by 1', () => {
        const game = new Game('pine');
        expect(() => game.guess('a')).to.decrease(game, 'guesses').by(1);
        validateGuesses(game); // ensure guesses property is valid
      });
    });
  });

  describe('isWon', () => {
    function runTest(word, guesses, result) {
      const game = new Game(word);
      guesses.split('').forEach(letter => game.guess(letter));
      expect(game.isWon()).to.equal(result);
    }
    it('returns a boolean', () => {
      expect(new Game('Douglas-fir').isWon()).to.be.a('boolean');
    });
    it('returns true if all the letters in the word have been guessed', () => {
      runTest('hemlock', 'hemlock', true);
    });
    it('returns false if the word has any letters not yet guessed', () => {
      runTest('hemlock', 'hldc', false);
      runTest('fir', 'fr', false);
    });
  });
});
