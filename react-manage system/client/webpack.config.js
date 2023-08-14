const path = require('path');

module.exports = {
  // ...其他配置...
  devServer: {
    contentBase: path.join(__dirname, 'build'),
    compress: true,
    port: 3000,
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
};
