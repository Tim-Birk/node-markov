const { MarkovMachine } = require('./markov');

describe('MarkovMachine class', () => {
  let mm;
  beforeAll(() => {
    let textInput = 'the cat in the hat is in the hat';
    mm = new MarkovMachine(textInput);
  });

  describe('makeChain function', () => {
    test('adds a Map to the Class', () => {
      expect(mm.chains).toBeInstanceOf(Map);
    });

    test('correct data structure for chain', () => {
      for (let [key, value] of mm.chains) {
        // test map keys are strings
        expect(key).toEqual(expect.any(String));
        // test map values are arrays
        expect(value).toBeInstanceOf(Array);
        // test each value in array is either a string or null
        for (v of value) {
          if (v) {
            expect(v).toEqual(expect.any(String));
          } else {
            expect(v).toEqual(null);
          }
        }
      }
    });

    test('creates correct output for given input', () => {
      const chain = new Map();
      chain.set('the', ['cat', 'hat', 'hat']);
      chain.set('cat', ['in']);
      chain.set('in', ['the', 'the']);
      chain.set('hat', ['is', null]);
      chain.set('is', ['in']);
      expect(mm.chains).toEqual(chain);
    });

    test('get random number function', () => {
      let testTries = 10;
      while (testTries > 0) {
        let randInt = mm.randomIntFromInterval(0, 10);
        expect(randInt).toBeGreaterThanOrEqual(0);
        expect(randInt).toBeLessThanOrEqual(10);
        testTries--;
      }
    });

    test('test get random word', () => {
      let randWord = mm.pickRandomWord(mm.words);
      expect(randWord).toEqual(expect.any(String));
      expect(mm.words).toContain(randWord);
    });

    test('makeText function', () => {
      const numWords = 200;
      const textOutput = mm.makeText(numWords);
      const textArray = textOutput.split(' ');

      // test correct amount of words generated
      expect(textArray.length).toBeLessThanOrEqual(numWords);

      // loop through every word and make sure it is followed by a valid word
      for (let i = 0; i < textArray.length; i++) {
        if (i === textArray.length - 1) {
          break;
        }
        const word = textArray[i];
        const nextWord = textArray[i + 1];

        const possibleWords = mm.chains.get(word);
        // test next word is in possible words that should follow
        expect(possibleWords).toContain(nextWord);
      }
    });
  });
});
