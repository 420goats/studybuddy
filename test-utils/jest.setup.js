jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  createStaticNavigation: jest.fn()
}));

jest.mock('react-native-reanimated', () => 
  require('react-native-reanimated/mock')
);