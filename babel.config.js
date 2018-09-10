const presets = [
  ['@babel/env', {
    targets: {
      browsers: ['last 3 versions', '> 5% in US']
    },
    useBuiltIns: 'usage'
  }]
];

module.exports = { presets };
