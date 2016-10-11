const env = Object.assign({
  PORT: 4004,
  HOST: 'localhost',
}, process.env);

module.exports = {
  port: env.PORT,
  host: env.HOST,
};
