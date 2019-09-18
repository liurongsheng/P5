import React, {Component} from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux/lib/actions'
import {intlShape, injectIntl} from 'react-intl'
import {articleGet} from './actions'
import {Button, DatePicker, List, Avatar, Skeleton, message} from 'fish'
import style from "modules/shared/layouts/style.css";
import {IndexLink} from "react-router";

@injectIntl
@connect(state => {
  return {
    articleList: state.articleList.items
  }
}, {
  articleGet,
  push
})
export default class Lists extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    push: React.PropTypes.func.isRequired
  };
  state = {
    initLoading: true,
    loading: false,
    data: [],
    list: [],
    dataLoadAll: false,
    total: 0,
    search: {
      _page: 1,
      _limit: 5,
      _sort: 'date',
      _order: 'desc'
    }
  };
  componentDidMount() {
    const {articleGet, location: {pathname}} = this.props;
    const {search} = this.state;
    if (pathname.includes('mylist')) {
      this.setState({
        search: {
          ...search,
          author: "liurongsheng"
        }
      });
    }
    articleGet().then(res => {
      const {payload: {data}} = res;
      this.setState({
        total: data.length
      });
    });
    articleGet(search).then(res => {
      const {payload: {data}} = res;
      this.setState({
        initLoading: false,
        data: data,
        list: data,
      });
    })
  }
  timefix = (date) => {
    const now_time = new Date().getTime();
    const time = (now_time - date) / 1000;
    let timeText;
    switch (time) {
      case time < 60 :
        timeText = "刚刚";
        break;
      case time < 60 * 60 :
        timeText = `${time / 60}分钟前`;
        break;
      case time < 60 * 60 * 24 :
        timeText = `${time / 60 / 24}小时前`;
        break;
      default:
        timeText = new Date(date).toDateString();
    }
    return timeText;
  };
  onLoadMore = () => {
    this.setState({
      loading: true,
    });
    const {articleGet} = this.props;
    const {search, total} = this.state;
    if (search._page < total / search._limit) {
      search._page += 1;
      articleGet(search).then(res => {
        const {payload: {data}} = res;
        this.setState({
          loading: false,
          list: this.state.data.concat(data),
        })
      })
    } else {
      message.warn("数据已全部加载！");
      this.setState({
        loading: false,
        dataLoadAll: true
      })
    }
  };
  render() {
    const { initLoading, loading, list, dataLoadAll } = this.state;
    const loadMore =
      !initLoading && !loading ? (
        <div style={{ textAlign: 'center', marginTop: 12, marginBottom: 12, height: 32, lineHeight: '32px' }}>
          {
            dataLoadAll
            ? <Button>暂无更多数据</Button>
            : <Button onClick={this.onLoadMore}>加载更多</Button>
          }
        </div>
      ) : null;

    return (
      <div>
        <div>
          <button className={style.nav_right}><IndexLink to="/">首页</IndexLink></button>
          <button className={style.nav_left}><IndexLink to="/mylist">我的提问</IndexLink></button>
        </div>
        {/*<Button onClick={() => this.props.push('/add')}>{formatMessage(messages.articleAdd)}</Button>*/}
        <List
          className="demo-loadmore-list"
          loading={initLoading}
          itemLayout="horizontal"
          loadMore={loadMore}
          dataSource={list}
          renderItem={item => (
            <List.Item actions={[<a>编辑</a>, <a>更多</a>]}>
              <Skeleton avatar title={false} loading={item.loading} active>
                <List.Item.Meta
                  title={<a href="javascript:;">{item.title}</a>}
                  description={item.description}
                />
              </Skeleton>
              <div>
                {item.author}
                {this.timefix(item.date)}
              </div>
            </List.Item>
          )}
        />
      </div>
    )
  }
}
