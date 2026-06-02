module.exports = {
  presets: ['module:@react-native/babel-preset', 'nativewind/babel'],
  plugins: ['./scripts/babelInlineDotenv', 'react-native-reanimated/plugin'],
};
