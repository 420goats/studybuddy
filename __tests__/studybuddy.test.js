const { calculateStudyProgress } = require('../src/firebase/studyServices');

test('calculates 50% for 30/60 mins', () => {
  expect(calculateStudyProgress(30, 60)).toBe(50);
});
