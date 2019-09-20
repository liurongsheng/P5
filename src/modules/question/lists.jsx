import React, {Component} from 'react'
import {Button} from 'fish'
import axios from 'axios'
import InfiniteScroll from 'react-infinite-scroller'
import {timesFormat} from '../../utils'

export default class Lists extends Component {
  state = {
    questionList: []
  };
  componentDidMount() {
    this.loadMore()
  }
  goToAdd = () => {
    this.props.router.push(`add`)
  };

  // 获取全部问题数据
  getQuestions = () => {
    this.setState({
      questionList: [],
      isMine: false
    }, () => {
      this.loadMore()
    })
  };

  // 获取我的问题数据
  getMyQuestions = () => {
    this.setState({
      questionList: [],
      isMine: true,
    }, () => {
      this.loadMore()
    })
  };
  loadMore = (pageIndex = 1) => {
    let url;
    if (this.state.isMine === true) {
      url = `/api/v0.1/questions?_page=${pageIndex}&_limit=2&_sort=date&_order=desc&author=liurongsheng`
    } else {
      url = `/api/v0.1/questions?_page=${pageIndex}&_limit=2&_sort=date&_order=desc`
    }
    axios.get(url).then((data) => {
      if (data.data.length > 0) {
        this.setState({questionList: [...this.state.questionList, ...data.data], init: false, hasMore: true}, () => { console.log(this.state.questionList) })
      } else {
        this.setState({hasMore: false, init: false})
      }
    }).catch(function (error) {
      console.log(error)
    })
  };
  goToDetail = (id) => {
    this.props.router.push(`detail/${id}`)
  };
  render() {
    return (
      <div>
        <header className="header">
          <div className="header_left">答！</div>
          <div className="header_right">
            <Button type="primary" onClick={this.goToAdd}>提问</Button>
          </div>
        </header>
        <div className="tabs">
          <div onClick={this.getQuestions} className="tabs-left fl">首页</div>
          <div onClick={this.getMyQuestions} className="tabs-right fr">我的提问</div>
        </div>
        <div className="question_container">
          {this.state.isMine && <InfiniteScroll
            pageStart={1}
            loadMore={this.loadMore}
            hasMore={this.state.hasMore}
            loader={<div className="loader" key={0}>加载更多…</div>}
          >
            {this.state.questionList.map((item) => <div key={item.id} onClick={() => { this.goToDetail(item.id) }} className="question_item">
              <h3 className="title">{item.title}</h3>
              <div className="desc"><TextLimt text={item.description} /></div>
              <div className="footer">
                <span className="name">{item.name}</span>
                <span className="time">{timesFormat(item.date / 1000)}</span>
                <span className="total">{ (item.answerList && item.answerList.length) ? item.answerList.length : 0}个回答</span>
              </div>
            </div>)}
          </InfiniteScroll>}
          {!this.state.isMine && <InfiniteScroll
            pageStart={1}
            loadMore={this.loadMore}
            hasMore={this.state.hasMore}
            loader={<div className="loader" key={0}>加载更多…</div>}
          >
            {this.state.questionList.map((item) => <div key={item.id} onClick={() => { this.goToDetail(item.id) }} className="question_item">
              <h3 className="title">{item.title}</h3>
              <div className="desc"><TextLimt text={item.description} /></div>
              <div className="footer">
                <span className="name">{item.name}</span>
                <span className="time">{timesFormat(item.date / 1000)}</span>
                <span className="total">{ (item.answerList && item.answerList.length) ? item.answerList.length : 0}个回答</span>
              </div>
            </div>)}
          </InfiniteScroll>}
          {!this.state.hasMore && <div className="bottom">没有更多问题了！</div>}
        </div>
      </div>
    )
  }
}

class TextLimt extends Component {
  state = {
    content: '',
    showAll: false
  };
  componentDidMount() {
    const len = this.props.text.length;
    if (len > 30) {
      this.setState({content: this.props.text.slice(0, 30) + '......', showAll: true})
    } else {
      this.setState({content: this.props.text, showAll: false})
    }
  }

  handleClick = (e) => {
    e.stopPropagation();
    this.setState({content: this.props.text, showAll: false})
  };
  render() {
    return (
      <div>{this.state.content}<span onClick={this.handleClick} style={{display: this.state.showAll ? 'inline-block' : 'none', color: '#339adf'}}>显示全部</span></div>
    )
  }
}
