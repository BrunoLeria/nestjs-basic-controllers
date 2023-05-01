import { LoremIpsum } from 'lorem-ipsum';

export const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 6,
    min: 2,
  },
  wordsPerSentence: {
    max: 10,
    min: 4,
  },
});
