module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'babel-plugin-root-import',
      {
        paths: [
          {
            rootPathSuffix: './app',
            rootPathPrefix: '@app/', // 使用 ~/  代替 ./src (~指向的就是src目录)
          },
        ],
      },
    ],
  ],
};
