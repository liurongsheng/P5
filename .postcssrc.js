const path = require('path')
const srcPath = path.join(__dirname, 'src')
module.exports = {
  ident: 'postcss',
  plugins: [
    require('postcss-import')({
      path: srcPath + '/theme/styles'
    }),
    require('postcss-assets')({
      relative: true,
      loadPaths: [srcPath + '/static/images']
    }),
    require('postcss-preset-env')({
      browsers: ['> 5%', 'ie >= 9'],
      features: {
        customProperties: {
          variables: require(srcPath + '/theme/styles/variables.js')
        },
        autoprefixer: true
      }
    }),
    require('postcss-browser-reporter'),
    require('postcss-reporter')
  ]
}
