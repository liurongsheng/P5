import React, {Component, PropTypes} from 'react'
import {addLocaleData, IntlProvider} from 'react-intl'
import {LocaleProvider} from 'fish'
import moment from 'moment'
const defaultLang = 'zh-CN'
// 检查浏览器是否支持intl，不支持则采用IntlPolyfill
if (!global.Intl) {
  global.Intl = require('intl')
  require('./modules/intl')
}
const localesProject = require('./modules')
const localesFish = require('./modules/fish')
const localesReactIntl = require('./modules/react-intl')

Object.values(localesReactIntl).map(localesReactIntlItem => addLocaleData(localesReactIntlItem))
addLocaleData({locale: 'zh-CN', parentLocale: 'zh'})

export default class Intl extends Component {
  static displayName = 'Intl'
  static propTypes = {
    locale: PropTypes.string,
    children: PropTypes.object
  }

  getQueryString(name) {
    const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    const r = global.location.search.substr(1).match(reg)
    if (r != null) {
      return unescape(r[2])
    }
    return null
  }

  render() {
    let locale = this.getQueryString('locale')
    const zoneNow = moment().utcOffset()
    // 语言优先级
    //   1. 从 url query string 中取
    //   2. 从 this.props.locale 中拿
    //   3. 从 浏览器 navigator.languages 中拿
    //   4. 从 浏览器 UI 语言中拿
    if (!locale) {
      const languagesFirstItem = global.navigator.languages && global.navigator.languages[0]
      const language = global.navigator.language || languagesFirstItem || global.navigator.userLanguage || defaultLang
      locale = this.props.locale || language
    }
    // 如果需要的语言不存在，则使用默认语言
    if (!localesProject[locale]) {
      locale = defaultLang
    }
    // 翻译平台的多语言key和moment一致时，可以这么使用，否则需要做Map
    moment.locale(locale)
    return (
      <IntlProvider locale={locale} key={locale} messages={localesProject[locale]}>
        <LocaleProvider locale={{...localesFish[locale], ...{timezoneOffset: zoneNow}}}>
          {this.props.children}
        </LocaleProvider>
      </IntlProvider>
    )
  }
}
