const { validateStudySession } = require('../validation');

test('validateStudySession accepts valid input', () => {
  const validInput = { topic: 'Math', duration: 60, date: '2023-05-01' };
  expect(validateStudySession(validInput)).toBe(true);
});

test('validateStudySession rejects missing topic', () => {
  const invalidInput = { duration: 60, date: '2023-05-01' };
  expect(validateStudySession(invalidInput)).toBe(false);
});
