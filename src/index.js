import 'theme/styles/app.css'
import 'theme/styles/app.scss'
// 使用babel-plugin-transform-runtime不能完全代替babel-polyfill
import 'babel-polyfill'
if (typeof global.Promise === 'undefined') {
  require('es6-promise/auto')
}
// api地址配置，及一些根据环境配置的常量
window.__config = process.env.__CONFIG
const React = require('react')
if (!React.PropTypes) {
  React.PropTypes = require('prop-types')
}
if (!React.createClass) {
  React.createClass = require('create-react-class')
}
const render = require('react-dom').render
const Provider = require('react-redux').Provider
const syncHistoryWithStore = require('react-router-redux/lib/sync').default
const configureStore = require('./store/configureStore')
const routes = require('./routes')
const routerHistory = require('react-router').useRouterHistory
const createHistory = require('history').createHashHistory
const store = configureStore()
// 移除react-router自动添加的_k=xxx参数
const hashHistory = routerHistory(createHistory)({queryKey: false})
const history = syncHistoryWithStore(hashHistory, store)

render((
  <Provider store={store}>
    {routes(history)}
  </Provider>
), document.getElementById('app'))
