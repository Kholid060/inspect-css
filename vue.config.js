/* eslint-disable */

module.exports = {
  productionSourceMap: false,
  // pluginOptions: {
  //   webpackBundleAnalyzer: {
  //     openAnalyzer: true,
  //   }
  // },
  chainWebpack: (config) => {
    const rules = ['css', 'postcss'];
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal'];

    rules.forEach((rule) => {
      types.forEach((type) => {
        config.module
          .rule(rule)
          .oneOf(type)
          .use('vue-style-loader')
          .loader('vue-style-loader')
          .tap((options) => {
            if (options) {
              options.shadowMode = true;
            }

            return options;
          });
      });
    });
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => {
        if (options) {
          options.shadowMode = true;
        }

        return options;
      });

    config.module
      .rule('fonts')
      .use('url-loader')
      .loader('url-loader')
      .tap((options) => Object.assign(options, { limit: 30240 }))
  },
  pages: {},
  pluginOptions: {
    browserExtension: {
      componentOptions: {
        background: {
          entry: 'src/background.js',
        },
        contentScripts: {
          entries: {
            'content-script': [
              'src/content-scripts/content-script.js',
            ],
          },
        },
      },
    },
  },
};
