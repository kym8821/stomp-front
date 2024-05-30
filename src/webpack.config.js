module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "http://15.165.25.19:8080", // 서버의 도메인
        changeOrigin: true,
      },
    },
  },
};
