const { validateStudySession } = require('../src/firebase/validation');

test('validates correct input', () => {
  const validInput = { topic: 'Math', duration: 60, date: '2023-05-01' };
  expect(validateStudySession(validInput)).toBe(true);
});
