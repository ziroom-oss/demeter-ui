module.exports = {
  // 在本地调试时，如果需要代理接口到本地服务，请解开以下注释
  // 以下配置与 https://github.com/webpack/webpack-dev-server 相同
  devServer: {
    disableHostCheck: true,
    proxy: {
      '/dev': {
        target: 'http://localhost:8081', // 这里配置的是 请求接口的域名
        // secure: false, // 如果是https接口，需要配置这个参数
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        pathRewrite: {
          '^/dev': '' // 路径重写，这里理解成用'/api'代替target里面的地址。
        }
      }
    },
  },
}