import React from 'react'
import { IndexLink } from 'react-router'
import { defineMessages, intlShape, injectIntl } from 'react-intl'
const messages = defineMessages({
  home: {
    id: 'home',
    defaultMessage: '首页'
  }
})

@injectIntl
class Nav extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired
  }
  render() {
    const { formatMessage } = this.props.intl
    const needFac = window.__config.packageJson && window.__config.packageJson.needFac
    const langList = needFac && window.__config.langList ? window.__config.langList : []
    return (
      <nav style={{ marginBottom: 10 }}>
        <IndexLink to="/">{formatMessage(messages.home)}</IndexLink>
        {langList.map(langItem => (
          <a key={langItem} href={`${global.location.pathname}?locale=${langItem}`} style={{ paddingLeft: 10 }}>
            {formatMessage({ id: `lang_${langItem}` }) || langItem}
          </a>
        ))}
      </nav>
    )
  }
}

export default Nav
