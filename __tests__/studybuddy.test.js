const { calculateStudyProgress } = require('../studybuddy');

test('calculateStudyProgress returns correct percentage', () => {
  expect(calculateStudyProgress(30, 60)).toBe(50);
});

test('calculateStudyProgress handles zero target', () => {
  expect(calculateStudyProgress(30, 0)).toBe(0);
});
