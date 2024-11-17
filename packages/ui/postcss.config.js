module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-nested': {},
    'postcss-modules': {
      generateScopedName: '[name]__[local]___[hash:base64:5]',
      globalModulePaths: [
        /base/,
        /themes/,
        /tokens\.css$/
      ]
    },
    'postcss-preset-env': {
      stage: 3,
      features: {
        'nesting-rules': true,
        'custom-properties': true,
        'custom-media-queries': true
      }
    }
  }
};