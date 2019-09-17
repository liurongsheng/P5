import React, {Component} from 'react'
import {connect} from 'react-redux'
import PreviewList from './components/preview/previewList'
import {push} from 'react-router-redux/lib/actions'
// import axios from 'axios'
import moment from 'moment'
import {defineMessages, intlShape, injectIntl} from 'react-intl'
import {articleGet} from './actions'
import {Button, DatePicker} from 'fish'

const messages = defineMessages({
  'articleAdd': {
    id: 'articleAdd',
    defaultMessage: '添加文章'
  }
})

@injectIntl
@connect(state => {
  return {
    articleList: state.articleList.items
  }
}, {
  articleGet,
  push
})
export default class List extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    push: React.PropTypes.func.isRequired
  }

  render() {
    const {formatMessage} = this.props.intl
    return (
      <div>
        <div style={{marginBottom: '10px'}}>
          <DatePicker defaultValue={moment('2015/01/01', 'YYYY/MM/DD')} />
        </div>
        <Button onClick={() => this.props.push('/add')}>{formatMessage(messages.articleAdd)}</Button>
        <PreviewList {...this.props} />
      </div>
    )
  }
}
