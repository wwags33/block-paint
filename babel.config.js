const presets = [
  ['@babel/env', {
    useBuiltIns: 'usage'
  }]
];

const env = {
  production: {
    presets: ['minify']
  }
};

module.exports = { presets, env };
