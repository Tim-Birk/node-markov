const fs = require('fs');
/** Textual markov chain generator */

class MarkovMachine {
  /** build markov machine; read in text.*/

  constructor(text) {
    let words = text.split(/[ \r\n]+/);
    this.words = words.filter((c) => c !== '');
    this.makeChains();
  }

  /** set markov chains:
   *
   *  for text of "the cat in the hat", chains will be
   *  {"the": ["cat", "hat"], "cat": ["in"], "in": ["the"], "hat": [null]} */

  makeChains() {
    const chain = new Map();
    for (let i = 0; i < this.words.length; i++) {
      const currentWord = this.words[i];
      // check word is not already in the map
      if (!chain.get(currentWord)) {
        // get the next word in array
        const nextWordInitial = this.words[i + 1];
        const chainWords = [];
        // if there is a next word add it to chainWords
        if (nextWordInitial) {
          chainWords.push(nextWordInitial);
        } else {
          // if no next word then currentWord is last in array so add null to chainWords
          chainWords.push(null);
          chain.set(currentWord, chainWords);
          break;
        }

        // loop through remaining words after nextWordInitial to get other instances for currentWord
        for (let x = i + 2; x < this.words.length; x++) {
          const loopWord = this.words[x];
          if (!loopWord) {
            // There are no more words left to loop over
            break;
          }
          // Loop until finding another instance of currentWord
          if (loopWord === currentWord) {
            // get the next word after loopWord
            const nextWordLoop = this.words[x + 1];
            // if there is a next word add it to chainWords
            if (nextWordLoop) {
              chainWords.push(nextWordLoop);
            } else {
              // if no next word then loopWord is last in array so add null to chainWords
              chainWords.push(null);
              break;
            }
          }
        }
        chain.set(currentWord, chainWords);
      }
    }

    this.chains = chain;
    return null;
  }

  /** return random text from chains */

  makeText(numWords = 100) {
    let text = '';
    let wordCount = 0;

    // to start, pick word randomly
    const startWord = this.pickRandomWord(this.words);
    const startFollowWords = this.chains.get(startWord);
    // Select a random word from the following words array
    let followingWord = this.pickRandomWord(startFollowWords);

    if (!followingWord) {
      // hit the end of the chain on the first try, just return start word
      return startWord;
    }
    // add words to text
    text += startWord + ' ' + followingWord;
    // add both words to wordCount
    wordCount += 2;

    while (wordCount <= numWords) {
      // find all words that can come after that word
      let followWords = this.chains.get(followingWord);
      // pick one of those next-words randomly
      const nextWord = this.pickRandomWord(followWords);

      // if not null, add to text and increment wordCount
      if (nextWord) {
        text += ' ' + nextWord;
        wordCount += 1;
      } else {
        // if we picked null, we’ve reached the end of the chain, so stop
        break;
      }
      // make followingWord the current word we just added and restart at step 1
      followingWord = nextWord;
    }
    return text;
  }

  pickRandomWord(arr) {
    return arr[this.randomIntFromInterval(0, arr.length - 1)];
  }

  randomIntFromInterval(min, max) {
    // source: https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}

module.exports = { MarkovMachine: MarkovMachine };
