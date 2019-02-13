const webpack = require('webpack');

module.exports = function override(config, env) {
  if (!config.plugins) {
    config.plugins = [];
  }

  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        SERVICE_ADDR: JSON.stringify(process.env.SERVICE_ADDR)
      }
    })
  );

  return config;
};
