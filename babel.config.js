// module.exports = function (api) {
//   api.cache(true);
//   let plugins = [];

//   plugins.push('react-native-worklets/plugin');

//   return {
//     presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],

//     plugins,
//   }; 
// };

module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel'
    ],
    plugins: [
      'react-native-worklets/plugin',
      [
        'module-resolver',
        {
          root: ['./'], 
          alias: {
            '@': './',
            '@components': './components',
            '@app': './app',
            '@lib': './lib',
          },
          extensions: ['.js', '.jsx', '.ts', '.tsx']
        }
      ]
    ]
  };
};
// module.exports = function (api) {
//   api.cache(true);

//   return {
//     presets: [
//       'babel-preset-expo'
//     ],
//     plugins: [
//       'nativewind/babel',
//       'react-native-worklets/plugin',
//       [
//         'module-resolver',
//         {
//           root: ['./'],
//           alias: {
//             '@': './',
//             '@components': './components',
//             '@app': './app',
//             '@lib': './lib'
//           },
//           extensions: ['.js', '.jsx', '.ts', '.tsx']
//         }
//       ]
//     ]
//   };
// };

