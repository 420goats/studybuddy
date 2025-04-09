const { authenticateUser } = require('../auth');

test('authenticateUser returns true for valid credentials', () => {
  expect(authenticateUser('valid@email.com', 'correctPassword')).toBe(true);
});

test('authenticateUser returns false for invalid credentials', () => {
  expect(authenticateUser('invalid@email.com', 'wrongPassword')).toBe(false);
});
